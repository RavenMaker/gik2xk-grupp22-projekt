const { Cart, CartRow, Product } = require('../models');

const cartService = {
  // Som kund vill jag lägga produkter i en varukorg [cite: 88, 216]
  async addProductToCart(userId, productId, amount) {
    // 1. Hitta eller skapa en aktiv varukorg för användaren [cite: 220, 222]
    const [cart] = await Cart.findOrCreate({
      where: { user_id: userId, payed: false }
    });

    // 2. Kolla om produkten redan finns i korgen [cite: 224]
    const existingRow = await CartRow.findOne({
      where: { cart_id: cart.id, product_id: productId }
    });

    if (existingRow) {
      // Uppdatera antalet om den redan finns [cite: 224]
      return await existingRow.update({ amount: existingRow.amount + amount });
    } else {
      // Skapa en ny rad i kopplingstabellen [cite: 223]
      return await CartRow.create({
        cart_id: cart.id,
        product_id: productId,
        amount: amount
      });
    }
  }
};

module.exports = cartService;