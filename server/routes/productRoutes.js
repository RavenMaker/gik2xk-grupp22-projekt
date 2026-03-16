const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

// Extra: return menu-shaped data matching client's fallbackData structure
router.get('/menu', async (req, res) => {
  try {
    const products = await productService.getAllProducts();

    // Group products by category
    const grouped = {};
    products.forEach(p => {
      const cat = (p.category || 'Övrigt').toString();
      if (!grouped[cat]) grouped[cat] = { items: [], image: p.image_url || '' };
      grouped[cat].items.push(p);
      if (!grouped[cat].image && p.image_url) grouped[cat].image = p.image_url;
    });

    // Build fallback-like object
    const out = {};
    let i = 1;
    Object.entries(grouped).forEach(([catName, info]) => {
      const itemlist = {};
      info.items.forEach((it, idx) => {
        itemlist[`item${idx + 1}`] = [it.title, it.description || ''];
      });

      out[`Category${i++}`] = [
        catName.toLowerCase(),
        catName,
        {
          price1: info.items[0] ? info.items[0].price : 0,
          price2: 0,
          price3: 0,
          imageClass: info.image || '',
          itemlist
        }
      ];
    });

    res.json(out);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 1. Hämta alla produkter
router.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Meny: returnerar menyn i samma format som klientens `fallbackData`
router.get('/menu', async (req, res) => {
  try {
    const menu = await productService.getMenu();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Hämta en specifik produkt (inkl. betyg och snitt)
router.get('/:id', async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Hittades inte" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. GE ETT BETYG (Denna saknades!)
// Krav sida 5: "Gränssnitt för att betygsätta en produkt"
router.post('/:id/rate', async (req, res) => {
  try {
    const productId = req.params.id;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Betyget måste vara mellan 1 och 5." });
    }

    const newRating = await productService.addRating(productId, rating);
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Lägg en produkt i varukorgen (Krav sida 8)
router.post('/add-to-cart', async (req, res) => {
  try {
    const { userId, productId, amount } = req.body;

    if (!userId || !productId || !amount) {
      return res.status(400).json({ message: "userId, productId och amount krävs." });
    }

    const cartRow = await productService.addProductToCart(userId, productId, amount);
    res.status(201).json({
      message: "Produkten har lagts till i varukorgen",
      data: cartRow
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. Skapa ny produkt (Admin - Krav sida 9)
router.post('/', async (req, res) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 6. Ta bort produkt (Admin - Krav sida 9)
router.delete('/:id', async (req, res) => {
  try {
    const success = await productService.deleteProduct(req.params.id);
    if (success) res.sendStatus(204);
    else res.status(404).json({ message: "Kunde inte radera" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;