module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // PK id skapas automatiskt som int [cite: 131, 154]
    first_name: {
      type: DataTypes.STRING, // varchar [cite: 137]
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING, // varchar [cite: 139]
      allowNull: false
    },
    email: {
      type: DataTypes.STRING, // varchar [cite: 141]
      allowNull: false,
      unique: true // Viktigt för inloggning
    },
    password: {
      type: DataTypes.STRING, // varchar [cite: 143]
      allowNull: false
    }
  }, {
    tableName: 'users', // Namn enligt UML [cite: 130]
    timestamps: true,   // Skapar created_at och updated_at [cite: 132, 134]
    underscored: true   // Använder snake_case (understreck) enligt UML [cite: 132]
  });

  User.associate = (models) => {
    // En användare kan ha en varukorg 
    // Detta skapar kopplingen där cart tabellen får user_id 
    User.hasOne(models.Cart, { foreignKey: 'user_id' });
  };

  return User;
};
