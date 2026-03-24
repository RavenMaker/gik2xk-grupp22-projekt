import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from '../utils/api'
import ProductRating from '../components/ProductRating';

export default function ProductDetail() {
  const { id } = useParams();

  const [menuItem, setMenuItem] = useState({});
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  // Lista av betyg hämtad direkt från databasen (krav sida 5)
  const [ratingsList, setRatingsList] = useState([]);

  useEffect(() => {
    fetch(`${API}/products/menu`)
      .then((res) => {
        if (!res.ok) throw new Error("Serverfel");
        return res.json();
      })
      .then((data) => {
        setMenuItem(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const idlist = {}; 
  let countingItems = 1;
  Object.entries(menuItem).forEach(([catKey, category]) => {
    Object.keys(category[2].itemlist).forEach(itemKey => {
      idlist[`${catKey}-${itemKey}`] = countingItems++;
    });
  });

  useEffect(() => {
    if (!menuItem || Object.keys(menuItem).length === 0) return;

    let foundProduct = null;
    let runningId = 1;

    Object.entries(menuItem).forEach(([catKey, category]) => {
      const [urlName, title, { price1, price2, price3, price4, imageClass, itemlist }] = category;

      Object.entries(itemlist).forEach(([itemKey, itemData]) => {
        const [namn, beskrivning, productId, avgRating, revCount, customP1, customP2, customP3, costumP4, customImg] = itemData;

        if (String(runningId) === String(id)) {
          foundProduct = {
            productId,
            namn,
            beskrivning,
            img: (customImg && customImg.trim() !== "") ? customImg : imageClass,
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

    // Hämta individuella betyg från databasen när produkten hittas
    if (foundProduct) {
      fetch(`${API}/products/${foundProduct.productId}`)
        .then(res => res.json())
        .then(data => {
          setRatingsList(data.ratings || []);
        })
        .catch(() => setRatingsList([]));
    }
  }, [menuItem, id]);

  if (loading) {
    return (
      <div className="product-page">
        <h2>Laddar produkt...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page">
        <h2>Produkten hittades inte</h2>
        <Link to="/menu" className="btn btn-warning mt-3">
          Tillbaka till menyn
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5 product-detail">
      <div className="card shadow p-4">
        <h1>{product.namn}</h1>
        <div>
          <div>
            <p className="text-muted ">{product.categoryTitle}</p>
            <p>{product.beskrivning}</p>
          </div>
          <div>
            <img src={product.img} alt={product.namn} className="pizza-img" />
          </div>
        </div>

        <ProductRating
          productId={product.productId}
          initialRating={product.avgRating}
          initialCount={product.revCount}
        />

        {/* Lista av individuella betyg (krav sida 5) */}
        {ratingsList.length > 0 && (
          <div className="mt-3">
            <h6 className="mb-2">Betygshistorik ({ratingsList.length} betyg)</h6>
            <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {ratingsList.map((r, i) => (
                <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center py-1 px-0">
                  <span className="text-muted small">Betyg {i + 1}</span>
                  <span>
                    {[1,2,3,4,5].map(star => (
                      <span key={star} style={{ color: star <= r.rating ? '#ffc107' : '#ccc', fontSize: '0.9rem' }}>★</span>
                    ))}
                    <span className="ms-1 small text-muted">({r.rating})</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link to="/menu" className="btn btn-dark mt-3">
          Tillbaka till menyn
        </Link>
      </div>
    </div>
  );
}
