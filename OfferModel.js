const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offeredPrice: { type: Number, required: true },
  counterPrice: { type: Number, default: null },
  status: { 
    type: String, 
    enum: ['Bekliyor', 'Kabul Edildi', 'Reddedildi', 'KarsıTeklif'], 
    default: 'Bekliyor' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);