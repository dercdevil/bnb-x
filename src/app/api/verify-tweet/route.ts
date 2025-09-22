import { NextRequest, NextResponse } from "next/server";
import { FirebaseService } from "@/services/firebaseService";
import { sendBNB } from "@/lib/web3";
import { validateWalletAddress } from "@/lib/web3";
import {
  validateTweetUrl,
  extractTweetId,
  validateTweetContent,
} from "@/lib/twitter";

const firebaseService = new FirebaseService();

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, tweetUrl } = await request.json();

    // Validaciones básicas
    if (!walletAddress || !tweetUrl) {
      return NextResponse.json(
        { error: "Wallet address and tweet URL are required" },
        { status: 400 }
      );
    }

    if (!validateWalletAddress(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    if (!validateTweetUrl(tweetUrl)) {
      return NextResponse.json({ error: "Invalid tweet URL" }, { status: 400 });
    }

    // Verificar estado de la campaña
    const campaign = await firebaseService.getCampaignInfo();
    if (!campaign.isActive || campaign.currentUsers >= campaign.maxUsers) {
      return NextResponse.json(
        {
          error:
            "Campaign is no longer active or has reached maximum participants",
        },
        { status: 400 }
      );
    }

    // Extraer ID del tweet
    const tweetId = extractTweetId(tweetUrl);
    if (!tweetId) {
      return NextResponse.json(
        { error: "Could not extract tweet ID from URL" },
        { status: 400 }
      );
    }

    // Verificar que el tweet contenga los elementos requeridos usando oEmbed (sin API key)
    const validationResult = await validateTweetContent(
      tweetUrl,
      walletAddress
    );

    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          error: validationResult.error || "El tweet no cumple los requisitos",
          details:
            "Debe mencionar 'tokenización', incluir tu wallet y el enlace tokenizados.net",
          username: validationResult.username,
          warning:
            "Si crees que esto es un error, el administrador puede revisar manualmente tu tweet.",
        },
        { status: 400 }
      );
    }

    // Verificar elegibilidad completa (wallet, tweet y username únicos)
    const eligibilityCheck = await firebaseService.checkUserEligibility(
      walletAddress,
      tweetId,
      validationResult.username
    );

    if (!eligibilityCheck.isEligible) {
      return NextResponse.json(
        {
          error: eligibilityCheck.error,
          details:
            "Solo se permite una participación por wallet, tweet o usuario de X",
          conflictType: eligibilityCheck.conflictType,
          username: validationResult.username,
        },
        { status: 400 }
      );
    }

    // Agregar usuario a la base de datos
    const userId = await firebaseService.addUser({
      walletAddress,
      tweetUrl,
      tweetId,
      tweetUsername: validationResult.username,
      status: "verified",
    });

    try {
      // Enviar BNB
      const txHash = await sendBNB(walletAddress, campaign.rewardAmount);

      // Actualizar estado del usuario y campaña
      await firebaseService.updateUserStatus(userId, "rewarded", txHash);
      await firebaseService.updateCampaignUsers(1);

      // Verificar si se alcanzó el límite
      const updatedCampaign = await firebaseService.getCampaignInfo();
      if (updatedCampaign.currentUsers >= updatedCampaign.maxUsers) {
        // La campaña se considera inactiva cuando se alcanza el límite
      }

      return NextResponse.json({
        success: true,
        message: "Tweet verified and BNB sent successfully!",
        txHash,
        userId,
      });
    } catch (error) {
      // Si falla la transferencia, marcar como pendiente para revisión manual
      console.error("Transfer error:", error);
      await firebaseService.updateUserStatus(userId, "pending");

      return NextResponse.json(
        {
          error:
            "Tweet verified but BNB transfer failed. Please contact support.",
          userId,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error verifying tweet:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
