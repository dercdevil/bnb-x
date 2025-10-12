"use client";

import { Twitter, ExternalLink } from "lucide-react";

interface TweetPreviewProps {
  walletAddress: string;
  onGenerateTweet: () => void;
}

export default function TweetPreview({
  walletAddress,
  onGenerateTweet,
}: TweetPreviewProps) {
  const tweetText = `🚀 ¡Descubre el futuro de la tokenización! 

💎 Información confiable sobre blockchain y Web3

Mi wallet: ${walletAddress}

#Tokenización #Blockchain #Web3 #USDT #BSC

https://tokenizados.net/`;

  const handlePublish = () => {
    // Crear URL directa como el ejemplo de Lid
    const encodedText = encodeURIComponent(tweetText);
    const url = `https://x.com/intent/post?text=${encodedText}`;

    // Abrir X en nueva pestaña
    window.open(url, "_blank");

    // Notificar al componente padre
    onGenerateTweet();
  };

  return (
    <div className="bg-green-500/10 backdrop-blur-sm rounded-xl border border-green-400/30 p-6 mb-6">
      <h3 className="font-semibold text-green-300 mb-4 flex items-center gap-2">
        <Twitter className="w-5 h-5" />
        Vista previa del tweet:
      </h3>

      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/10">
        <div className="text-white text-sm whitespace-pre-line font-mono">
          {tweetText}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handlePublish}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg border border-green-400/30 flex items-center justify-center gap-2"
        >
          <Twitter className="w-5 h-5" />
          Publicar en X
          <ExternalLink className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigator.clipboard.writeText(tweetText)}
          className="px-4 py-3 bg-white/10 backdrop-blur-sm text-green-200 rounded-lg border border-green-400/30 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
        >
          📋 Copiar texto
        </button>
      </div>

      <div className="mt-4 text-xs text-green-200">
        💡 <strong>Tip:</strong> Puedes copiar el texto y pegarlo manualmente en
        X si prefieres.
      </div>
    </div>
  );
}
