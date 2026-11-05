const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { lookupCollectionPrice, getConfiguratorPrice } = require('./_catalog');

module.exports = async (req, res) => {
  // CORS
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://seikomods-louis.fr',
    'http://seikomods-louis.fr',
    'https://www.seikomods-louis.fr',
    'http://www.seikomods-louis.fr',
    'https://seikomods-site.vercel.app',
  ];
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, shippingMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Panier vide' });
    }

    // ── Prix : jamais celui envoyé par le client, toujours recalculé côté serveur ──
    // (le client pourrait envoyer un prix falsifié via les outils de dev du navigateur)
    let line_items;
    try {
      line_items = items.map(item => {
        const isConfigurator = item.opts && Object.prototype.hasOwnProperty.call(item.opts, 'finition');

        const authoritativePrice = isConfigurator
          ? getConfiguratorPrice(item.name, item.opts.finition, item.opts.bracelet)
          : lookupCollectionPrice(item.name);

        if (authoritativePrice === null || authoritativePrice === undefined) {
          const err = new Error(`Produit non reconnu : "${item.name}"`);
          err.statusCode = 400;
          throw err;
        }

        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.name,
              description: [
                item.opts?.finition  ? `Finition: ${item.opts.finition}`   : '',
                item.opts?.bracelet  ? `Bracelet: ${item.opts.bracelet}`   : '',
                item.opts?.cadran    ? `Cadran: ${item.opts.cadran}`       : '',
                item.opts?.aiguilles ? `Aiguilles: ${item.opts.aiguilles}` : '',
              ].filter(Boolean).join(' · ') || undefined,
            },
            unit_amount: Math.round(authoritativePrice * 100), // centimes
          },
          quantity: 1,
        };
      });
    } catch (validationErr) {
      if (validationErr.statusCode === 400) {
        console.warn('Rejected checkout — unrecognized product:', validationErr.message);
        return res.status(400).json({ error: 'Un article du panier n\'a pas pu être vérifié. Merci de reconfigurer votre montre et réessayer.' });
      }
      throw validationErr;
    }

    // Frais de livraison fixes : 4,99 €
    line_items.push({
      price_data: {
        currency: 'eur',
        product_data: { name: 'Livraison (15 à 25 jours)' },
        unit_amount: 499, // 4,99€
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.origin || 'https://seikomods-louis.fr'}/merci.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://seikomods-louis.fr'}/panier.html`,
      allow_promotion_codes: true,
      locale: 'fr',
      shipping_address_collection: {
        allowed_countries: ['FR'],
      },
      phone_number_collection: { enabled: true },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
};
