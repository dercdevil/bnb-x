export const generateTweetText = (walletAddress: string): string => {
  const text = `🚀 ¡Descubre el futuro de la tokenización con @tokenizados! 

💎 Información confiable sobre blockchain y Web3
🔒 100% garantizado y verificado
⚡ Acceso rápido a las últimas novedades

Mi wallet: ${walletAddress}

#Tokenización #Blockchain #Web3 #BNB

https://tokenizados.net/`;

  return encodeURIComponent(text);
};

export const generateTwitterUrl = (text: string): string => {
  // Usar la nueva URL de X para crear posts
  return `https://x.com/intent/post?text=${text}`;
};

export const extractTweetId = (url: string): string | null => {
  // Regex más robusto que maneja diferentes formatos de URL
  const tweetIdRegex =
    /(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/;
  const match = url.match(tweetIdRegex);
  return match ? match[2] : null;
};

export const validateTweetUrl = (url: string): boolean => {
  // Validación más flexible para URLs de Twitter/X
  const tweetUrlRegex =
    /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status(es)?\/\d+(\?.*)?$/;
  return tweetUrlRegex.test(url);
};

export const getTweetEmbedUrl = (tweetId: string): string => {
  // URL para obtener información del tweet sin API
  // Usar x.com para URLs más modernas, pero oEmbed sigue funcionando con twitter.com
  return `https://publish.twitter.com/oembed?url=https://x.com/user/status/${tweetId}`;
};

export const validateTweetContent = async (
  tweetUrl: string,
  walletAddress: string
): Promise<{ isValid: boolean; username?: string; error?: string }> => {
  try {
    // Usar oEmbed directamente con la URL proporcionada (como en tu ejemplo)
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(
      tweetUrl
    )}`;

    const embedRes = await fetch(oembedUrl);

    if (!embedRes.ok) {
      console.warn("oEmbed request failed:", embedRes.status);
      return {
        isValid: false,
        error: `Error al obtener información del tweet (${embedRes.status})`,
      };
    }

    const data = await embedRes.json();

    // Extraer el username del author_url (como en tu ejemplo)
    let username = null;
    if (data.author_url) {
      try {
        username = new URL(data.author_url).pathname.slice(1);
      } catch (e) {
        console.warn("Error extracting username:", e);
      }
    }

    // Verificar que el tweet contenga la wallet address (como en tu ejemplo)
    const tweetHtml = (data.html || "").toLowerCase();
    const walletInTweet = tweetHtml.includes(walletAddress.toLowerCase());

    // Verificar que mencione tokenización
    const mentionsTokenizacion = tweetHtml.includes("tokenización");

    // Verificar que incluya el enlace (puede estar acortado por Twitter)
    const includesLink =
      tweetHtml.includes("tokenizados.net") || tweetHtml.includes("t.co/");

    const isValid = walletInTweet && mentionsTokenizacion && includesLink;

    // Debug para ver qué está fallando
    console.log("=== DEBUG TWEET VALIDATION ===");
    console.log("Tweet HTML:", tweetHtml);
    console.log("Wallet address:", walletAddress.toLowerCase());
    console.log("Wallet in tweet:", walletInTweet);
    console.log("Mentions tokenización:", mentionsTokenizacion);
    console.log("Includes link:", includesLink);
    console.log("Is valid:", isValid);
    console.log("==============================");

    return {
      isValid,
      username: username || undefined,
      error: isValid
        ? undefined
        : `El tweet no cumple todos los requisitos. Wallet: ${walletInTweet}, Tokenización: ${mentionsTokenizacion}, Link: ${includesLink}`,
    };
  } catch (error) {
    console.error("Error validating tweet content:", error);
    return {
      isValid: false,
      error: "Error interno al validar el tweet",
    };
  }
};
