import React, { useEffect, useState } from 'react'


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() { //crear rapido rfce mas TAB

  const [products, setProducts] = useState([])



  useEffect(()=>{ //se utiliza cuando se carga la app
    fetch(`${BACKEND_URL}/products`)
    .then(response => response.json())
    .then(data => {
      setProducts(data); //establezco los productos dentro del arreglo de productos
    }); 
  }, []);

  return <div>

    <h1>PRODUCTOS</h1>
    {/*FORMULARIO DE PRODUCTOS*/ }

    <form
    onSubmit={async(evento) => { //si se ejecuta el boton de agregar producto, llega el evento por el submit
      evento.preventDefault()

      const name = evento.target[0].value
      const price = evento.target[1].value
      const description =evento.target[2].value

      {/*Envio de formulario a la base de datos*/ }
      const res = await fetch(`${BACKEND_URL}/products`, {
        method: 'POST',
        headers:{ /*Le decimos que es un dato de tipo json*/ 
          'Content-Type': 'application/json'

        },
        body:JSON.stringify({
          name,
          price,
          description
        })
      })
      const data = await res.json()
      //console.log(data)
      setProducts([...products, data]) //refresco los productos y guardo el ultimo

    }}
    >
      <input type="text" placeholder="Nombre del producto" />
      <input type="number" placeholder="Precio del producto" />
      <input type="text" placeholder="Descripcion del producto" />
      <button type="submit">Agregar producto</button> {/*typeSubmit para que ejecute el formulario*/}
    </form>

    {/*LISTA DE PRODUCTOS*/ }
      {
        products.map((product) => {
          return <div key={product._id} 
            style={{ //Le doy estilos 
              border: '1px solid white',
              padding: '10px',
              margin: '10px',
              width: '50%',
              display: "inline-block"
              
            }} 
          > 
            
            <h2>{product.name}</h2>
            <p>{product.price}</p>
            <p>{product.description}</p>
          </div>
        })
      }
    </div>
  
}

export default App;