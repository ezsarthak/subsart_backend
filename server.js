const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Meal = require('./models/Meal');
const Address = require('./models/Address');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.MONGODB_URI || 3000;

app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.log('MongoDB error:', err.message);
    console.log('\nPlease start MongoDB first:');
  });

app.get('/api/meals', async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/addresses', async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    const ordersMap = {};
    orders.forEach(order => {
      if (!ordersMap[order.dateIndex]) {
        ordersMap[order.dateIndex] = [];
      }
      ordersMap[order.dateIndex].push({
        orderNumber: order.orderNumber,
        status: order.status,
        addressId: order.addressId,
        timeSlot: order.timeSlot,
        deliverySlotEnabled: order.deliverySlotEnabled,
        editDeadline: order.editDeadline,
        meals: order.meals
      });
    });
    res.json(ordersMap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:dateIndex/:orderIndex', async (req, res) => {
  try {
    const { dateIndex, orderIndex } = req.params;
    const updatedOrder = req.body;

    const orders = await Order.find({ dateIndex: parseInt(dateIndex) });
    if (orders[orderIndex]) {
      await Order.findByIdAndUpdate(orders[orderIndex]._id, {
        ...updatedOrder,
        dateIndex: parseInt(dateIndex)
      });
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders/reschedule', async (req, res) => {
  try {
    const { fromDateIndex, toDateIndex, orderIndex, order } = req.body;

    const orders = await Order.find({ dateIndex: fromDateIndex });
    if (orders[orderIndex]) {
      await Order.findByIdAndDelete(orders[orderIndex]._id);
      await Order.create({
        dateIndex: toDateIndex,
        ...order
      });
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/orders/:dateIndex', async (req, res) => {
  try {
    const { dateIndex } = req.params;
    await Order.deleteMany({ dateIndex: parseInt(dateIndex) });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
