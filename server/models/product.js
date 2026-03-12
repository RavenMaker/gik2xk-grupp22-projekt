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
    image_url: { 
      type: DataTypes.STRING
    }
  }, {
    tableName: 'products',
    timestamps: true,
    underscored: true
  });

  return Product;
};