"use client";

import { useState } from "react";
import { validateTweetUrl, extractTweetId } from "@/lib/twitter";
import { Link, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface TweetVerificationProps {
  wallet: string;
  onTweetSubmit: (tweetUrl: string) => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export default function TweetVerification({
  wallet,
  onTweetSubmit,
  isLoading,
  isDisabled,
}: TweetVerificationProps) {
  const [tweetUrl, setTweetUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setTweetUrl(value);
    setIsValidUrl(validateTweetUrl(value));
  };

  const handleSubmit = () => {
    if (!isValidUrl) {
      toast.error("Por favor, ingresa una URL de tweet válida");
      return;
    }

    if (isDisabled) {
      toast.error("La campaña ha alcanzado el límite máximo de usuarios");
      return;
    }

    const tweetId = extractTweetId(tweetUrl);
    if (!tweetId) {
      toast.error("No se pudo extraer el ID del tweet");
      return;
    }

    onTweetSubmit(tweetUrl);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl p-8 max-w-md w-full">
      <div className="text-center mb-6">
        <div className="bg-green-500/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-green-400/30">
          <Link className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Verifica tu Tweet
        </h2>
        <p className="text-green-200 text-sm">
          Wallet:{" "}
          <span className="font-mono text-xs text-green-300">{wallet}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="tweetUrl"
            className="block text-sm font-medium text-white mb-2"
          >
            URL del Tweet Publicado
          </label>
          <input
            type="url"
            id="tweetUrl"
            value={tweetUrl}
            onChange={handleUrlChange}
            placeholder="https://twitter.com/usuario/status/1234567890"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-colors bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 ${
              tweetUrl && !isValidUrl
                ? "border-red-400/50 bg-red-500/10"
                : isValidUrl
                ? "border-green-400/50 bg-green-500/10"
                : "border-white/20"
            }`}
            disabled={isLoading || isDisabled}
          />
          {tweetUrl && !isValidUrl && (
            <p className="text-red-400 text-xs mt-1">
              URL de tweet inválida. Debe ser de twitter.com o x.com
            </p>
          )}
          {isValidUrl && (
            <p className="text-green-400 text-xs mt-1">✓ URL válida</p>
          )}
        </div>

        {/* Mostrar solo que la URL es válida, sin hacer verificación previa */}
        {isValidUrl && (
          <div className="bg-green-500/10 backdrop-blur-sm rounded-lg p-4 border border-green-400/30">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-200">
                URL válida - Listo para verificar
              </span>
            </div>
            <p className="text-green-200 text-xs mt-2">
              La verificación se realizará cuando envíes el formulario
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isValidUrl || isLoading || isDisabled}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            !isValidUrl || isLoading || isDisabled
              ? "bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-500/30"
              : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:scale-105 shadow-lg border border-green-400/30"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              {isDisabled ? "Campaña Finalizada" : "Verificar y Reclamar BNB"}
            </>
          )}
        </button>
      </div>

      <div className="mt-6 p-4 bg-green-500/10 backdrop-blur-sm rounded-lg border border-green-400/30">
        <h3 className="font-semibold text-green-300 mb-2">
          Requisitos del Tweet:
        </h3>
        <ul className="text-sm text-green-200 space-y-1">
          <li>• Debe mencionar &quot;tokenización&quot;</li>
          <li>• Debe incluir tu dirección de wallet</li>
          <li>• Debe incluir el enlace a tokenizados.net</li>
          <li>• El tweet debe ser público</li>
        </ul>
      </div>
    </div>
  );
}
