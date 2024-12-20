// models/orders.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Students'
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Ready', 'Delivered'],
    default: 'Pending'
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    category: {
      type: String,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  submittedDate: {
    type: Date,
    default: Date.now
  },
  expectedDelivery: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await mongoose.model('Orders').countDocuments();
    this.orderNumber = `ORD${year}${month}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

const Orders = mongoose.models.Orders || mongoose.model('Orders', orderSchema);

export default Orders;