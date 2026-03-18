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
      alert("Meny sparad.");
    } catch (e) {
      console.error("Could not save lunch menu:", e);
      alert("Det gick inte att spara menyn.");
    }
  };

  const resetMenu = () => {
    if (!confirm("Återställ till standardmeny?")) return;
    setMenu(defaultMenu);
    localStorage.setItem("lunchMenu", JSON.stringify(defaultMenu));
  };

  const handleAdminLogin = () => {
    const pw = prompt("Adminlösenord:");
    if (pw === "admin123") {
      setIsAdmin(true);
      alert("Inloggad som admin.");
    } else {
      alert("Fel lösenord.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setEditMode(false);
  };

  return (
    <div className="lunch-page">
      <h1 className="lunch-title">Lunchmeny</h1>

      <p className="lunch-text">Vår lunchmeny serveras måndag till fredag mellan kl. 11:00 och 14:00.</p>

      <div style={{ marginBottom: 12 }}>
        {isAdmin ? (
          <>
            <button onClick={() => setEditMode(e => !e)}>{editMode ? "Avsluta redigering" : "Redigera meny"}</button>
            <button onClick={handleAdminLogout} style={{ marginLeft: 8 }}>Logga ut</button>
            <button onClick={resetMenu} style={{ marginLeft: 8 }}>Återställ standard</button>
          </>
        ) : (
          <button onClick={handleAdminLogin}>Logga in som admin</button>
        )}
      </div>

      <div className="lunch-list">
        {weekdays.map(day => (
          <section key={day} style={{ marginBottom: 18 }}>
            <h3 style={{ color: "#0b57a4" }}>{day}.</h3>
            {editMode && isAdmin ? (
              <div>
                {menu[day].map((dish, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <input
                      type="text"
                      value={dish}
                      onChange={e => handleDishChange(day, idx, e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button onClick={() => removeDish(day, idx)}>Ta bort</button>
                  </div>
                ))}
                <button onClick={() => addDish(day)}>Lägg till rätt</button>
              </div>
            ) : (
              <ul>
                {menu[day].map((dish, idx) => (
                  <li key={idx}>{dish}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {editMode && isAdmin && (
        <div style={{ marginTop: 12 }}>
          <button onClick={saveMenu}>Spara meny</button>
        </div>
      )}
    </div>
  );
}