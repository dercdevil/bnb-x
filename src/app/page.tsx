"use client";

import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import WalletForm from "@/components/WalletForm";
import TweetVerification from "@/components/TweetVerification";
import CampaignStatus from "@/components/CampaignStatus";
import { Campaign } from "@/types";
import { ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<"wallet" | "tweet">("wallet");
  const [wallet, setWallet] = useState("");
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(true);

  useEffect(() => {
    fetchCampaignInfo();
  }, []);

  const fetchCampaignInfo = async () => {
    try {
      const response = await fetch("/api/campaign");
      const data = await response.json();
      setCampaign(data);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      toast.error("Error loading campaign information");
    } finally {
      setIsLoadingCampaign(false);
    }
  };

  const handleWalletSubmit = (walletAddress: string) => {
    setWallet(walletAddress);
    setCurrentStep("tweet");
  };

  const handleTweetSubmit = async (tweetUrl: string) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/verify-tweet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: wallet,
          tweetUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("¡Tweet verificado y USDT enviado exitosamente!");
        // Actualizar información de la campaña
        await fetchCampaignInfo();
        // Resetear formulario
        setCurrentStep("wallet");
        setWallet("");
      } else {
        toast.error(data.error || "Error verifying tweet");
      }
    } catch (error) {
      console.error("Error submitting tweet:", error);
      toast.error("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWallet = () => {
    setCurrentStep("wallet");
    setWallet("");
  };

  const isCampaignActive =
    campaign?.isActive && campaign?.currentUsers < campaign?.maxUsers;

  if (isLoadingCampaign) {
    return (
      <div
        className="min-h-screen relative flex items-center justify-center"
        style={{
          backgroundImage: "url('/grabacion.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-white">Cargando campaña...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/grabacion.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10">
        <Toaster position="top-right" />

        {/* Header */}
        <header className="bg-black/10 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/tokenizado-logo.webp"
                  alt="Tokenizados Logo"
                  className="w-10 h-10 rounded-lg"
                />
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Campaña USDT x Tokenizados
                  </h1>
                  <p className="text-sm text-green-200">
                    Publica en X y gana 1 USDT
                  </p>
                </div>
              </div>
              {/* <a
                href="/admin"
                className="flex items-center gap-2 text-green-200 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg"
              >
                <span className="text-sm">Admin</span>
                <ExternalLink className="w-4 h-4" />
              </a> */}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Bienvenido a la Campaña
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-green-400 mb-8">
              USDT x Tokenizados
            </h2>
            <p className="text-xl text-green-200 mb-12 max-w-2xl mx-auto">
              Publica en X sobre Tokenizados y gana 1 USDT. Solo para los
              primeros 20 usuarios.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            {/* Campaign Status */}
            {campaign && (
              <CampaignStatus
                currentUsers={campaign.currentUsers}
                maxUsers={campaign.maxUsers}
                rewardAmount={campaign.rewardAmount}
                isActive={isCampaignActive || false}
              />
            )}

            {/* Main Form */}
            <div className="flex-1 max-w-md">
              {currentStep === "wallet" ? (
                <WalletForm
                  onWalletSubmit={handleWalletSubmit}
                  isDisabled={!isCampaignActive}
                />
              ) : (
                <TweetVerification
                  wallet={wallet}
                  onTweetSubmit={handleTweetSubmit}
                  isLoading={isLoading}
                  isDisabled={!isCampaignActive}
                />
              )}

              {currentStep === "tweet" && (
                <button
                  onClick={handleBackToWallet}
                  className="mt-4 w-full text-center text-sm text-green-200 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
                >
                  ← Volver a ingresar wallet
                </button>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Sobre Tokenizados
                </h2>
                <p className="text-green-200 max-w-2xl mx-auto">
                  Tu portal de información sobre tokenización y blockchain.
                  Mantente al día con las últimas novedades del mundo Web3 con
                  contenido verificado y análisis profundos de expertos en la
                  industria.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-green-500/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 border border-green-400/30">
                    <span className="text-green-400 font-bold text-xl">✓</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">
                    100% Garantizado
                  </h3>
                  <p className="text-sm text-green-200">
                    Información verificada y confiable sobre blockchain
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-500/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 border border-green-400/30">
                    <span className="text-green-400 font-bold text-xl">📚</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">
                    Contenido Confiable
                  </h3>
                  <p className="text-sm text-green-200">
                    Análisis profundos de expertos en la industria
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-500/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 border border-green-400/30">
                    <span className="text-green-400 font-bold text-xl">⚡</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">
                    Acceso Rápido
                  </h3>
                  <p className="text-sm text-green-200">
                    Encuentra información actualizada de forma eficiente
                  </p>
                </div>
              </div>

              <div className="text-center mt-8">
                <a
                  href="https://tokenizados.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Ver artículos
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/tokenizado-logo.webp"
                alt="Tokenizados Logo"
                className="w-8 h-8 rounded"
              />
              <span className="text-white font-semibold">Tokenizados</span>
            </div>
            <p className="text-green-200">
              © 2025 Campaña USDT x Tokenizados. Desarrollado para promover{" "}
              <a
                href="https://tokenizados.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-colors font-medium"
              >
                Tokenizados.net
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
