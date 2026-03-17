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
      category: plainProduct.category,
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

  // By request: return menu shaped like the client's `fallbackData` structure
  async getMenu() {
    const products = await Product.findAll();
    const plain = products.map(p => (p.get ? p.get({ plain: true }) : p));

    const grouped = {};
    plain.forEach(p => {
      const cat = (p.category || 'Övrigt').toString();//det ska ändras med produkt läggning//
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    });

    const out = {};
    let idx = 1;
    Object.entries(grouped).forEach(([catName, items]) => {
      const itemlist = {};
      items.forEach((it, i) => {
        itemlist[`item${i + 1}`] = [it.title, it.description || ''];
      });

      out[`Category${idx++}`] = [
        catName.toLowerCase(),
        catName,
        {
          price1: items[0] ? items[0].price : 0,
          price2: 0,
          price3: 0,
          imageClass: items[0] ? items[0].image_url : '',
          itemlist
        }
      ];
    });

    return out;
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