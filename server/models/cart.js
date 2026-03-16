module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    payed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false // Startar som obetald [cite: 168, 169]
    }
  }, {
    tableName: 'cart',
    timestamps: true,
    underscored: true // Skapar created_at och updated_at [cite: 157, 159]
  });

  Cart.associate = (models) => {
    // En varukorg tillhör en användare [cite: 173, 188]
    Cart.belongsTo(models.User, { foreignKey: 'user_id' });
    // En varukorg kan innehålla många produkter via cart_row 
    Cart.belongsToMany(models.Product, { 
      through: models.CartRow, 
      foreignKey: 'cart_id' 
    });
  };
  

  return Cart;
};