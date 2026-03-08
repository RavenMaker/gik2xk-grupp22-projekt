const container = document.getElementById('container');

function getCategorys() {
    fetch(`http://localhost:3000/menuItems/Category`)
        .then(response => response.json())
        .then(data => {
            for(let i = 0; i < data.length; i++) {
                const card=createCard();
                card.appendChild(createPricesAndCategory(data.Category, data.price1, data.price2, data.price3));
                data.forEach(item => {
                    const { title, description} = item;
                    card.appendChild(createCardMenu(title, description));
                });
            } 
        })
        .catch(error => console.error('Error fetching prices:', error));
}


function createCard() {
    const card = document.createElement('div');
    card.classList.add('card', 'display-card');
    container.appendChild(card);
    return card;
}

function createCardMenu(title, description) {
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card', 'card-Menu');    
    const cardItems = createinfoBox(title, description);
    cardInfo.appendChild(cardItems); 
    return cardInfo;
}

function createinfoBox(title, description) {
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card','card-info');   
    const cardItems = createTextInputs(title, description);
    cardInfo.appendChild(cardItems.cardTitle);
    cardInfo.appendChild(cardItems.cardDescription);
    return cardInfo;     
}

function createPricesAndCategory(Category, price1, price2, price3) {
    const priceList = document.createElement('div');
    priceList.classList.add('price-list');
    price1 > 0 ? price1 = `Avh ${price1}:-` : price1 = ' ';
    price2 > 0 ? price2 = `Serv ${price2}:-` : price2 = ' ';
    price3 > 0 ? price3 = `Familj ${price3}:-` : price3 = ' ';
    priceList.innerHTML = `
    <h3>${Category}</h3>
    <div class="price-list">
        <p>${price1}</p>
        <p>${price2}</p>
        <p>${price3}</p>
    </div>
    `;
    return priceList;
}


function createTextInputs(title, description) {
    const cardTitle = document.createElement('h4');
    cardTitle.textContent = title + " - ";
    const cardDescription = document.createElement('p');
    cardDescription.textContent = description;
    return { cardTitle, cardDescription };
}


function getMenuItems(categoryName="") {
    const menuItem = {
        Category1:['Pizza','Pizza Class 1',{
                price1: 100,
                price2: 150,
                price3: 259,
                itemlist: {
                    item1:["Margherita Pizza", "En klassisk pizzamåltid med tomatsås, mozzarella och basill."],
                    item2:["Pepperoni Pizza", "En populär pizzamåltid med tomatsås, mozzarella och pepperoni."],  
                    item3:["Hawaiian Pizza", "En fruktig pizzamåltid med tomatsås, mozzarella och ananas."],
                    item5:["Meat Lovers Pizza", "En köttig pizzamåltid med tomatsås, mozzarella och köttfärs."],
                }
            }],
        Category2:['salad', 'vegetarian', {
                price1: 40,
                price2: 70,  
                price3: 0,
                itemlist: {
                    item1:["Caesar Salad", "En frisk och smakrik sallat med kyckling, ost och dressing."],
                    item2:["Grilled Chicken Salad", "En frisk och smakrik sallat med grillad kyckling, ost och dressing."],
                    item3:["Greek Salad", "En frisk och smakrik sallat med fetaost, tomater och oliver."],
                    item4:["Caprese Salad", "En frisk och smakrik sallat med tomater, fetaost och basilika."],
                    item5:["Tuna Salad", "En frisk och smakrik sallat med tonfisk, avocado och dressing."],
                }
            }],
        Category3: ['dryck','dryck', {
                price1: 25,
                price2: 30,
                price3: 50,
                itemlist: {

                    item1:["Coca Cola", "En klassisk läskedryck som är känd för sin söta och kolsyrade smak. Perfekt för att släcka törsten och njuta av en uppfriskande dryck."],
                    item2:["Fanta", "En populär läskedryck med en fruktig smak. Perfekt för att släcka törsten och njuta av en uppfriskande dryck."],
                    item3:["Sprite", "En refreshing läskedryck med en fruktig smak. Perfekt för att släcka törsten och njuta av en uppfriskande dryck."],     
                    item4:["Mineralvatten", "En ren och frisk mineralvatten. Perfekt för att släcka törsten och njuta av en uppfriskande dryck."],
                    item5:["Jordgubbsjuice", "En naturlig jordgubbsjuice med en fruktig smak. Perfekt för att släcka törsten och njuta av en uppfriskande dryck."],
                }
            }],
            Category4: ['Pizza','Pizza Class 2', {
                price1: 125,
                price2: 170,
                price3: 270,
                itemlist: {
                    item1:["kebab Pizza", "kebab, ost, tomatsås"],
                    item2:["HawaiiSpecial", "annanas, bannan, sinka, ost"],  
                    item3:["kalsone", "inbakad pizza med ost, tomatsås"]
                }
            }]
        };
    for (const category in menuItem) {

        if (categoryName === menuItem[category][0] || categoryName === "") {
        console.log(menuItem[category]);
        const card=createCard();
        const CategiryTitle = menuItem[category][1];
        const { price1, price2, price3, itemlist } = menuItem[category][2];
        card.appendChild(createPricesAndCategory(CategiryTitle, price1, price2, price3));
        for (const item in itemlist) {
            console.log(itemlist[item]);
            const titel = itemlist[item][0];
            const description = itemlist[item][1];
            card.appendChild(createCardMenu(titel, description));
        }
        }
    }
}

//getMenuItems är hur filstren ska se ut och bli hämtad utifrån api som vi koplat til databasen och forloopen är hur vi ska extrahera datan och skapa korten utifrån det.
//de andra grejerna är bara för att skapa korten och lägga till texten i dom.
//getCategorys är hur vi ska hämta datan från databasen och skapa korten utifrån det, men just nu så behöver vi bara fixa så att den hämta data ifrån de api så bör det funka

container.appendChild(getMenuItems("Pizza"));