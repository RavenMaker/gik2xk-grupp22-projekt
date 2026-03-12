const { Product } = require('../models');

const productService = {
  // Hämta alla produkter (för startsidan) [cite: 80, 243]
  async getAllProducts() {
    return await Product.findAll();
  },

  // Hämta en specifik produkt [cite: 81, 246]
  async getProductById(id) {
    return await Product.findByPk(id);
  },

  // Skapa en produkt (för administratör) [cite: 91]
  async createProduct(productData) {
    return await Product.create(productData);
  },

  // Ändra en produkt [cite: 91, 254]
  async updateProduct(id, productData) {
    const product = await Product.findByPk(id);
    if (product) {
      return await product.update(productData);
    }
    return null;
  },

  // Ta bort en produkt [cite: 91, 260]
  async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (product) {
      await product.destroy();
      return true;
    }
    return false;
  }
};

module.exports = productService;