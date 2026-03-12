import { useState, useEffect } from 'react'

const topCategories = [
    { href: "pizza",        img: "https://cdn-icons-png.flaticon.com/512/1404/1404945.png", name: "Pizzor"},
    { href: "hamburgare",   img: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png", name: "Hamburgare" },
    { href: "kebabratter",  img: "https://cdn-icons-png.flaticon.com/512/706/706893.png",   name: "Kebabrätter" },
    { href: "alacarte",     img: "https://cdn-icons-png.flaticon.com/512/11790/11790156.png", name: "À la carte" },
    { href: "rullar",       img: "https://cdn-icons-png.flaticon.com/512/8616/8616731.png", name: "Rullar" },
    { href: "salad",     img: "https://cdn-icons-png.flaticon.com/512/2515/2515183.png", name: "vegetarian" },
    { href: "husman",       img: "https://cdn-icons-png.flaticon.com/512/3480/3480823.png", name: "Husman" },
    { href: "pastaratter",  img: "https://cdn-icons-png.flaticon.com/512/4465/4465494.png", name: "Pastarätter" },
    { href: "dryck", img: "https://cdn-icons-png.flaticon.com/512/2738/2738730.png", name: "Våra drycker" },
    { href: "extra",        img: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png", name: "Extra tillägg" },
]

const fallbackData = {
    Category1:['Pizza','Pizza Class 1',{
        price1: 100,
        price2: 120,
        price3: 259,
        imageClass:"/imges/Vesuvio_pizza.jpeg",
        itemlist: {
            item1:["Margherita Pizza", "En klassisk pizzamåltid med tomatsås, mozzarella och basill."],
            item2:["Pepperoni Pizza", "En populär pizzamåltid med tomatsås, mozzarella och pepperoni."],  
            item3:["Hawaiian Pizza", "En fruktig pizzamåltid med tomatsås, mozzarella och ananas."],
            item5:["Meat Lovers Pizza", "En köttig pizzamåltid med tomatsås, mozzarella och köttfärs."]
        }
    }],
    Category2: ['Pizza','Pizza Class 2', {
        price1: 125,
        price2: 170,
        price3: 270,
        imageClass:"/imges/Budapest_pizza.jpeg",
        itemlist: {
            item1:["kebab Pizza", "kebab, ost, tomatsås"],
            item2:["HawaiiSpecial", "annanas, bannan, sinka, ost"],  
            item3:["kalsone", "inbakad pizza med ost, tomatsås"]
        }
    }],
    Category3:['salad', 'vegetarian', {
            price1: 40,
            price2: 70,  
            price3: 0,
            imageClass:"/imges/Peperoni_pizza.jpeg",
            itemlist: {
                item1:["Caesar Salad", "En frisk och smakrik sallat med kyckling, ost och dressing."],
                item2:["Grilled Chicken Salad", "En frisk och smakrik sallat med grillad kyckling, ost och dressing."],
                item3:["Greek Salad", "En frisk och smakrik sallat med fetaost, tomater och oliver."],
                item4:["Caprese Salad", "En frisk och smakrik sallat med tomater, fetaost och basilika."],
                item5:["Tuna Salad", "En frisk och smakrik sallat med tonfisk, avocado och dressing."]
            }
        }],
    Category4: ['dryck','dryck', {
            price1: 25,
            price2: 30,
            price3: 50,
            imageClass:"/imges/Vesuvio_pizza.jpeg",
            itemlist: {
                item1:["Coca Cola", "En klassisk läskedryck som är känd för sin söta och kolsyrade smak. Perfekt för att släcka törsten och njuta av en uppfriskande dryck."],
                item2:["Fanta", "En populär läskedryck med en fruktig smak. Perfekt för att släcka törsten och njuta av en uppfriskande dryck."],
                item3:["Sprite", "En refreshing läskedryck med en fruktig smak. Perfekt för att släcka törsten och njuta av en uppfriskande dryck."],     
                item4:["Mineralvatten", "En ren och frisk mineralvatten. Perfekt för att släcka törsten och njuta av en uppfriskande dryck."],
                item5:["Jordgubbsjuice", "En naturlig jordgubbsjuice med en fruktig smak. Perfekt för att släcka törsten och njuta av en uppfriskande dryck."]
            }
        }]

};


export default function Meny() {
    const [valdKategori, setValdKategori] = useState("")
    const [menuItem, setMenuItem] = useState({}) 
    const [loading, setLoading] = useState(true)  
    const [error, setError] = useState(null)

    // Hämta data när sidan laddas
    useEffect(() => {
        fetch("http://localhost:3000/menu")     
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
                setMenuItem(fallbackData)
                setLoading(false)
                setError(null)  
            })
    }, []) // [] = kör bara en gång när sidan laddas

    const itemIds = {}
    let idCounter = 1
    Object.entries(menuItem).forEach(([catKey, category]) => {
        Object.keys(category[2].itemlist).forEach(itemKey => {
            itemIds[`${catKey}-${itemKey}`] = idCounter++
        })
    })
    // Filtrera kategorier
    const visadeKategorier = Object.values(menuItem).filter(category => {
        if (valdKategori === "") return true
        return category[0].toLowerCase() === valdKategori.toLowerCase()
    })




    // ── Visa laddning / fel / innehåll ──
    if (loading) return <p style={{ padding: '2rem' }}>Laddar meny...</p>
    if (error)   return <p style={{ padding: '2rem', color: 'red' }}>Fel: {error}</p>

    return (
        <div>
            <h1 className="menu-title">Vår meny</h1>

            {/* Kategori-knappar */}
            <div className="row menu">
                {/* Visa alla */}
                <div className="col-md-4 col-sm-6 menu-item text-center">
                    <a className="menu-link" href="/menu" onClick={(e) => { e.preventDefault(); setValdKategori("") }}>
                        <div className="menu-name">Visa alla</div>
                    </a>
                </div>

                {topCategories.map((cat) => (
                    <div key={cat.href} className="col-md-4 col-sm-6 menu-item text-center">
                        <a className="menu-link" onClick={(e) => { e.preventDefault(); setValdKategori(cat.href) }}>
                            <img className="menu-icon" src={cat.img} alt={cat.name} />
                            <div className="menu-name">{cat.name}</div>
                        </a>
                    </div>
                ))}
            </div>

            {valdKategori && (
                <p style={{ margin: '1rem 0' }}>
                    Filtrerar på: <strong>{valdKategori}</strong>
                </p>
            )}

            {/* Meny-kort */}
            <div id="MenuList">
                {visadeKategorier.length === 0 ? (
                    <p>Inga rätter hittades i denna kategori.</p>
                ) : (
                    (() => {
                        let counter = 1
                        return visadeKategorier.map((category, index) => {
                            const catKey = Object.keys(menuItem).find(k => menuItem[k] === category)
                            return <CategoryCard key={index} category={category} catKey={catKey} itemIds={itemIds} />
                        })
                    })()
                )}
            </div>
        </div>
    )
}



function CategoryCard({category, catKey, itemIds }) {
    const [urlName,title, { price1, price2, price3, imageClass, itemlist }] = category

    return (
        <div className='pizza-category'>
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
                        {Object.entries(itemlist).map(([itemKey, [namn, beskrivning]]) => (
                            <li key={itemKey} className="Pizza-discription">
                                <strong>{itemIds[`${catKey}-${itemKey}`]}. {namn}</strong> – {beskrivning}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    )
}