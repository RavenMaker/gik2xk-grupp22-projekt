import { useEffect, useState } from "react";

const weekdays = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"];

const defaultMenu = {
  Måndag: ["Pannbiff med kokt potatis, lingonsylt & gräddsås.", "Pasta carbonara."],
  Tisdag: ["Grillbiff med pommes & bearnaisesås.", "Stekt falukorv med stekt potatis & senapssås."],
  Onsdag: ["Helstekt fläskfilé med stekt potatis & pepparsås.", "Hemgjorda köttbullar med potatismos, lingonsylt & brunsås."],
  Torsdag: ["Stekt fläsk med kokt potatis, lingonsylt & löksås.", "Kycklingspett med pommes, tomatsås & tzatziki."],
  Fredag: ["Fläsknoisette med stekt potatis, rödvinssås & bearnaisesås.", "Flygande Jacob med ris."]
};

export default function Meny() {
  const [menu, setMenu] = useState(defaultMenu);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // 1. Kolla om URL:en innehåller ?mode=edit (skickas från Admin.jsx)
    const params = new URLSearchParams(window.location.search);
    if (params.get('edit') === 'true') {
      setIsAdmin(true);
      setEditMode(true);
    }

    // 2. Hämta sparad meny från localStorage
    try {
      const saved = localStorage.getItem("lunchMenu");
      if (saved) setMenu(JSON.parse(saved));
    } catch (e) {
      console.error("Could not load lunch menu:", e);
    }
  }, []);

  const handleDishChange = (day, idx, value) => {
    setMenu(prev => ({ ...prev, [day]: prev[day].map((d, i) => (i === idx ? value : d)) }));
  };

  const addDish = (day) => {
    setMenu(prev => ({ ...prev, [day]: [...prev[day], ""] }));
  };

  const removeDish = (day, idx) => {
    setMenu(prev => ({ ...prev, [day]: prev[day].filter((_, i) => i !== idx) }));
  };

  const saveMenu = () => {
    try {
      localStorage.setItem("lunchMenu", JSON.stringify(menu));
      setEditMode(false);
      alert("Lunchmenyn har sparats!");
    } catch (e) {
      alert("Det gick inte att spara.");
    }
  };

  const resetMenu = () => {
    if (!confirm("Vill du återställa till standardmenyn?")) return;
    setMenu(defaultMenu);
    localStorage.setItem("lunchMenu", JSON.stringify(defaultMenu));
  };

  return (
    <div className="lunch-page">
      <h1 className="lunch-title">Lunchmeny</h1>
      <p className="lunch-text">Vår lunchmeny serveras måndag till fredag mellan kl. 11:00 och 14:00.</p>
      {/* ADMIN-PANEL: Syns endast för inloggade admins */}
      {isAdmin && (
        <div className="mt-5 p-4 border-top bg-white shadow-sm rounded admin-Panel">
          <h5 className="mb-3">Administratörsverktyg</h5>
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-primary" onClick={() => setEditMode(!editMode)}>
              {editMode ? "Visa som kund" : "Redigera rätter"}
            </button>
            
            {editMode && (
              <button className="btn btn-success" onClick={saveMenu}>Spara ändringar</button>
            )}
            
            <button className="btn btn-outline-warning" onClick={resetMenu}>Återställ standard</button>
            
            {/* TILLBAKA TILL ADMIN-PANELEN */}
            <button className="btn btn-dark ms-auto" onClick={() => window.location.href = '/admin'}>
              ← Tillbaka till Admin-panelen
            </button>
          </div>
        </div>
      )}
      <div className="lunch-list">
        {weekdays.map(day => (
          <section key={day} className="mb-4">
            <h3 style={{ color: "#0b57a4" }}>{day}.</h3>
            {editMode && isAdmin ? (
              <div className="p-3 border rounded bg-light">
                {menu[day].map((dish, idx) => (
                  <div key={idx} className="d-flex gap-2 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={dish}
                      onChange={e => handleDishChange(day, idx, e.target.value)}
                    />
                    <button className="btn btn-outline-danger btn-sm" onClick={() => removeDish(day, idx)}>Ta bort</button>
                  </div>
                ))}
                <button className="btn btn-sm btn-outline-primary" onClick={() => addDish(day)}>+ Lägg till rätt</button>
              </div>
            ) : (
              <ul className="list-unstyled ms-3">
                {menu[day].map((dish, idx) => (
                  <li key={idx} className="mb-1">• {dish}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      
    </div>
  );
}