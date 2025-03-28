const { getStoreData } = require('../services/shopifyService');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const User = require('../models/user.js');
const Api = require('../models/api.js');

// Validate API Key
exports.validateApiKey = (req, res) => {
  const { apiKey } = req.body;
  console.log('Received API Key:', apiKey); // Debugging log

  getStoreData(apiKey)
    .then((store) => {
      console.log('Store data:', store); // Debugging log
      const userId = req.user.userId;
      console.log('User ID:', userId);

      const newApiEntry = new Api({
        stringField: apiKey,
        user: userId,
      });

      newApiEntry
        .save()
        .then(() => {
          res.status(200).json({
            success: true,
            message: 'API Key validated and user associated successfully!',
            apiKey: apiKey,
          });
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            message: 'Failed to save the API entry',
            error: err.message,
          });
        });
    })
    .catch(() => {
      res.status(401).json({
        success: false,
        message: 'Invalid API Key',
      });
    });
};
exports.getAllKeys = async (req, res) => {
  try {
    // Extract the userId from the authenticated user's request
    const userId = req.user.userId;

    // Query the database to find only the `stringField` of all API keys associated with this user
    const apiKeys = await Api.find({ user: userId }).select('stringField -_id'); // Select `stringField` only, exclude `_id`

    // Check if any API keys were found
    if (!apiKeys || apiKeys.length === 0) {
      return res
        .status(404)
        .json({ message: 'No API keys found for this user.' });
    }

    // Send the API keys as a response
    res.status(200).json({
      success: true,
      data: apiKeys,
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching API keys.',
    });
  }
};

// Sync Products
exports.syncProducts = (req, res) => {
  const store = req.store;
  res.status(200).json({
    success: true,
    data: store.products,
  });
};

// Sync Orders
exports.syncOrders = (req, res) => {
  const store = req.store;
  res.status(200).json({
    success: true,
    data: store.orders,
  });
};

// Sync Inventory
exports.syncInventory = (req, res) => {
  const store = req.store;
  res.status(200).json({
    success: true,
    data: store.inventory,
  });
};

// Create Order
exports.createOrder = (req, res) => {
  const { customer, lineItems } = req.body;
  const store = req.store;

  // Validate and update inventory
  const orderValid = lineItems.every((item) => {
    const product = store.products.find((p) => p.id === item.productId);
    return product && product.inventory_quantity >= item.quantity;
  });

  if (!orderValid) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient inventory',
    });
  }

  // Deduct inventory and create order
  lineItems.forEach((item) => {
    const product = store.products.find((p) => p.id === item.productId);
    product.inventory_quantity -= item.quantity;
  });

  const newOrder = {
    id: (store.orders.length + 101).toString(),
    customer,
    line_items: lineItems,
  };

  store.orders.push(newOrder);

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order: newOrder,
  });
};

// Track Order
exports.trackOrder = (req, res) => {
  const { orderId } = req.params;
  const store = req.store;

  const trackingInfo = store.orderTracking.find((t) => t.orderId === orderId);
  if (!trackingInfo) {
    return res.status(404).json({
      success: false,
      message: 'Tracking info not found',
    });
  }

  res.status(200).json({
    success: true,
    data: trackingInfo,
  });
};

// Generate Invoice
exports.generateInvoice = (req, res) => {
  const { orderId } = req.body;
  const store = req.store;

  const order = store.orders.find((o) => o.id === orderId);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  const doc = new PDFDocument();
  const filePath = `./invoices/invoice-${orderId}.pdf`;

  doc.pipe(fs.createWriteStream(filePath));
  doc.text(`Invoice for Order ${orderId}`);
  doc.text(`Customer: ${order.customer}`);
  order.line_items.forEach((item) => {
    doc.text(`- ${item.name}: Quantity ${item.quantity}`);
  });
  doc.end();

  res.download(filePath, `invoice-${orderId}.pdf`);
};
