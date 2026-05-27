# Guide de déploiement SeikoMods — 0€ pour toujours

---

## Étape 1 — Mettre le site en ligne avec Vercel (5 min)

Vercel est 100% gratuit à vie pour les sites statiques. Aucune carte bancaire requise.

**Option A — Sans GitHub (le plus simple) :**

1. Va sur **vercel.com** et clique "Sign Up" → crée un compte avec ton email
2. Une fois connecté, clique sur **"Add New… → Project"**
3. En bas de page, clique **"Or deploy from CLI"** — non, en fait cherche **"Import Git Repository"** puis descends pour trouver **"Deploy without Git"** ou va directement sur **vercel.com/new**
4. Clique sur **"Continue with GitHub"** ou utilise l'option drag & drop

> **La méthode la plus simple avec Vercel :**
> 1. Installe Vercel CLI : ouvre le Terminal et tape `npm install -g vercel`
> 2. Va dans ton dossier seikomods dans le Terminal : `cd ~/Documents/Claude/Projects/seikomods`
> 3. Tape : `vercel`
> 4. Suis les instructions (email, nom du projet, etc.)
> 5. Ton site est en ligne en 30 secondes sur `seikomods.vercel.app`

**Option B — Via l'interface web Vercel (sans Terminal) :**

1. Va sur **vercel.com** → crée un compte gratuit
2. Clique **"Add New Project"**
3. Sélectionne **"Import Third-Party Git Repository"** ou utilise GitHub :
   - Crée un compte gratuit sur **github.com**
   - Crée un nouveau dépôt public nommé `seikomods`
   - Upload tous tes fichiers du dossier seikomods
   - Dans Vercel, connecte ton compte GitHub et importe ce dépôt
4. Vercel détecte automatiquement que c'est un site statique → clique **Deploy**
5. Ton site est en ligne sur `seikomods.vercel.app`

**Pour changer l'URL gratuite :**
- Dans Vercel → ton projet → Settings → Domains
- Tu peux choisir `seikomods.vercel.app` ou un sous-domaine personnalisé gratuit

---

## Étape 2 — Configurer ton numéro WhatsApp (2 min)

Dans les fichiers suivants, remplace `TON_NUMERO` par ton numéro au format international **sans le +** :

Exemple pour le 06 12 34 56 78 français → `33612345678`

**Fichiers à modifier :**
- `configurateur.html` → ligne avec `wa.me/TON_NUMERO`
- `contact.html` → ligne avec `wa.me/TON_NUMERO`

---

## Étape 3 — Configurer le formulaire email avec Formspree (3 min)

Formspree permet de recevoir les messages du formulaire par email — gratuit jusqu'à 50 messages/mois.

1. Va sur **formspree.io** → crée un compte gratuit
2. Clique **"+ New Form"** → donne-lui le nom "SeikoMods"
3. Copie l'ID du formulaire (exemple : `xdoqrgbw`)
4. Dans `configurateur.html` ET `contact.html`, remplace `YOUR_FORM_ID` par ton vrai ID :
   ```
   action="https://formspree.io/f/xdoqrgbw"
   ```
5. Les commandes et messages arrivent directement dans ta boîte email

> Si tu ne configures pas Formspree, le bouton WhatsApp prend automatiquement le relais — les commandes arrivent quand même.

---

## Étape 4 — Ajouter tes vraies photos de montres

Quand tu auras tes propres photos :

1. Place tes images dans le dossier `images/` (format JPG ou PNG, idéalement carré 800x800px)
2. Dans `collection.html` et `index.html`, remplace les noms de fichiers existants par les tiens :
   ```html
   <img src="images/ma-photo.jpg" alt="Nom de la montre">
   ```

---

## Étape 5 — Nom de domaine personnalisé (optionnel, ~10€/an)

Si tu veux `www.seikomods.fr` au lieu de `seikomods.vercel.app` :
- Achète le domaine sur **OVH.com** (~10€/an) ou **Namecheap.com**
- Dans Vercel → Settings → Domains → Add Domain
- Suis les instructions pour pointer le DNS vers Vercel (10 min)

---

## Fichiers du site

```
seikomods/
├── index.html           ← Page d'accueil
├── collection.html      ← Catalogue (17 modèles, filtres par collection)
├── configurateur.html   ← Outil de personnalisation + commande WhatsApp
├── contact.html         ← Contact + FAQ + formulaire
├── style.css            ← Tout le design (un seul fichier)
└── images/              ← Tes photos de montres
```

---

## Checklist avant lancement

- [ ] Numéro WhatsApp renseigné dans `configurateur.html` et `contact.html`
- [ ] ID Formspree renseigné dans `configurateur.html` et `contact.html` (optionnel)
- [ ] Liens Instagram/TikTok ajoutés dans le footer de chaque page
- [ ] Site déployé sur Vercel
- [ ] Test : cliquer sur le bouton WhatsApp → message pré-rempli s'ouvre
- [ ] Test : parcourir le configurateur de A à Z

---

## Coût total : 0 €/mois

| Service          | Coût                         |
|------------------|------------------------------|
| Vercel hosting   | Gratuit pour toujours        |
| Formspree forms  | Gratuit (50 msg/mois)        |
| WhatsApp         | Gratuit                      |
| URL .vercel.app  | Gratuite pour toujours       |
| Domaine .fr/.com | Optionnel (~10€/an seulement)|
| **Total mensuel**| **0 €**                      |
