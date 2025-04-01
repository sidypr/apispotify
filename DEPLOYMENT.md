# Guide de déploiement pour API Spotify App

Ce guide vous aidera à préparer et déployer votre application React utilisant l'API Spotify.

## Préparation avant déploiement

### 1. Vérification technique

- [x] Tester la connexion avec Spotify OAuth
- [x] Vérifier la récupération des données des artistes et morceaux
- [x] Tester les filtres temporels
- [x] Vérifier l'affichage des diagrammes
- [ ] S'assurer que les messages d'erreur sont clairs et utiles

### 2. Configuration pour la production

#### Mise à jour de l'URL de redirection

Pour que votre application fonctionne en production, vous devez mettre à jour l'URL de redirection dans le Dashboard Spotify Developer :

1. Connectez-vous au [Dashboard Spotify Developer](https://developer.spotify.com/dashboard/)
2. Sélectionnez votre application
3. Cliquez sur "Edit Settings"
4. Ajoutez votre URL de production dans "Redirect URIs" (ex: `https://votre-domaine.com/callback`)
5. Sauvegardez les modifications

#### Variables d'environnement

Créez un fichier `.env` pour votre environnement de production :

```
REACT_APP_CLIENT_ID=votre_client_id
REACT_APP_REDIRECT_URI=https://votre-domaine.com/callback
```

Assurez-vous que ce fichier est inclus dans `.gitignore`.

### 3. Optimisation pour la production

Exécutez la commande suivante pour créer une version optimisée pour la production :

```bash
npm run build
```

Cela créera un dossier `build` avec votre application optimisée.

## Options de déploiement

### Option 1: Déploiement sur Vercel

1. Installez Vercel CLI :
   ```bash
   npm install -g vercel
   ```

2. Connectez-vous à Vercel :
   ```bash
   vercel login
   ```

3. Déployez votre application :
   ```bash
   vercel
   ```

4. Pour déployer en production :
   ```bash
   vercel --prod
   ```

### Option 2: Déploiement sur Netlify

1. Installez Netlify CLI :
   ```bash
   npm install -g netlify-cli
   ```

2. Connectez-vous à Netlify :
   ```bash
   netlify login
   ```

3. Initialisez votre site :
   ```bash
   netlify init
   ```

4. Déployez votre application :
   ```bash
   netlify deploy
   ```

5. Pour déployer en production :
   ```bash
   netlify deploy --prod
   ```

### Option 3: Déploiement sur GitHub Pages

1. Installez gh-pages :
   ```bash
   npm install --save-dev gh-pages
   ```

2. Ajoutez ces lignes à votre `package.json` :
   ```json
   {
     "homepage": "https://sidypr.github.io/apispotify",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. Déployez votre application :
   ```bash
   npm run deploy
   ```

## Vérifications après déploiement

- [ ] Tester la connexion avec Spotify sur le site déployé
- [ ] Vérifier que toutes les fonctionnalités marchent correctement
- [ ] Tester sur différents navigateurs (Chrome, Firefox, Safari)
- [ ] Tester sur mobile et desktop
- [ ] Vérifier les temps de chargement

## Résolution des problèmes courants

### Problème de CORS

Si vous rencontrez des problèmes de CORS, assurez-vous que votre domaine est autorisé dans le Dashboard Spotify Developer.

### Problème de redirection

Si la redirection après authentification ne fonctionne pas, vérifiez que l'URL de redirection dans votre code correspond exactement à celle configurée dans le Dashboard Spotify Developer.

### Problème d'affichage des diagrammes

Si les diagrammes ne s'affichent pas correctement, vérifiez que vous avez bien importé toutes les dépendances nécessaires pour Chart.js. 