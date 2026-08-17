const Offer = require('./OfferModel');
const Product = require('./ProductModel');

exports.createOffer = async (req, res) => {
  try {
    const { productId, offeredPrice } = req.body;
    const product = await Product.findById(productId);

    if (!product || product.status !== 'Yayında') {
      return res.status(400).json({ message: 'Ürün teklife uygun değil.' });
    }

    const offer = new Offer({
      product: productId,
      buyer: req.user.id,
      seller: product.seller,
      offeredPrice
    });

    await offer.save();
    res.status(201).json({ success: true, message: 'Teklif satıcıya iletildi.', offer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.respondWithCounterOffer = async (req, res) => {
  try {
    const { offerId, counterPrice } = req.body;
    
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ message: 'Teklif bulunamadı.' });

    offer.counterPrice = counterPrice;
    offer.status = 'KarsıTeklif';
    await offer.save();

    res.status(200).json({ success: true, message: 'Karşı teklif alıcıya gönderildi.', offer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};