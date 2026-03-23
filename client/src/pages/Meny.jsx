import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { API } from '../utils/api'
import CartNavbar from '../components/CartNavbar'
import PriceModal from '../components/PriceModal'
import CategoryCard from '../components/CategoryCard'

const API_URL = 'http://localhost:5000/api';
const CART_KEY = 'guestCart'; // localStorage key

const topCategories = [
    { href: "pizza",        img: "https://cdn-icons-png.flaticon.com/512/1404/1404945.png",     name: "Pizzor"},
    { href: "hamburgare",   img: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",     name: "Hamburgare" },
    { href: "kebabratter",  img: "https://cdn-icons-png.flaticon.com/512/706/706893.png",       name: "Kebabrätter" },
    { href: "alacarte",     img: "https://cdn-icons-png.flaticon.com/512/11790/11790156.png",   name: "À la carte" },
    { href: "rullar",       img: "https://cdn-icons-png.flaticon.com/512/8616/8616731.png",     name: "Rullar" },
    { href: "salad",        img: "https://cdn-icons-png.flaticon.com/512/2515/2515183.png",     name: "Salad" },
    { href: "husman",       img: "https://cdn-icons-png.flaticon.com/512/3480/3480823.png",     name: "Husman" },
    { href: "pastaratter",  img: "https://cdn-icons-png.flaticon.com/512/4465/4465494.png",     name: "Pastarätter" },
    { href: "dryck",        img: "https://cdn-icons-png.flaticon.com/512/2738/2738730.png",     name: "Våra drycker" },
    { href: "extra",        img: "https://cdn-icons-png.flaticon.com/512/3082/3082037.png",     name: "Extra tillägg" },
]

// --- localStorage helpers ---
const loadCart = () => {
    try {
        const saved = localStorage.getItem(CART_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch { return []; }
};

    useEffect(() => {
        setRating(parseFloat(initialRating) || 0); 
        setCount(parseInt(initialCount) || 0);
    }, [initialRating, initialCount]);

    const saveRating = async (val) => {
        const res = await fetch(`${API}/products/${productId}/rate`, {
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
const saveCart = (cart) => {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
};

export default function Meny() {
    const [valdKategori, setValdKategori] = useState("")
    const [menuItem, setMenuItem] = useState({})
    const [loading, setLoading] = useState(true)
    const [cart, setCart] = useState(loadCart) // load saved cart immediately
    const [showModal, setShowModal] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);
    const [cartMessage, setCartMessage] = useState('');

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        fetch(`${API}/products/menu`)
        saveCart(cart);
    }, [cart]);

    // Fetch menu on mount
    useEffect(() => {
        fetch(`${API_URL}/products/menu`)
            .then(res => {
                if (!res.ok) throw new Error("Servern svarade med fel")
                return res.json()
            })
            .then(data => {
                setMenuItem(data)
                setLoading(false)
            })
            .catch(err => {
                console.error("Fel vid hämtning:", err)
                setLoading(false)
                setError(err)
            })
    }, [])

    const openPriceSelection = (productName, prices, productId) => {
        setActiveProduct({ name: productName, prices, productId });
        setShowModal(true);
    };

    const addToCart = (productName, type, price, productId) => {
        setShowModal(false);

        setCart(prev => {
            // Use productId + type as key so "Pizza (Avh.)" and "Pizza (Serv.)" are separate
            const key = `${productId}-${type}`;
            const existing = prev.find(item => item.key === key);
            let updated;
            if (existing) {
                updated = prev.map(item =>
                    item.key === key ? { ...item, amount: item.amount + 1 } : item
                );
            } else {
                updated = [...prev, {
                    key,
                    id: productId,
                    name: `${productName} (${type})`,
                    price,
                    amount: 1
                }];
            }
            return updated;
        });

        showMessage('Tillagd i varukorgen!');
    };

    const removeFromCart = (key) => {
        setCart(prev => prev.filter(item => item.key !== key));
    };

    const showMessage = (msg) => {
        setCartMessage(msg);
        setTimeout(() => setCartMessage(''), 2500);
    };

    const section = useRef(null)
    const scrollToSection = (elementRef) => {
        window.scrollTo({
            top: elementRef.current.offsetTop,
            behavior: "smooth",
        });
    };

    const itemIds = {};
    let idCounter = 1;
    Object.entries(menuItem).forEach(([catKey, category]) => {
        if (category[0] && category[0].toLowerCase() === "pizza") {
            Object.keys(category[2].itemlist).forEach(itemKey => {
                itemIds[`${catKey}-${itemKey}`] = idCounter++;
            });
        }
    });

    const idlist = {};
    let countingItems = 1;
    Object.entries(menuItem).forEach(([catKey, category]) => {
        if (category[0] && category[0].toLowerCase()) {
            Object.keys(category[2].itemlist).forEach(itemKey => {
                idlist[`${catKey}-${itemKey}`] = countingItems++;
            });
        }
    });

    return (
        <div className="menu-page">
            <CartNavbar cart={cart} onRemove={removeFromCart} /> 

            {cartMessage && (
                <div
                    className="position-fixed bottom-0 end-0 m-3 alert alert-success shadow"
                    style={{ zIndex: 9999, minWidth: '200px' }}
                >
                    {cartMessage}
                </div>
            )}

            <div className="container mt-4">
                <h1 className="menu-title">Vår meny</h1>
                <div className="row menu">
                    {topCategories.map((cat) => (
                        <div key={cat.href} className="col-md-4 col-sm-6 menu-item text-center">
                            <a className="menu-link" href="#section" onClick={(e) => { e.preventDefault(); setValdKategori(cat.href); scrollToSection(section) }}>
                                <img className="menu-icon" src={cat.img} alt={cat.name} />
                                <div className="menu-name">{cat.name}</div>
                            </a>
                        </div>
                    ))}
                    <div className="col-md-4 col-sm-6 menu-all text-center">
                        <a className="menu-link" href="#section" onClick={(e) => { e.preventDefault(); setValdKategori(""); scrollToSection(section) }}>
                            <div className="menu-name">Visa alla</div>
                        </a>
                    </div>
                </div>

                {valdKategori && (
                    <p className='text' style={{ margin: '1rem 0' }}>
                        Filtrerar på: <strong>{valdKategori}</strong>
                    </p>
                )}

                <div id="MenuList" ref={section}>
                    {Object.entries(menuItem)
                        .filter(([catKey, c]) => valdKategori === "" || c[0].toLowerCase() === valdKategori.toLowerCase())
                        .map(([catKey, category], index) => (
                            <CategoryCard
                                key={index}
                                category={category}
                                catKey={catKey}
                                itemIds={itemIds}
                                idlist={idlist}
                                onAdd={openPriceSelection}
                            />
                        ))}
                </div>
            </div>

            {showModal && (
                <PriceModal
                    activeProduct={activeProduct}
                    onAdd={addToCart}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    )
}
