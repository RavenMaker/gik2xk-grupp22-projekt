import React, { useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    category: 'Pizzor' // Standardval matchar din nya kolumn i backend
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Anropar din Sequelize-backend på port 5000
    axios.post('http://localhost:5000/api/products', product)
      .then(res => {
        setMessage('Produkten skapad med lyckat resultat!');
        // Tömmer formuläret efter lyckad sparning
        setProduct({ title: '', description: '', price: '', image_url: '', category: 'Pizzor' });
      })
      .catch(err => {
        setMessage('Ett fel uppstod: ' + err.message);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin - Lägg till produkt</h2>
      {message && <div className="alert alert-info">{message}</div>}
      
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Namn på maträtt</label>
          <input type="text" name="title" className="form-control" value={product.title} onChange={handleChange} required />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Beskrivning</label>
          <textarea name="description" className="form-control" value={product.description} onChange={handleChange} />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Pris (kr)</label>
            <input type="number" name="price" className="form-control" value={product.price} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Kategori</label>
            <select name="category" className="form-select" value={product.category} onChange={handleChange}>
              <option value="Pizzor">Pizzor</option>
              <option value="Hamburgare">Hamburgare</option>
              <option value="Kebabrätter">Kebabrätter</option>
              <option value="Våra drycker">Dryck</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Bild-URL (länk till bild)</label>
          <input type="text" name="image_url" className="form-control" value={product.image_url} onChange={handleChange} placeholder="https://..." />
        </div>

        <button type="submit" className="btn btn-primary w-100 fw-bold">Spara produkt</button>
      </form>
    </div>
  );
};

export default Admin;