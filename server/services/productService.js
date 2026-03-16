const { Product, Rating, Cart, CartRow } = require('../models');

const productService = {
  // Hjälpmetod för att "städa" produktobjekt (Sida 9) 
  _cleanProduct(product) {
    const plainProduct = product.get({ plain: true });
    const ratings = plainProduct.Ratings || [];
    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    const average = ratings.length > 0 ? total / ratings.length : 0;

    return {
      id: plainProduct.id,
      title: plainProduct.title,
      description: plainProduct.description,
      price: plainProduct.price,
      image_url: plainProduct.image_url,
      averageRating: average.toFixed(1),
      ratings: ratings
    };
  },

  async getAllProducts() {
    const products = await Product.findAll({ include: [Rating] });
    return products.map(p => this._cleanProduct(p));
  },

  async getProductById(id) {
    const product = await Product.findByPk(id, { include: [Rating] });
    if (!product) return null;
    return this._cleanProduct(product);
  },

  async addRating(productId, ratingValue) {
    return await Rating.create({
      product_id: productId,
      rating: ratingValue
    });
  },

  // NY: Logik för att lägga produkt i varukorg (Sida 8) [cite: 216, 219]
  async addProductToCart(userId, productId, amount) {
    // Hitta eller skapa senaste varukorg (Sida 8) [cite: 220, 222]
    const [cart] = await Cart.findOrCreate({
      where: { user_id: userId, payed: false }
    });

    // Spara i kopplingstabell cart_row (Sida 8) [cite: 223]
    const [row, created] = await CartRow.findOrCreate({
      where: { cart_id: cart.id, product_id: productId },
      defaults: { amount: amount }
    });

    if (!created) {
      // Om den redan finns, uppdatera antalet (Sida 8) [cite: 224]
      await row.update({ amount: row.amount + amount });
    }
    return row;
  },

  async createProduct(productData) { return await Product.create(productData); },
  async updateProduct(id, productData) {
    const product = await Product.findByPk(id);
    return product ? await product.update(productData) : null;
  },
  async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (product) { await product.destroy(); return true; }
    return false;
  }
};

module.exports = productService;