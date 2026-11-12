// Catalogue de prix côté serveur — source de vérité unique pour les paiements.
// Ne jamais faire confiance à un prix envoyé par le client : toujours recalculer ici.

// ---- Modèles de la collection (prix fixe par nom de produit) ----
const COLLECTION_CATALOG = {
  'SeikoJust Acier Jubilee': 189,
  'SeikoJust Acier Jubilee Violet': 189,
  'SeikoJust Acier Jubilee Vert': 189,
  'SeikoJust Acier Jubilee Bleu': 189,
  'SeikoJust Acier Jubilee Argent': 189,
  'SeikoJust Acier Jubilee Ice Blue': 189,
  'SeikoJust Acier Jubilee Olive': 189,
  'SeikoJust Acier Jubilee Rose': 189,
  'SeikoJust Acier Jubilee Arabic Rose': 189,
  'SeikoJust Acier Jubilee Arabic Ice Blue': 189,
  'SeikoJust Acier Jubilee Arabic Olive': 189,
  'SeikoJust Acier Jubilee Arabic Noir': 189,
  'SeikoJust Acier Jubilee Arabic Argent': 189,
  'SeikoJust Acier Président Arabic Argent': 189,
  'SeikoJust Or Jubilee Noir': 189,
  'SeikoJust Or Jubilee Champagne': 189,
  'SeikoJust Or Jubilee Or': 189,
  'SeikoJust Or Jubilee Arabic Argent': 189,
  'SeikoJust Acier Or Jubilee Argent': 189,
  'SeikoJust Acier Or Jubilee Champagne': 189,
  'SeikoJust Acier Or Jubilee Or': 189,
  'SeikoJust Acier Or Jubilee Bleu': 189,
  'SeikoJust Acier Or Jubilee Arabic Argent': 189,
  'SeikoJust Acier Or Rose Jubilee Brun': 189,
  'SeikoJust Acier Or Rose Jubilee Roman Brun': 189,
  'SeikoJust Acier Or Rose Jubilee Arabic Brun': 189,
  'SeikoJust Or Rose Jubilee Brun': 189,
  'SeikoJust Or Rose Jubilee Arabic Rouge': 189,
  'SeikoJust Or Rose President Brun': 189,
  'SeikoJust Or Rose President Arabic Brun': 189,
  'SeikoJust Acier Jubilee Wimbledon Gris': 189,
  'SeikoJust Acier Or President Wimbledon Gris': 189,
  'SeikoJust Acier Jubilee Wimbledon Blanc': 189,
  'SeikoJust Acier Jubilee Wimbledon Bleu Glacier': 189,
  'SeikoJust Acier Jubilee Wimbledon Noir': 189,
  'SeikoJust Or Jubilee Wimbledon Gris': 189,
  'SeikoJust Acier Or Oyster Wimbledon Gris': 189,
  'SeikoJust Acier Or Rose Jubilee Wimbledon Gris': 189,
  'SeikoJust Or President Wimbledon Gris': 189,
  'SeikoJust Acier Or Jubilee Wimbledon Gris': 189,
  'Seiko Oak Acier Noir': 189,
  'Seiko Oak Acier Ice Blue': 189,
  'Seiko Oak Acier Squelette Noir': 189,
  'Seiko Oak Acier Teal': 189,
  'Seiko Oak Acier Bleu': 189,
  'Seiko Oak Or Rose Noir': 189,
  'Seiko Oak Acier Vert': 189,
  'Seiko Oak Or Gris': 189,
  'Seiko Oak Acier Olive': 189,
  'Seiko Oak Or Blanc': 189,
  'Seiko Oak Acier Blanc': 189,
  'Seiko Oak Chrono · Acier Noir': 169,
  'Seiko Oak Chrono · Acier Bleu Nuit': 169,
  'Seiko Oak Chrono · Acier Vert': 169,
  'Seiko Oak Chrono · Blanc Panda': 169,
  'Seiko Oak Chrono · Or Rose Bleu': 169,
  'Seiko Oak Chrono · Or Rose Noir': 169,
  'Seiko Oak Chrono · Acier Blanc': 169,
  'Seiko Oak Chrono · Or Rose Vert': 169,
  'gmtS Jubilee Acier Or Vert': 300,
  'gmtS Oyster Acier Or Noir': 300,
  'gmtS Jubilee Acier Or Noir': 300,
  'gmtS Oyster Acier Or Gris': 300,
  'gmtS Jubilee Acier Or Rose': 300,
  'gmtS Oyster Acier Or Rose': 300,
  'gmtS Oyster Noir': 300,
  'gmtS Jubilee Or Rose': 300,
  'gmtS Oyster Or Rose': 300,
  'SeikoSub Or Noir': 199,
  'SeikoSub Or Bleu': 199,
  'SeikoSub Acier Or Noir': 199,
  'SeikoSub Acier Or Bleu': 199,
  'SeikoSub Bicolore': 199,
  'SeikoSub Jubilee Sprite': 199,
  'SeikoSub Oyster Batman': 199,
  'SeikoSub Oyster Noir': 199,
  'SeikoSub Oyster Bleu': 199,
  'SeikoSub Oyster Vert': 199,
  'SeikoSub Or Rose Bleu': 199,
  'SeikoSub Or Rose Noir': 199,
  'SeikoSub Acier Or Rose Bleu': 199,
  'SeikoSub Acier Or Rose Noir': 199,
  'Seikona Acier Noir Arabic': 169,
  'Seikona Acier Blanc Arabic': 169,
  'Seikona Acier Noir Or Rose': 169,
  'Seikona Acier Bleu Glacier Brun Arabic': 169,
  'Seikona Acier Argent Panda': 169,
  'Seikona Acier Bleu Glacier': 169,
  'Seikona Acier Noir Bleu Glacier': 169,
  'Seikona Acier Bleu': 169,
  'Seikona Acier Noir Carbon': 169,
  'Seikona Acier Vert': 169,
  'Seikona Acier Noir': 169,
  'Seikona Acier Blanc': 169,
  'Seikona Acier Noir Rainbow': 169,
  'Seikona Or Noir': 169,
  'Seikona Or Champagne': 169,
  'Seikona Or Champagne Lunette Noire': 169,
  'Seikona Or Vert': 169,
  'Seikona Or Vert Émeraude': 169,
  'Seikona Or Blanc Arabic': 169,
  'Seikona Or Rose Noir': 169,
  'Seikona Or Rose Noir Rainbow': 169,
  'Seikona Acier Or Blanc': 169,
  'Sautilus Acier': 189,
  'Sautilus Acier Tiffany': 189,
  'Sautilus Acier Blanc': 189,
  'Sautilus Acier Bleu': 189,
  'Sautilus Or Rose Brun': 189,
  'Sautilus Acier Vert': 189,
  'Sautilus Chronograph Acier Noir': 169,
  'Sautilus Chronograph Acier Tiffany': 169,
  'Sautilus Chronograph Acier Blanc': 169,
  'Sautilus Chronograph Acier Vert': 169,
  'Sautilus Chronograph Acier Bleu': 169,
  'Sautilus Chronograph Acier Gris': 169,
  'SeikoSantos · Fuck 9-5': 179,
  'SeikoSantos 33mm · Noir': 179,
  'SeikoSantos 33mm · Noir Date': 179,
  'SeikoSantos 33mm · Blanc': 179,
  'SeikoSantos 33mm · Blanc Date': 179,
  'SeikoSantos 33mm · Bleu': 179,
  'SeikoSantos 33mm · Bleu Date': 179,
  'SeikoSantos 33mm · Vert': 179,
  'SeikoSantos 33mm · Vert Date': 179,
  'SeikoSantos 33mm · Gris': 179,
  'SeikoSantos 33mm · Gris Date': 179,
  'SeikoSantos 33mm · Tiffany': 179,
  'SeikoSantos 33mm · Tiffany Date': 179,
  'SeikoSantos 33mm · Bleu Nuit': 179,
  'SeikoSantos 33mm · Bleu Nuit Date': 179,
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
// (Seiko Oak Chronograph = bracelet « Chronograph » dans le configurateur)
function getConfiguratorPrice(modelLabel, finishLabel, braceletLabel) {
  switch (modelLabel) {
    case 'SeikoJust':
      return 189;
    case 'Seiko Oak':
      return braceletLabel === 'Chronograph' ? 169 : 189;
    case 'Sautilus':
      return 189;
    case 'Seikona':
      return 169;
    case 'gmtS':
      return 300;
    case 'SeikoSub':
      return 199;
    default:
      return null; // modèle inconnu → rejeté par l'appelant
  }
}

module.exports = { COLLECTION_CATALOG, lookupCollectionPrice, getConfiguratorPrice };
