# 🚀 Guía de Despliegue - Campaña USDT

## ✅ Cambios Realizados

### 1. **Transferencias USDT (ERC20)**
- ✅ Implementada función `sendUSDT()` en `src/lib/web3.ts`
- ✅ Contrato USDT en BSC: `0x55d398326f99059fF775485246999027B3197955`
- ✅ USDT usa 18 decimales en BSC

### 2. **Colecciones Firebase Separadas**
- ✅ Colección de campaña: `usdt-campaign` (documento: `current`)
- ✅ Colección de usuarios: `usdt-users`
- ✅ No sobrescribe datos de la campaña BNB

### 3. **Textos Actualizados**
- ✅ Todos los textos cambiados de BNB a USDT
- ✅ Recompensa: 1 USDT
- ✅ Límite predeterminado: 20 usuarios

---

## 📋 Pasos para Desplegar en Vercel

### **Opción 1: Nuevo Proyecto en Vercel (Recomendado)**

1. **Push de la rama**
   ```bash
   git push origin usdt-campaign
   ```

2. **Ir a Vercel Dashboard**
   - Accede a: https://vercel.com/dashboard

3. **Crear nuevo proyecto**
   - Click en "Add New" → "Project"
   - Selecciona tu repositorio
   - En "Configure Project":
     - **Branch**: `usdt-campaign`
     - **Root Directory**: `.` (dejar por defecto)
     - **Framework Preset**: Next.js

4. **Configurar Variables de Entorno**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
   PRIVATE_KEY=tu_wallet_private_key
   BSC_RPC_URL=https://bsc-dataseed.binance.org/
   CAMPAIGN_COLLECTION=usdt-campaign
   USERS_COLLECTION=usdt-users
   ```

5. **Deploy**
   - Click en "Deploy"
   - Espera a que termine el build
   - Tu app estará disponible en: `https://tu-proyecto-usdt.vercel.app`

---

### **Opción 2: Mismo Proyecto, Branch Diferente**

1. **Push de la rama**
   ```bash
   git push origin usdt-campaign
   ```

2. **Ir a tu proyecto existente en Vercel**

3. **Settings → Git**
   - Puedes mantener `main` como production branch
   - O cambiar a `usdt-campaign` como production branch

4. **Deployments**
   - Ve a la pestaña "Deployments"
   - Vercel automáticamente detectará el push de la nueva rama
   - O manualmente: Click "Deploy" → Selecciona branch `usdt-campaign`

5. **Configurar Variables de Entorno**
   - Ve a Settings → Environment Variables
   - Agrega las mismas variables del Opción 1
   - **Importante**: Asegúrate de agregar `CAMPAIGN_COLLECTION` y `USERS_COLLECTION`

---

## 🔥 Configurar Firebase (MUY IMPORTANTE)

### **Crear Colección de Campaña USDT**

1. **Ir a Firebase Console**
   - https://console.firebase.google.com/

2. **Firestore Database**
   - Ve a Firestore Database

3. **Crear Nueva Colección**
   - Click en "Start collection"
   - **Collection ID**: `usdt-campaign`
   - Click "Next"

4. **Crear Documento de Campaña**
   - **Document ID**: `current`
   - **Campos**:
     ```
     isActive: true (boolean)
     maxUsers: 20 (number)
     currentUsers: 0 (number)
     rewardAmount: "1" (string)
     createdAt: [Timestamp: ahora]
     ```
   - Click "Save"

5. **La colección de usuarios se creará automáticamente**
   - La primera vez que un usuario participe, se creará `usdt-users`

---

## 💰 Preparar Wallet

### **Requisitos:**
1. **USDT en BSC**: Debes tener suficiente USDT en tu wallet
   - Por ejemplo: Para 20 usuarios × 1 USDT = 20 USDT
   - Agrega un poco más para estar seguro (25 USDT recomendado)

2. **BNB para Gas**: Necesitas BNB para pagar las transacciones
   - Aproximadamente 0.01 BNB por cada transferencia
   - Para 20 usuarios: ~0.2-0.3 BNB recomendado

3. **Verificar Dirección del Contrato USDT**
   - Contrato usado: `0x55d398326f99059fF775485246999027B3197955`
   - Este es USDT en BSC Mainnet
   - Verifica en: https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955

---

## ✨ Resumen de URLs

Después del deploy, tendrás:
- **Campaña BNB** (rama main): `https://tu-proyecto.vercel.app`
- **Campaña USDT** (rama usdt-campaign): `https://tu-proyecto-usdt.vercel.app`

Ambas usando la misma cuenta de Firebase pero con colecciones diferentes:
- BNB: `campaign` / `users`
- USDT: `usdt-campaign` / `usdt-users`

---

## 🔍 Verificar Deployment

1. **Abrir la URL del deployment**
2. **Verificar que muestre**:
   - Título: "Campaña USDT x Tokenizados"
   - Recompensa: "1 USDT"
   - Participantes: "0/20"

3. **Revisar console del navegador** (F12)
   - No debe haber errores de Firebase
   - La campaña debe cargar correctamente

---

## 🛠️ Troubleshooting

### Error: "Missing environment variables"
- Revisa que todas las variables estén en Vercel
- Redeploy después de agregar variables

### Error: "Firebase permission denied"
- Verifica las reglas de Firestore
- Asegúrate que permitan lectura/escritura en las colecciones

### Error: "USDT transfer failed"
- Verifica que tengas USDT suficiente
- Verifica que tengas BNB para gas
- Revisa que la PRIVATE_KEY sea correcta

### Los cambios no se reflejan
- Haz un "Redeploy" en Vercel
- Limpia caché del navegador (Ctrl+Shift+R)

---

## 📝 Comandos Útiles

```bash
# Ver rama actual
git branch

# Cambiar a rama usdt-campaign
git checkout usdt-campaign

# Ver cambios
git status

# Push de cambios
git push origin usdt-campaign

# Volver a rama main
git checkout main
```

---

## ⚠️ IMPORTANTE

1. **NO compartas tu PRIVATE_KEY** nunca
2. **Mantén suficiente USDT y BNB** en la wallet
3. **Las dos campañas son independientes** (BNB y USDT)
4. **Monitorea Firebase** para ver los participantes
5. **Cada deployment de rama es independiente** en Vercel

---

¡Listo! 🎉 Tu campaña USDT está lista para desplegarse.

