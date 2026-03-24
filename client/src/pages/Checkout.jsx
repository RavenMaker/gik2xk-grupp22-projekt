import React, { useState, useEffect } from 'react';
import { API } from '../utils/api';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const userId = 1;

  useEffect(() => {
    // Hämtar listan som Meny.jsx har sparat
    const savedCart = JSON.parse(localStorage.getItem('guestCart')) || [];
    setCartItems(savedCart);
  }, []);

  const totalSum = cartItems.reduce((sum, item) => sum + (item.price * item.amount), 0);

  const handlePayment = async (e) => {
  e.preventDefault();

  const res = await fetch(`${API}/products/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 1 })
  });

  if (res.ok) {
    const data = await res.json();
    
    // Tömmer listan som finns i Meny.jsx
    localStorage.removeItem('guestCart');

    // Visar meddelandet från API:et
    alert(data.message);

    // Skickar användaren hem
    window.location.href = "/";
  }
};

  if (cartItems.length === 0) {
    return <div className="container mt-5"><h4>Din varukorg är tom.</h4></div>;
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {/* VÄNSTER SIDA: FORMULÄR */}
        <div className="col-md-7">
          <form className="card p-4 shadow-sm border-0" onSubmit={handlePayment}>
            <h4 className="mb-4">1. Leveransuppgifter</h4>
            <div className="row">
              <div className="col-md-12 mb-2">
                <label className="small fw-bold">NAMN</label>
                <input className="form-control" type="text" placeholder="För- och efternamn" required />
              </div>
              <div className="col-md-12 mb-2">
                <label className="small fw-bold">ADRESS</label>
                <input className="form-control" type="text" placeholder="Gatunamn och nummer" required />
              </div>
              <div className="col-md-12 mb-4">
                <label className="small fw-bold">TELEFON (VALFRITT)</label>
                <input className="form-control" type="tel" placeholder="07x-xxx xx xx" />
              </div>
            </div>

            <h4 className="mb-3">2. Betalningsmetod</h4>
            <div className="d-flex gap-2 mb-4">
              {/* Kort */}
              <div 
                className={`p-3 border rounded text-center flex-fill ${paymentMethod === 'card' ? 'border-primary bg-light' : ''}`}
                style={{ cursor: 'pointer', transition: '0.2s' }}
                onClick={() => setPaymentMethod('card')}
              >
                <img src="https://media.istockphoto.com/id/1248729906/sv/vektor/kredit-betalkort-betalning-svart-ikon.jpg?s=612x612&w=0&k=20&c=LmZ6H1U9vetvLcw9j2uvdCZZITqYfCN5PjZoijqf3d0=" alt="kort" height="50" className="mb-1" />
                <i className="bi bi-credit-card fs-4"></i>
                <div className="small fw-bold">Kort</div>
              </div>

              {/* Swish */}
              <div 
                className={`p-3 border rounded text-center flex-fill ${paymentMethod === 'swish' ? 'border-primary bg-light' : ''}`}
                style={{ cursor: 'pointer', transition: '0.2s' }}
                onClick={() => setPaymentMethod('swish')}
              >
                <img src="https://play-lh.googleusercontent.com/NiU9oukn_XtdpjyODVezYIxeZ3Obs04bH9VZa0MAhZN4s9x5mG9O1lO_ZF37CDKck_8K" alt="Swish" height="50" className="mb-1" />
                <div className="small fw-bold">Swish</div>
              </div>

              {/* Kontant */}
              <div 
                className={`p-3 border rounded text-center flex-fill ${paymentMethod === 'cash' ? 'border-primary bg-light' : ''}`}
                style={{ cursor: 'pointer', transition: '0.2s' }}
                onClick={() => setPaymentMethod('cash')}
              >
                <img src="https://media.istockphoto.com/id/1284882634/sv/vektor/ge-pengar-disposition-ikon-betalning-med-pengar-hand-som-h%C3%A5ller-l%C3%B6necheck-ikon.jpg?s=612x612&w=0&k=20&c=oR7HTuZohoV7An0t1_KKHWx8dFGuA3wrep0LH-G52UY=" alt="cash" height="50" className="mb-1" />
                <div className="small fw-bold">Kontant</div>
              </div>
            </div>

            {/* Villkorliga fält baserat på val */}
            {paymentMethod === 'card' && (
              <div className="p-3 bg-light rounded mb-4 border">
                <input className="form-control mb-2" placeholder="Kortnummer" />
                <div className="d-flex gap-2">
                  <input className="form-control" placeholder="MM/ÅÅ" />
                  <input className="form-control" placeholder="CVC" />
                </div>
              </div>
            )}

            <button className="btn btn-success btn-lg w-100 mt-2 shadow-sm">
              Slutför köp ({totalSum} kr)
            </button>
          </form>
        </div>

        {/* HÖGER SIDA: DIN BESTÄLLNING */}
        <div className="col-md-5">
          <div className="card p-4 bg-white shadow-sm border-0">
            <h5 className="mb-4">Din beställning</h5>
            <ul className="list-group list-group-flush">
              {cartItems.map((item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <div>
                    <span className="fw-bold">{item.amount}x</span> {item.name}
                  </div>
                  <span className="text-muted">{item.price * item.amount} kr</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-4 p-3 bg-light rounded">
              <div className="d-flex justify-content-between align-items-center fw-bold fs-5">
                <span>Totalt att betala:</span>
                <span className="text-success">{totalSum} kr</span>
              </div>
              <small className="text-muted">Inklusive moms och serviceavgift</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}