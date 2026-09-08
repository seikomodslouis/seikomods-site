// Catalogue de prix côté serveur — source de vérité unique pour les paiements.
// Ne jamais faire confiance à un prix envoyé par le client : toujours recalculer ici.

// ---- Modèles de la collection (prix fixe par nom de produit) ----
const COLLECTION_CATALOG = {
  'SeikoJust Acier Jubilee': 169,
  'SeikoJust Acier Jubilee Violet': 169,
  'SeikoJust Acier Jubilee Vert': 169,
  'SeikoJust Acier Jubilee Bleu': 169,
  'SeikoJust Acier Jubilee Argent': 169,
  'SeikoJust Acier Jubilee Ice Blue': 169,
  'SeikoJust Acier Jubilee Olive': 169,
  'SeikoJust Acier Jubilee Rose': 169,
  'SeikoJust Acier Jubilee Arabic Rose': 169,
  'SeikoJust Acier Jubilee Arabic Ice Blue': 169,
  'SeikoJust Acier Jubilee Arabic Olive': 169,
  'SeikoJust Acier Jubilee Arabic Noir': 169,
  'SeikoJust Acier Jubilee Arabic Argent': 169,
  'SeikoJust Acier Président Arabic Argent': 169,
  'SeikoJust Or Jubilee Noir': 169,
  'SeikoJust Or Jubilee Champagne': 169,
  'SeikoJust Or Jubilee Or': 169,
  'SeikoJust Or Jubilee Arabic Argent': 169,
  'SeikoJust Acier Or Jubilee Argent': 169,
  'SeikoJust Acier Or Jubilee Champagne': 169,
  'SeikoJust Acier Or Jubilee Or': 169,
  'SeikoJust Acier Or Jubilee Bleu': 169,
  'SeikoJust Acier Or Jubilee Arabic Argent': 169,
  'SeikoJust Acier Or Rose Jubilee Brun': 169,
  'SeikoJust Acier Or Rose Jubilee Roman Brun': 169,
  'SeikoJust Acier Or Rose Jubilee Arabic Brun': 169,
  'SeikoJust Or Rose Jubilee Brun': 169,
  'SeikoJust Or Rose Jubilee Arabic Rouge': 169,
  'SeikoJust Or Rose President Brun': 169,
  'SeikoJust Or Rose President Arabic Brun': 169,
  'SeikoJust Acier Jubilee Wimbledon Gris': 169,
  'SeikoJust Acier Or President Wimbledon Gris': 169,
  'SeikoJust Acier Jubilee Wimbledon Blanc': 169,
  'SeikoJust Acier Jubilee Wimbledon Bleu Glacier': 169,
  'SeikoJust Acier Jubilee Wimbledon Noir': 169,
  'SeikoJust Or Jubilee Wimbledon Gris': 169,
  'SeikoJust Acier Or Oyster Wimbledon Gris': 169,
  'SeikoJust Acier Or Rose Jubilee Wimbledon Gris': 169,
  'SeikoJust Or President Wimbledon Gris': 169,
  'SeikoJust Acier Or Jubilee Wimbledon Gris': 169,
  'Seiko Oak Acier Noir': 169,
  'Seiko Oak Acier Ice Blue': 169,
  'Seiko Oak Acier Squelette Noir': 189,
  'Seiko Oak Acier Teal': 169,
  'Seiko Oak Acier Bleu': 169,
  'Seiko Oak Or Rose Noir': 169,
  'Seiko Oak Acier Vert': 169,
  'Seiko Oak Or Gris': 169,
  'Seiko Oak Acier Olive': 169,
  'Seiko Oak Or Blanc': 169,
  'Seiko Oak Acier Blanc': 169,
  'Seiko Oak Chrono · Acier Noir': 159,
  'Seiko Oak Chrono · Acier Bleu Nuit': 159,
  'Seiko Oak Chrono · Acier Vert': 159,
  'Seiko Oak Chrono · Blanc Panda': 159,
  'Seiko Oak Chrono · Or Rose Bleu': 165,
  'Seiko Oak Chrono · Or Rose Noir': 165,
  'Seiko Oak Chrono · Acier Blanc': 159,
  'Seiko Oak Chrono · Or Rose Vert': 165,
  'gmtS Jubilee Acier Or Vert': 219,
  'gmtS Oyster Acier Or Noir': 219,
  'gmtS Jubilee Acier Or Noir': 219,
  'gmtS Oyster Acier Or Gris': 219,
  'gmtS Jubilee Acier Or Rose': 219,
  'gmtS Oyster Acier Or Rose': 219,
  'gmtS Oyster Noir': 219,
  'gmtS Jubilee Or Rose': 219,
  'gmtS Oyster Or Rose': 219,
  'SeikoSub Or Noir': 189,
  'SeikoSub Or Bleu': 189,
  'SeikoSub Acier Or Noir': 189,
  'SeikoSub Acier Or Bleu': 189,
  'SeikoSub Bicolore': 189,
  'SeikoSub Jubilee Sprite': 189,
  'SeikoSub Oyster Batman': 189,
  'SeikoSub Oyster Noir': 189,
  'SeikoSub Oyster Bleu': 189,
  'SeikoSub Oyster Vert': 189,
  'SeikoSub Or Rose Bleu': 189,
  'SeikoSub Or Rose Noir': 189,
  'SeikoSub Acier Or Rose Bleu': 189,
  'SeikoSub Acier Or Rose Noir': 189,
  'Seikona Acier Noir Arabic': 159,
  'Seikona Acier Blanc Arabic': 159,
  'Seikona Acier Noir Or Rose': 159,
  'Seikona Acier Bleu Glacier Brun Arabic': 159,
  'Seikona Acier Argent Panda': 159,
  'Seikona Acier Bleu Glacier': 159,
  'Seikona Acier Noir Bleu Glacier': 159,
  'Seikona Acier Bleu': 159,
  'Seikona Acier Noir Carbon': 159,
  'Seikona Acier Vert': 159,
  'Seikona Acier Noir': 159,
  'Seikona Acier Blanc': 159,
  'Seikona Acier Noir Rainbow': 159,
  'Seikona Or Noir': 159,
  'Seikona Or Champagne': 159,
  'Seikona Or Champagne Lunette Noire': 159,
  'Seikona Or Vert': 159,
  'Seikona Or Vert Émeraude': 159,
  'Seikona Or Blanc Arabic': 159,
  'Seikona Or Rose Noir': 159,
  'Seikona Or Rose Noir Rainbow': 159,
  'Seikona Acier Or Blanc': 159,
  'Sautilus Acier': 169,
  'Sautilus Acier Tiffany': 169,
  'Sautilus Acier Blanc': 169,
  'Sautilus Acier Bleu': 169,
  'Sautilus Or Rose Brun': 169,
  'Sautilus Acier Vert': 169,
  'Sautilus Chronograph Acier Noir': 159,
  'Sautilus Chronograph Acier Tiffany': 159,
  'Sautilus Chronograph Acier Blanc': 159,
  'Sautilus Chronograph Acier Vert': 159,
  'Sautilus Chronograph Acier Bleu': 159,
  'Sautilus Chronograph Acier Gris': 159,
  'SeikoSantos · Fuck 9-5': 179,
  'SeikoSantos 33mm · Noir': 169,
  'SeikoSantos 33mm · Noir Date': 169,
  'SeikoSantos 33mm · Blanc': 169,
  'SeikoSantos 33mm · Blanc Date': 169,
  'SeikoSantos 33mm · Bleu': 169,
  'SeikoSantos 33mm · Bleu Date': 169,
  'SeikoSantos 33mm · Vert': 169,
  'SeikoSantos 33mm · Vert Date': 169,
  'SeikoSantos 33mm · Gris': 169,
  'SeikoSantos 33mm · Gris Date': 169,
  'SeikoSantos 33mm · Tiffany': 169,
  'SeikoSantos 33mm · Tiffany Date': 169,
  'SeikoSantos 33mm · Bleu Nuit': 169,
  'SeikoSantos 33mm · Bleu Nuit Date': 169,
};

// Les montres "SeikoJust" de la collection ont un nom suffixé par la taille
// (ex: "SeikoJust Acier Jubilee 36mm") mais la taille n'affecte pas le prix.
function lookupCollectionPrice(name) {
  if (COLLECTION_CATALOG[name] !== undefined) return COLLECTION_CATALOG[name];
  const stripped = name.replace(/\s+(36mm|39mm)$/, '');
  if (COLLECTION_CATALOG[stripped] !== undefined) return COLLECTION_CATALOG[stripped];
  return null;
}

// ---- Configurateur : prix fixe par modèle, indépendant de la finition ----
function getConfiguratorPrice(modelLabel, finishLabel) {
  switch (modelLabel) {
    case 'SeikoJust':
      return 169;
    case 'Seiko Oak':
      return 169;
    case 'Sautilus':
      return 169;
    case 'Seikona':
      return 159;
    case 'gmtS':
      return 219;
    case 'SeikoSub':
      return 189;
    default:
      return null; // modèle inconnu → rejeté par l'appelant
  }
}

module.exports = { COLLECTION_CATALOG, lookupCollectionPrice, getConfiguratorPrice };
