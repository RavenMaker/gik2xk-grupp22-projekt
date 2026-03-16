module.exports = (sequelize, DataTypes) => {
  const CartRow = sequelize.define('CartRow', {
    amount: {
      type: DataTypes.DOUBLE, // Antal produkter [cite: 166, 167]
      allowNull: false,
      defaultValue: 1
    }
  }, {
    tableName: 'cart_row',
    timestamps: true,
    underscored: true // Skapar created_at och updated_at [cite: 153, 161]
  });

  return CartRow;
};