const mongoose = require('mongoose');

const pharmacyStockSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    medicine: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    stockQty: {
      type: Number,
      required: true,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
      default: 'Tablets',
    },
    reorderLevel: {
      type: Number,
      required: true,
      default: 15,
    },
    location: {
      type: String,
      required: true,
      default: 'Bay A-1',
    },
    status: {
      type: String,
      enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'],
      default: 'IN_STOCK',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-update status based on quantity and reorder level
pharmacyStockSchema.pre('save', function (next) {
  if (this.stockQty <= 0) {
    this.status = 'OUT_OF_STOCK';
  } else if (this.stockQty <= this.reorderLevel) {
    this.status = 'LOW_STOCK';
  } else {
    this.status = 'IN_STOCK';
  }
  next();
});

module.exports = mongoose.model('PharmacyStock', pharmacyStockSchema);

