const { Sequelize } = require("sequelize");

// Skapar instansen av Sequelize enligt dina inställningar 
const sequelize = new Sequelize({
  dialect: "sqlite", // Specificerar SQL-typ 
  storage: process.env.DB_STORAGE || "database.sqlite", // Var filen sparas 
  logging: false,
});

// En hjälpfunktion för att testa anslutningen och synka databasen
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Anslutning till SQLite-databasen lyckades!");
    
    // sync() skapar tabellerna baserat på dina modeller
    // { alter: true } uppdaterar tabellerna om du ändrar i dina modeller
    await sequelize.sync({ alter: true }); 
    console.log("Alla modeller synkroniserades.");
  } catch (error) {
    console.error("Kunde inte ansluta till databasen:", error);
  }
};

module.exports = { sequelize, connectDB };