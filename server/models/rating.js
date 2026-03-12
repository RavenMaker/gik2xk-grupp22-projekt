// models/rating.js
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    rating: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    tableName: 'ratings',
    timestamps: true,
    underscored: true
  });
  return Rating;
};