const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  condition: { 
    type: String, 
    enum: ['Sıfır / Etiketli', 'Yeni Gibi', 'Az Kullanılmış', 'Kusurlu'], 
    required: true 
  },
  category: { type: String, required: true },
  brand: { type: String, default: 'Markasız' },
  size: { type: String },
  images: [{ type: String, required: true }],
  status: { type: String, enum: ['Yayında', 'Satıldı', 'Pasif'], default: 'Yayında' },
  isOfferAllowed: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
