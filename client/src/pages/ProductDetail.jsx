import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function ProductRating({ productId, initialRating, initialCount }) {
  
    const [rating, setRating] = useState(parseFloat(initialRating) || 0);
    const [count, setCount] = useState(parseInt(initialCount) || 0);
    const [hover, setHover] = useState(0);

    useEffect(() => {
        setRating(parseFloat(initialRating) || 0);
        setCount(parseInt(initialCount) || 0);
    }, [initialRating, initialCount]);

    const saveRating = async (val) => {
        const res = await fetch(`http://localhost:5000/api/products/${productId}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: val })
        });
        if (res.ok) {
            setCount(c => c + 1);
            alert("Tack!");
        }
    };

    return (
        <div className="d-flex align-items-center">
            {[1, 2, 3, 4, 5].map((i) => {
                const activeVal = hover || rating;
                let fill = 0;
                if (activeVal >= i) fill = 100;
                else if (activeVal > i - 1) fill = (activeVal - (i - 1)) * 100;

                return (
                    <span key={i} onClick={() => saveRating(i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
                          style={{ position: 'relative', cursor: 'pointer', fontSize: '1.2rem', color: '#ccc' }}>
                        <span>★</span>
                        <span style={{
                            position: 'absolute', top: 0, left: 0, width: `${fill}%`,
                            overflow: 'hidden', color: '#ffc107'
                        }}>★</span>
                    </span>
                );
            })}
            <span className="ms-2 small text-muted">({count})</span>
        </div>
    );
}

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
      const [urlName, title, { price1, price2, price3, imageClass, itemlist }] = category;

      Object.entries(itemlist).forEach(([itemKey, itemData]) => {
        const [namn, beskrivning, productId, avgRating, revCount, customP1, customP2, customP3, customImg] = itemData;

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
    <div className="product-page">
      <div className="container card shadow p-4">
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

       
        
        <ProductRating productId={product.productId} initialRating={product.avgRating} initialCount={product.revCount} />

        <Link to="/menu" className="btn btn-dark mt-3">
          Tillbaka till menyn
        </Link>
      </div>
    </div>
  );
}