import React, { useEffect, useState } from 'react'

// URL del backend obtenida desde variables de entorno
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  // Estado para almacenar la lista de productos
  const [products, setProducts] = useState([])

  // Efecto secundario para cargar productos al montar el componente
  useEffect(() => {
    fetch(`${BACKEND_URL}/products`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error cargando productos:', error));
  }, []); // El array vacío asegura que se ejecute solo al montar el componente

  // Función para manejar el envío del formulario de nuevo producto
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Crear objeto FormData para obtener los valores del formulario
    const formData = new FormData(e.target)
    const productData = Object.fromEntries(formData)

    try {
      // Enviar solicitud POST al backend
      const res = await fetch(`${BACKEND_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      
      // Agregar nuevo producto al estado de forma optimista
      const newProduct = await res.json()
      setProducts([...products, newProduct])
      
      // Resetear el formulario después de enviar
      e.target.reset()
    } catch (error) {
      console.error('Error agregando producto:', error)
    }
  }

  // Función para eliminar un producto
  const handleDelete = async (productId) => {
    try {
      // Enviar solicitud DELETE al backend
      const response = await fetch(`${BACKEND_URL}/products/${productId}`, {
        method: 'DELETE'
      })
      
      // Si la respuesta es exitosa, actualizar el estado
      if (response.ok) {
        // Filtrar los productos eliminando el correspondiente
        setProducts(products.filter(product => product._id !== productId))
      } else {
        console.error('Error eliminando producto:', response.statusText)
      }
    } catch (error) {
      console.error('Error de red:', error)
    }
  }

  return (
    <div className="app-container">
      {/* Encabezado principal de la aplicación */}
      <header className="app-header">
        <h1>Catálogo de Productos</h1>
      </header>

      {/* Sección del formulario de agregar productos */}
      <section className="form-section">
        <form onSubmit={handleSubmit} className="product-form">
          {/* Grupo de entrada para el nombre del producto */}
          <div className="form-group">
            <label htmlFor="name">Nombre del producto:</label>
            <input 
              type="text" 
              id="name"
              name="name"
              placeholder="Ej: Laptop Gamer"
              required
            />
          </div>
          
          {/* Grupo de entrada para el precio */}
          <div className="form-group">
            <label htmlFor="price">Precio:</label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Ej: 999.99"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Grupo de entrada para la descripción */}
          <div className="form-group">
            <label htmlFor="description">Descripción:</label>
            <textarea
              id="description"
              name="description"
              placeholder="Descripción detallada del producto..."
              rows="3"
              required
            />
          </div>

          {/* Botón de envío del formulario */}
          <button type="submit" className="submit-btn">
            Agregar Producto
          </button>
        </form>
      </section>

      {/* Sección de listado de productos */}
      <section className="products-section">
        <div className="product-grid">
          {products.map((product) => (
            // Tarjeta individual para cada producto
            <article key={product._id} className="product-card">
              {/* Encabezado de la tarjeta con botón de eliminar */}
              <div className="card-header">
                <h2>{product.name}</h2>
                {/* Botón para eliminar el producto */}
                <button 
                  onClick={() => handleDelete(product._id)}
                  className="delete-btn"
                  aria-label="Eliminar producto"
                >
                  × {/* Símbolo de multiplicación como icono */}
                </button>
              </div>
              
              {/* Detalles del producto */}
              <div className="product-details">
                <p className="product-price">${product.price.toFixed(2)}</p>
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