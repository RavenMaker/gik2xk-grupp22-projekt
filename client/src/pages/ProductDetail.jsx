import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const fallbackData = {
  Category1: ['Pizza', 'Pizza Class 1', {
    price1: 100,
    price2: 120,
    price3: 259,
    imageClass: "/images/Vesuvio_pizza.jpeg",
    itemlist: {
      item1: ["Margherita Pizza", "En klassisk pizzamåltid med tomatsås, mozzarella och basilika."],
      item2: ["Pepperoni Pizza", "En populär pizzamåltid med tomatsås, mozzarella och pepperoni."],
      item3: ["Hawaiian Pizza", "En fruktig pizzamåltid med tomatsås, mozzarella och ananas."]
    }
  }],
  Category2: ['Pizza', 'Pizza Class 2', {
    price1: 125,
    price2: 170,
    price3: 270,
    imageClass: "/images/Budapest_pizza.jpeg",
    itemlist: {
      item1: ["Kebab Pizza", "Kebab, ost, tomatsås"],
      item2: ["Hawaii Special", "Ananas, banan, skinka, ost"],
      item3: ["Calzone", "Inbakad pizza med ost, tomatsås"]
    }
  }]
};

export default function ProductDetail() {
  const { id } = useParams();

  const [menuItem, setMenuItem] = useState({});
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products/menu")
      .then((res) => {
        if (!res.ok) throw new Error("Serverfel");
        return res.json();
      })
      .then((data) => {
        setMenuItem(data);
      })
      .catch(() => {
        setMenuItem(fallbackData);
      });
  }, []);

  useEffect(() => {
    if (!menuItem || Object.keys(menuItem).length === 0) return;

    let foundProduct = null;
    let runningId = 1;

    Object.entries(menuItem).forEach(([catKey, category]) => {
      const [urlName, title, { price1, price2, price3, imageClass, itemlist }] = category;

      Object.entries(itemlist).forEach(([itemKey, itemData]) => {
        const [namn, beskrivning, productId, avgRating, revCount, customP1, customP2, customP3] = itemData;

      if (String(runningId) === String(id)) {
          foundProduct = {
            namn,
            beskrivning,
            avgRating,
            revCount,
            categoryTitle: title,
          };
        }

        runningId++;
      });
    });

    setProduct(foundProduct);
    setLoading(false);
  }, [menuItem, id]);

  if (loading) {
    return (
      <div className="container mt-5">
        <h2>Laddar produkt...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5">
        <h2>Produkten hittades inte</h2>
        <Link to="/menu" className="btn btn-warning mt-3">
          Tillbaka till menyn
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow p-4">
        <h1>{product.namn}</h1>
        <p className="text-muted">{product.categoryTitle}</p>

        <p>{product.beskrivning}</p>

        <p>Betyg: {product.avgRating || 0}</p>

        <Link to="/menu" className="btn btn-dark mt-3">
          Tillbaka till menyn
        </Link>
      </div>
    </div>
  );
}