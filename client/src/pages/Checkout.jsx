import { useState, useEffect } from 'react';
import { API } from '../utils/api';
import DeliveryForm from '../components/DeliveryForm';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import CardFields from '../components/CardFields';
import SwishFields from '../components/SwishFields';
import OrderSummary from '../components/OrderSummary';
 
export default function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('card');
 
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
            // userId=1 är gästanvändaren (ingen inloggning implementerad)
            body: JSON.stringify({ userId: 1, items: cartItems })
        });
 
        if (res.ok) {
            const data = await res.json();
            localStorage.removeItem('guestCart');
            alert(data.message);
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
                        <DeliveryForm />
                        <PaymentMethodSelector
                            selected={paymentMethod}
                            onSelect={setPaymentMethod}
                        />
                        {paymentMethod === 'card' && <CardFields />}
                        {paymentMethod === 'swish' && <SwishFields />}
                        <button className="btn btn-success btn-lg w-100 mt-2 shadow-sm">
                            Slutför köp ({totalSum} kr)
                        </button>
                    </form>
                </div>
 
                {/* HÖGER SIDA: DIN BESTÄLLNING */}
                <div className="col-md-5">
                    <OrderSummary cartItems={cartItems} totalSum={totalSum} />
                </div>
            </div>
        </div>
    );
}