"use client";

import { useState } from "react";
import { validateWalletAddress } from "@/lib/web3";
import { Wallet } from "lucide-react";
import toast from "react-hot-toast";
import TweetPreview from "./TweetPreview";

interface WalletFormProps {
  onWalletSubmit: (wallet: string) => void;
  isDisabled: boolean;
}

export default function WalletForm({
  onWalletSubmit,
  isDisabled,
}: WalletFormProps) {
  const [wallet, setWallet] = useState("");
  const [isValidWallet, setIsValidWallet] = useState(false);

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setWallet(value);
    setIsValidWallet(validateWalletAddress(value));
  };

  const handleGenerateTweet = () => {
    if (!isValidWallet) {
      toast.error("Por favor, ingresa una dirección de wallet válida");
      return;
    }

    if (isDisabled) {
      toast.error("La campaña ha alcanzado el límite máximo de usuarios");
      return;
    }

    // Crear URL directamente y abrirla (sin APIs)
    const tweetText = `🚀 ¡Descubre el futuro de la tokenización! 

💎 Información confiable sobre blockchain y Web3

Mi wallet: ${wallet}

#Tokenización #Blockchain #Web3 #USDT #BSC

https://tokenizados.net/`;

    const encodedText = encodeURIComponent(tweetText);
    const url = `https://x.com/intent/post?text=${encodedText}`;

    // Abrir X en nueva pestaña
    window.open(url, "_blank");

    // Notificar al componente padre
    onWalletSubmit(wallet);

    toast.success(
      "¡Tweet generado! Publica el tweet y luego pega la URL aquí."
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl p-8 max-w-md w-full">
      <div className="text-center mb-6">
        <div className="bg-green-500/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-green-400/30">
          <Wallet className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Participa y Gana 3 USDT
        </h2>
        <p className="text-green-200 text-sm">
          Solo para los primeros 10 usuarios
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="wallet"
            className="block text-sm font-medium text-white mb-2"
          >
            Dirección de Wallet BSC
          </label>
          <input
            type="text"
            id="wallet"
            value={wallet}
            onChange={handleWalletChange}
            placeholder="0x..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-colors bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 ${
              wallet && !isValidWallet
                ? "border-red-400/50 bg-red-500/10"
                : isValidWallet
                ? "border-green-400/50 bg-green-500/10"
                : "border-white/20"
            }`}
            disabled={isDisabled}
          />
          {wallet && !isValidWallet && (
            <p className="text-red-400 text-xs mt-1">
              Dirección de wallet inválida
            </p>
          )}
          {isValidWallet && (
            <p className="text-green-400 text-xs mt-1">✓ Dirección válida</p>
          )}
        </div>

        {/* Vista previa del tweet cuando la wallet es válida */}
        {isValidWallet && !isDisabled && (
          <TweetPreview
            walletAddress={wallet}
            onGenerateTweet={handleGenerateTweet}
          />
        )}

        {/* Botón deshabilitado cuando la campaña está finalizada */}
        {isDisabled && (
          <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 text-center border border-red-400/30">
            <p className="text-red-300 font-semibold">Campaña Finalizada</p>
            <p className="text-red-200 text-sm">
              Se alcanzó el límite máximo de participantes
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-green-500/10 backdrop-blur-sm rounded-lg border border-green-400/30">
        <h3 className="font-semibold text-green-300 mb-2">Instrucciones:</h3>
        <ol className="text-sm text-green-200 space-y-1">
          <li>1. Ingresa tu dirección de wallet BSC</li>
          <li>2. Haz clic en &quot;Generar Tweet&quot;</li>
          <li>3. Publica el tweet en tu cuenta</li>
          <li>4. Copia la URL del tweet publicado</li>
          <li>5. Pégala en el siguiente paso</li>
        </ol>
      </div>
    </div>
  );
}
