import { useState, useEffect } from 'react'

const topCategories = [
    { href: "pizza",        img: "https://cdn-icons-png.flaticon.com/512/1404/1404945.png", name: "Pizzor"},
    { href: "hamburgare",   img: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png", name: "Hamburgare" },
    { href: "kebabratter",  img: "https://cdn-icons-png.flaticon.com/512/706/706893.png",   name: "Kebabrätter" },
    { href: "alacarte",     img: "https://cdn-icons-png.flaticon.com/512/11790/11790156.png", name: "À la carte" },
    { href: "rullar",       img: "https://cdn-icons-png.flaticon.com/512/8616/8616731.png", name: "Rullar" },
    { href: "salad",        img: "https://cdn-icons-png.flaticon.com/512/2515/2515183.png", name: "vegetarian" },
    { href: "husman",       img: "https://cdn-icons-png.flaticon.com/512/3480/3480823.png", name: "Husman" },
    { href: "pastaratter",  img: "https://cdn-icons-png.flaticon.com/512/4465/4465494.png", name: "Pastarätter" },
    { href: "dryck",        img: "https://cdn-icons-png.flaticon.com/512/2738/2738730.png", name: "Våra drycker" },
    { href: "extra",        img: "https://cdn-icons-png.flaticon.com/512/3082/3082037.png", name: "Extra tillägg" },
]

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
   

    return (
        <div className="menu-page">
            {/* NAVBAR (Varukorg) - Från kod 1 */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
                <div className="container">
                    <div className="dropdown ms-auto">
                        <button className="btn btn-warning dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Varukorg ({cart.length})
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow p-2" style={{ minWidth: '280px' }}>
                            {cart.length === 0 ? <li className="text-center p-2 text-muted">Tom</li> : (
                                <>
                                    {cart.map(item => (
                                        <li key={item.id} className="d-flex justify-content-between align-items-center border-bottom py-1 small">
                                            <span>{item.name}</span>
                                            <div>
                                                <span className="me-2">{item.price}:-</span>
                                                <button className="btn btn-sm text-danger p-0" onClick={() => removeFromCart(item.id)}>✖</button>
                                            </div>
                                        </li>
                                    ))}
                                    <li className="fw-bold pt-2 text-end">Totalt: {cart.reduce((s, i) => s + i.price, 0)}:-</li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Innehåll och Layout - Från kod 2 */}
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
                                onAdd={openPriceSelection} 
                            />
                        ))}
                </div>
            </div>

            {/* MODAL FÖR PRISVAL - Från kod 1 */}
            {showModal && activeProduct && (
                <div className="modal show d-block" style={{background: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Välj storlek: {activeProduct.name}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="d-grid gap-2">
                                    {activeProduct.prices.p1 > 0 && <button className="btn btn-outline-dark" onClick={() => addToCart(activeProduct.name, "Avh.", activeProduct.prices.p1)}>Avhämtning ({activeProduct.prices.p1}:-)</button>}
                                    {activeProduct.prices.p2 > 0 && <button className="btn btn-outline-dark" onClick={() => addToCart(activeProduct.name, "Serv.", activeProduct.prices.p2)}>Servering ({activeProduct.prices.p2}:-)</button>}
                                    {activeProduct.prices.p3 > 0 && <button className="btn btn-outline-dark" onClick={() => addToCart(activeProduct.name, "Familj", activeProduct.prices.p3)}>Familjepizza ({activeProduct.prices.p3}:-)</button>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function CategoryCard({ category, catKey, itemIds, onAdd }) {
    const [urlName, title, { price1, price2, price3, imageClass, itemlist }] = category

    

    return (
        <div className='pizza-category' >
            <div className="pizza-header">
                <h4 className="pizza-title">{title}</h4>
                <div className="pizza-prices col-md-4">
                    {price1 > 0 && <span>avh. {price1}:-</span>}
                    {price2 > 0 && <span>serv. {price2}:-</span>}
                    {price3 > 0 && <span>familj. {price3}:-</span>}
                </div>
            </div>

            <div className="row align-items-center g-4">
                <div className="col-md-4 text-center">
                    <img src={imageClass} alt={title} className="pizza-img" />
                </div>
                <div className="col-md-8">
                    <ol className="pizza-list">
                        {Object.entries(itemlist).map(([itemKey, itemData]) => {
                            // Vi packar upp hela arrayen. customP1 osv är de priser vi sparat på produkten.
                            const [namn, beskrivning, id, avgRating, revCount, customP1, customP2, customP3] = itemData;

                            // Logik: Om produkten har ett eget pris (> 0), använd det. Annars använd kategorins pris.
                            const productPrices = {
                                p1: customP1 > 0 ? customP1 : price1,
                                p2: customP2 > 0 ? customP2 : price2,
                                p3: customP3 > 0 ? customP3 : price3
                            };
                            const ProductPricesMessege={
                                p1Message: "Avh:" + productPrices.p1 +":-",
                                p2Message: "Serv:" + productPrices.p2 +":-",
                                p3Message: "Familj:" + productPrices.p3 +":-",
                            }

                            return (
                                <li key={itemKey} className="Pizza-discription mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className='d-flex flex-column'>
                                            <div style={{ flex: 1 }}>
                                                <strong>{itemIds[`${catKey}-${itemKey}`] ? `${itemIds[`${catKey}-${itemKey}`]}. ` : ""}{namn}</strong> – {beskrivning}
                                            </div>
                                            <div className='priceing-Invidual'>
                                                {(customP1 > 0 ) && (
                                                <div className="small mt-1">
                                                    <span className="badge bg-light text-dark border">
                                                        {ProductPricesMessege.p1Message} 
                                                    </span>
                                                </div>
                                                )}
                                                {(customP2 > 0 ) && (
                                                    <div className="small mt-1">
                                                        <span className="badge bg-light text-dark border">
                                                            {ProductPricesMessege.p2Message} 
                                                        </span>
                                                    </div>
                                                )}
                                                {(customP3 > 0 ) && (
                                                    <div className="small mt-1">
                                                        <span className="badge bg-light text-dark border">
                                                            {ProductPricesMessege.p3Message} 
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                       
                                        
                                        <div className="d-flex align-items-center">
                                           
                                            <ProductRating productId={id} initialRating={avgRating} initialCount={revCount} />
                                            
                                            {/* Skicka med de specifika produktpriserna till onAdd */}
                                            <button className="btn btn-sm btn-success ms-3" onClick={() => onAdd(namn, productPrices)}>
                                                + Lägg till
                                            </button>
                                        </div>

                                    </div>
                                    
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </div>
    )
}