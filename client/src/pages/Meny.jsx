import { useState, useEffect, useRef } from 'react'
import CartNavbar from '../components/CartNavbar'
import PriceModal from '../components/PriceModal'
import CategoryCard from '../components/CategoryCard'

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

export default function Meny() {
    const [valdKategori, setValdKategori] = useState("")
    const [menuItem, setMenuItem] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [cart, setCart] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/products/menu")
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
                setLoading(true)
                setError(null)
            })
    }, [])

    const openPriceSelection = (productName, prices) => {
        setActiveProduct({ name: productName, prices });
        setShowModal(true);
    };

    const addToCart = (productName, type, price) => {
        setCart([...cart, { name: `${productName} (${type})`, price: price, id: Date.now() }]);
        setShowModal(false);
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
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

            {/* Innehåll och Layout */}
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
