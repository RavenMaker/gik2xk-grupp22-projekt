module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    // ID skapas automatiskt av Sequelize [cite: 151]
    title: {
      type: DataTypes.STRING,
      allowNull: false // Krävs för att identifiera produkten [cite: 165]
    },
    description: {
      type: DataTypes.TEXT // Längre text för produktbeskrivning [cite: 170]
    },
    price: {
      type: DataTypes.DOUBLE, // Pris i siffror [cite: 175, 176]
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING // Sökväg till bildfilen [cite: 178, 179]
    }
  }, {
    tableName: 'products', // Matchar namnet i ditt diagram [cite: 148]
    timestamps: true, // Skapar created_at och updated_at automatiskt [cite: 157, 159]
    underscored: true // Använder orms_format (t.ex. created_at istället för createdAt) [cite: 157]
  });

  return Product;
};