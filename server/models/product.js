module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    title: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    description: {
      type: DataTypes.TEXT 
    },
    price: {
      type: DataTypes.DOUBLE, 
      allowNull: false
    },
    image_url: { // Matchar UML-diagrammet på sida 7
      type: DataTypes.STRING 
    }
  }, {
    tableName: 'products', 
    timestamps: true, 
    underscored: true 
  });

  return Product;
};