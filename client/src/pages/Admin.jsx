import React, { useState } from 'react';

const Admin = () => {
  const [menuData, setMenuData] = useState({});
  const [message, setMessage] = useState('');

  // Formulär för Kategori & Prisklass
  const [catForm, setCatForm] = useState({ name: '', title: '', p1: '', p2: '', p3: '', img: '' });

  // Formulär för Produkt
  const [prodForm, setProdForm] = useState({ selectedName: '', selectedTitle: '', title: '', desc: '' });

  // --- 1. SKAPA KATEGORI (Auto-ID) ---
  const saveCategory = (e) => {
    e.preventDefault();
    const nextId = `Category${Object.keys(menuData).length + 1}`;
    
    setMenuData({
      ...menuData,
      [nextId]: [
        catForm.name, 
        catForm.title, 
        { price1: catForm.p1, price2: catForm.p2, price3: catForm.p3, imageClass: catForm.img, itemlist: {} }
      ]
    });
    setMessage(`Kategorin "${catForm.title}" skapad!`);
    setCatForm({ name: '', title: '', p1: '', p2: '', p3: '', img: '' });
  };

  // --- 2. LÄGG TILL PRODUKT (Hittar rätt koppling dynamiskt) ---
  const saveProduct = (e) => {
    e.preventDefault();
    const targetKey = Object.keys(menuData).find(
      k => menuData[k][0] === prodForm.selectedName && menuData[k][1] === prodForm.selectedTitle
    );

    if (targetKey) {
      const newMenu = { ...menuData };
      const items = newMenu[targetKey][2].itemlist;
      const nextItemKey = `item${Object.keys(items).length + 1}`;
      
      items[nextItemKey] = [prodForm.title, prodForm.desc];
      setMenuData(newMenu);
      setMessage(`"${prodForm.title}" tillagd under ${prodForm.selectedTitle}`);
      setProdForm({ ...prodForm, title: '', desc: '' });
    }
  };

  // Hjälpfunktioner för dynamiska listor
  const uniqueNames = [...new Set(Object.values(menuData).map(v => v[0]))];
  const filteredTitles = Object.values(menuData)
    .filter(v => v[0] === prodForm.selectedName)
    .map(v => v[1]);

  return (
    <div className="container mt-5 pb-5">
      <h2 className="mb-4">Admin</h2>
      {message && <div className="alert alert-success">{message}</div>}

      <div className="row g-4">
        {/* FORM 1: KATEGORI & PRISKLASS */}
        <div className="col-md-5">
          <div className="card p-4 shadow-sm bg-light border-0">
            <h5 className="mb-3">1. Skapa Kategori & Prisklass</h5>
            <form onSubmit={saveCategory}>
              <input type="text" className="form-control mb-2" placeholder="Huvudkategori (t.ex. Pizza)" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} required />
              <input type="text" className="form-control mb-2" placeholder="Prisklass/Titel (t.ex. Pizza Klass 1)" value={catForm.title} onChange={e => setCatForm({...catForm, title: e.target.value})} required />
              <div className="row g-2 mb-2">
                <div className="col"><input type="number" className="form-control" placeholder="Pris 1" value={catForm.p1} onChange={e => setCatForm({...catForm, p1: e.target.value})} /></div>
                <div className="col"><input type="number" className="form-control" placeholder="Pris 2" value={catForm.p2} onChange={e => setCatForm({...catForm, p2: e.target.value})} /></div>
                <div className="col"><input type="number" className="form-control" placeholder="Pris 3" value={catForm.p3} onChange={e => setCatForm({...catForm, p3: e.target.value})} /></div>
              </div>
              <input type="text" className="form-control mb-3" placeholder="Bild-sökväg" value={catForm.img} onChange={e => setCatForm({...catForm, img: e.target.value})} />
              <button className="btn btn-dark w-100 fw-bold">Spara Kategori</button>
            </form>
          </div>
        </div>

        {/* FORM 2: PRODUKT */}
        <div className="col-md-7">
          <div className="card p-4 shadow-sm border-0">
            <h5 className="mb-3">2. Lägg till Produkt</h5>
            <form onSubmit={saveProduct}>
              <div className="row mb-2">
                <div className="col-md-6">
                  <select className="form-select" value={prodForm.selectedName} onChange={e => setProdForm({...prodForm, selectedName: e.target.value, selectedTitle: ''})} required>
                    <option value="">Välj Kategori...</option>
                    {uniqueNames.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <select className="form-select" value={prodForm.selectedTitle} onChange={e => setProdForm({...prodForm, selectedTitle: e.target.value})} disabled={!prodForm.selectedName} required>
                    <option value="">Välj Prisklass...</option>
                    {filteredTitles.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <input type="text" className="form-control mb-2" placeholder="Produktens namn" value={prodForm.title} onChange={e => setProdForm({...prodForm, title: e.target.value})} required />
              <textarea className="form-control mb-3" placeholder="Ingredienser" value={prodForm.desc} onChange={e => setProdForm({...prodForm, desc: e.target.value})} />
              <button className="btn btn-primary w-100 fw-bold" disabled={!prodForm.selectedTitle}>Spara Produkt</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;