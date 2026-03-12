require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");

// Starta anslutningen
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});


const menuData = {
  pizza: [
    {
      groupTitle: "Pizza Class 1",
      price1: 100,
      price2: 120,
      price3: 259,
      imageClass: "Vesuvio_pizza.jpeg",
      itemlist: [
        ["Margherita Pizza", "En klassisk pizzamåltid med tomatsås, mozzarella och basilika."],
        ["Pepperoni Pizza", "En populär pizzamåltid med tomatsås, mozzarella och pepperoni."],
        ["Hawaiian Pizza", "En fruktig pizzamåltid med tomatsås, mozzarella och ananas."],
        ["Meat Lovers Pizza", "En köttig pizzamåltid med tomatsås, mozzarella och köttfärs."]
      ]
    },
    {
      groupTitle: "Pizza Class 2",
      price1: 125,
      price2: 170,
      price3: 270,
      imageClass: "Budapest_pizza.jpeg",
      itemlist: [
        ["Kebab Pizza", "kebab, ost, tomatsås"],
        ["Hawaii Special", "ananas, banan, skinka, ost"],
        ["Calzone", "inbakad pizza med ost, tomatsås"]
      ]
    }
  ],

  salad: [
    {
      groupTitle: "Vegetarian",
      price1: 40,
      price2: 70,
      price3: 100,
      imageClass: "Margaretta_pizza.jpeg",
      itemlist: [
        ["Caesar Salad", "En frisk och smakrik sallad med kyckling, ost och dressing."],
        ["Grilled Chicken Salad", "En frisk och smakrik sallad med grillad kyckling, ost och dressing."],
        ["Greek Salad", "En frisk och smakrik sallad med fetaost, tomater och oliver."],
        ["Caprese Salad", "En frisk och smakrik sallad med tomater, fetaost och basilika."],
        ["Tuna Salad", "En frisk och smakrik sallad med tonfisk, avocado och dressing."]
      ]
    }
  ],

  dryck: [
    {
      groupTitle: "Dryckor",
      price1: 25,
      price2: 0,
      price3: 0,
      imageClass: "Drickor.jpeg",
      itemlist: [
        ["Coca Cola", "En klassisk läskedryck som är känd för sin söta och kolsyrade smak."],
        ["Fanta", "En populär läskedryck med en fruktig smak."],
        ["Sprite", "En refreshing läskedryck med en fruktig smak."],
        ["Mineralvatten", "En ren och frisk mineralvatten."],
        ["Jordgubbsjuice", "En naturlig jordgubbsjuice med en fruktig smak."]
      ]
    }
  ]
};


app.get("/menuItems", (req, res) => {
  res.json(menuData);
});


app.get("/menuItems/Category/:categoryName", (req, res) => {
  const categoryName = req.params.categoryName.toLowerCase();

  if (!menuData[categoryName]) {
    return res.status(404).json({ message: "Kategori hittades inte" });
  }

  res.json(menuData[categoryName]);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});