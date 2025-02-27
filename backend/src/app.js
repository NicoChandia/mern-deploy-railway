import express from 'express'
import Product from './models/product.model.js'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config() // Cargar variables de entorno

// Inicializar aplicación Express
const app = express()

// Configurar CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin:[
        'https://frontend-production-d2b9.up.railway.app', // Producción
        'http://localhost:5173' // Desarrollo frontend
      ],  // URL de tu frontend en producción
    methods: 'GET,POST,PUT,DELETE', // Métodos HTTP permitidos
    allowedHeaders: 'Content-Type,Authorization' // Cabeceras permitidas
}))

// Middleware para parsear JSON en las solicitudes
app.use(express.json())

// Ruta GET para obtener todos los productos
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find() // Obtener todos los productos de MongoDB
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener los productos',
            error: error.message 
        })
    }
})

// Ruta POST para crear un nuevo producto
app.post('/products', async (req, res) => {
    try {
        const { name, price, description } = req.body
        
        // Validar datos recibidos
        if (!name || !price || !description) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' })
        }
        
        // Crear nuevo producto en la base de datos
        const newProduct = await Product.create({ 
            name, 
            price: parseFloat(price), // Asegurar tipo numérico
            description 
        })
        
        res.status(201).json(newProduct)
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al crear el producto',
            error: error.message 
        })
    }
})

// Ruta DELETE para eliminar un producto por ID
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params
        
        // Buscar y eliminar el producto por ID
        const deletedProduct = await Product.findByIdAndDelete(id)
        
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }
        
        res.status(200).json({ 
            message: 'Producto eliminado correctamente',
            deletedProduct 
        })
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al eliminar el producto',
            error: error.message 
        })
    }
})

export default app