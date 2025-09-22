# Campaña BNB x Tokenizados

Una aplicación web que permite a los usuarios publicar en X (Twitter) sobre [Tokenizados.net](https://tokenizados.net) y recibir 0.005 BNB como recompensa. Solo para los primeros 5 usuarios.

## Características

- ✅ Formulario para ingresar wallet BNB
- ✅ Generación automática de tweets promocionales
- ✅ Verificación de URLs de tweets
- ✅ Transferencia automática de 0.005 BNB
- ✅ Límite de 5 usuarios con bloqueo automático
- ✅ Dashboard de administración
- ✅ Historial completo en Firebase
- ✅ Interfaz moderna y responsive

## Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: Firebase Firestore
- **Blockchain**: Ethers.js para transferencias BNB
- **UI**: Lucide React Icons, React Hot Toast

## Configuración

### 1. Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 2. Configurar Variables de Entorno

Crea un archivo \`.env.local\` en la raíz del proyecto con las siguientes variables:

\`\`\`env

# Firebase Configuration

NEXT_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# BNB Transfer Configuration

PRIVATE_KEY=tu_wallet_private_key
BSC_RPC_URL=https://bsc-dataseed.binance.org/

# No se necesita Twitter API - usamos URLs públicas y oEmbed

\`\`\`

### 3. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Firestore Database
3. Configura las reglas de seguridad de Firestore:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
match /{document=\*\*} {
allow read, write: if true; // Para desarrollo - ajustar en producción
}
}
}
\`\`\`

### 4. Configurar Wallet para Transferencias

1. Crea una wallet BNB con fondos suficientes
2. Exporta la clave privada (¡MANTÉN SEGURA!)
3. Agrega la clave privada a las variables de entorno

### 5. Ejecutar la Aplicación

\`\`\`bash

# Desarrollo

npm run dev

# Producción

npm run build
npm start
\`\`\`

## Estructura del Proyecto

\`\`\`
src/
├── app/
│ ├── api/
│ │ ├── campaign/route.ts # API para información de campaña
│ │ ├── verify-tweet/route.ts # API para verificar tweets
│ │ └── users/route.ts # API para obtener usuarios
│ ├── admin/page.tsx # Dashboard de administración
│ ├── layout.tsx # Layout principal
│ └── page.tsx # Página principal
├── components/
│ ├── WalletForm.tsx # Formulario de wallet
│ ├── TweetVerification.tsx # Verificación de tweets
│ └── CampaignStatus.tsx # Estado de la campaña
├── lib/
│ ├── firebase.ts # Configuración de Firebase
│ ├── web3.ts # Utilidades Web3
│ └── twitter.ts # Utilidades de Twitter
├── services/
│ └── firebaseService.ts # Servicio de Firebase
└── types/
└── index.ts # Tipos TypeScript
\`\`\`

## Funcionalidades

### Para Usuarios

1. **Ingresar Wallet**: Los usuarios ingresan su dirección de wallet BNB
2. **Vista Previa**: Ven exactamente qué texto se va a publicar
3. **Generar Tweet**: Se abre X con el tweet pre-rellenado usando `x.com/intent/post`
4. **Publicar en X**: El usuario publica el tweet en su cuenta
5. **Verificar Tweet**: El usuario pega la URL del tweet publicado
6. **Validación Automática**: El sistema verifica el contenido usando oEmbed
7. **Recibir BNB**: Si es válido y quedan lugares, recibe 0.005 BNB automáticamente

### Para Administradores

- Dashboard completo en `/admin`
- Visualización de todos los usuarios participantes
- Estado de la campaña en tiempo real
- Historial de transacciones
- Información detallada de cada participante

## Seguridad

- ✅ Validación de direcciones de wallet
- ✅ Verificación de URLs de tweets
- ✅ Prevención de participación múltiple por wallet
- ✅ Prevención de reutilización de tweets
- ✅ Límite automático de participantes
- ✅ Manejo seguro de claves privadas

## Personalización

### Modificar el Texto del Tweet

Edita la función \`generateTweetText\` en \`src/lib/twitter.ts\`:

\`\`\`typescript
export const generateTweetText = (walletAddress: string): string => {
const text = \`Tu mensaje personalizado aquí
Mi wallet: \${walletAddress}
#Hashtags #Personalizados
https://tokenizados.net/\`;

return encodeURIComponent(text);
};
\`\`\`

### Cambiar la Cantidad de BNB

Modifica la configuración de la campaña en Firebase o en \`src/services/firebaseService.ts\`.

### Ajustar el Límite de Usuarios

Cambia \`maxUsers\` en la configuración de la campaña.

## Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente

### Otros Proveedores

La aplicación es compatible con cualquier proveedor que soporte Next.js:

- Netlify
- Railway
- Heroku
- AWS Amplify

## Soporte

Para soporte técnico o preguntas sobre la implementación, contacta al equipo de desarrollo.

## Licencia

Este proyecto fue desarrollado específicamente para la campaña promocional de [Tokenizados.net](https://tokenizados.net).

---

**⚠️ Importante**: Asegúrate de mantener seguras las claves privadas y configurar adecuadamente las reglas de seguridad de Firebase antes del despliegue en producción.
