import React, { useEffect, useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/products`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error cargando productos:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // 1. Aseguramos que los datos extraídos del form sean del tipo correcto
    const productData = {
      name: formData.get('name'),
      price: parseFloat(formData.get('price')),
      description: formData.get('description')
    };

    try {
      if (editingProduct) {
        const response = await fetch(`${BACKEND_URL}/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        
        const updatedProduct = await response.json();
        setProducts(products.map(p => p._id === editingProduct._id ? updatedProduct : p));
        setEditingProduct(null);
      } else {
        const response = await fetch(`${BACKEND_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
      }
      e.target.reset();
    } catch (error) {
      console.error('Error en la operación:', error);
    }
  };

  // 2. FUNCIÓN CORREGIDA: Ya no usamos document.getElementById
  const handleEdit = (product) => {
    setEditingProduct(product);
  }

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/products/${productId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setProducts(products.filter(product => product._id !== productId))
      }
    } catch (error) {
      console.error('Error de red:', error)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Catálogo de Productos</h1>
      </header>

      <section className="form-section">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Nombre del producto:</label>
            {/* 3. INPUT CORREGIDO: key y defaultValue vinculados al estado */}
            <input 
              key={editingProduct ? `edit-name-${editingProduct._id}` : 'new-name'}
              type="text" 
              id="name"
              name="name"
              defaultValue={editingProduct ? editingProduct.name : ''}
              placeholder="Ej: Laptop Gamer"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Precio:</label>
            <input
              key={editingProduct ? `edit-price-${editingProduct._id}` : 'new-price'}
              type="number"
              id="price"
              name="price"
              defaultValue={editingProduct ? editingProduct.price : ''}
              placeholder="Ej: 999.99"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción:</label>
            <textarea
              key={editingProduct ? `edit-desc-${editingProduct._id}` : 'new-desc'}
              id="description"
              name="description"
              defaultValue={editingProduct ? editingProduct.description : ''}
              placeholder="Descripción detallada del producto..."
              rows="3"
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
            </button>
            {editingProduct && (
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setEditingProduct(null)}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="products-section">
        <div className="product-grid">
          {products.map((product) => (
            <article key={product._id} className="product-card">
              <div className="card-header">
                <h2>{product.name}</h2>
                <div className="card-actions">
                  <button onClick={() => handleEdit(product)} className="edit-btn">✏️</button>
                  <button onClick={() => handleDelete(product._id)} className="delete-btn">×</button>
                </div>
              </div>
              <div className="product-details">
                <p className="product-price">
                  ${Number(product.price ?? 0).toFixed(2)}
                </p>
                <p className="product-description">{product.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App