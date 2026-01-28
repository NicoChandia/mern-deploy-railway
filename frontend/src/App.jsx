import React, { useEffect, useState } from 'react'

// URL del backend obtenida desde variables de entorno
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  // Estado para almacenar la lista de productos
  const [products, setProducts] = useState([])
  // Estado para manejar el producto en edición
  const [editingProduct, setEditingProduct] = useState(null)

  // Efecto secundario para cargar productos al montar el componente
  useEffect(() => {
    fetchProducts()
  }, []) // El array vacío asegura que se ejecute solo al montar el componente

  // Función reusable para obtener productos
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/products`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error cargando productos:', error)
    }
  }

  // Función para manejar el envío del formulario (creación y actualización)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const productData = Object.fromEntries(formData)
    
    try {
      if (editingProduct) {
        // Lógica para actualizar producto existente
        const response = await fetch(`${BACKEND_URL}/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...productData,
            price: parseFloat(productData.price) // Asegurar tipo numérico
          })
        })
        const updatedProduct = await response.json()
        // Actualizar lista de productos con el producto modificado
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p))
        setEditingProduct(null) // Limpiar estado de edición
      } else {
        // Lógica para crear nuevo producto
        const response = await fetch(`${BACKEND_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
        const newProduct = await response.json()
        setProducts([...products, newProduct]) // Agregar nuevo producto al estado
      }
      e.target.reset() // Resetear formulario después de la operación
    } catch (error) {
      console.error('Error en la operación:', error)
    }
  }

  // Función para manejar la edición de un producto
  const handleEdit = (product) => {
    setEditingProduct(product) // Establecer producto a editar
    // Rellenar formulario con los datos del producto
    document.getElementById('name').value = product.name
    document.getElementById('price').value = product.price
    document.getElementById('description').value = product.description
  }

  // Función para eliminar un producto
  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/products/${productId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Filtrar productos removiendo el eliminado
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

      {/* Sección del formulario de agregar/editar productos */}
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

          {/* Contenedor de botones del formulario */}
          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
            </button>
            {/* Mostrar botón de cancelar solo en modo edición */}
            {editingProduct && (
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setEditingProduct(null) // Limpiar estado de edición
                  document.querySelector('form').reset() // Resetear formulario
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Sección de listado de productos */}
      <section className="products-section">
        <div className="product-grid">
          {products.map((product) => (
            // Tarjeta individual para cada producto
            <article key={product._id} className="product-card">
              <div className="card-header">
                <h2>{product.name}</h2>
                {/* Contenedor de acciones de la tarjeta */}
                <div className="card-actions">
                  {/* Botón de editar producto */}
                  <button 
                    onClick={() => handleEdit(product)}
                    className="edit-btn"
                    aria-label="Editar producto"
                  >
                    ✏️
                  </button>
                  {/* Botón de eliminar producto */}
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="delete-btn"
                    aria-label="Eliminar producto"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              {/* Detalles del producto */}
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