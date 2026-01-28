// backend/app.js
import express from 'express'
import Product from './models/product.model.js'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

// CORS
app.use(cors({
    origin: [
        'https://frontend-production-d2b9.up.railway.app',
        'http://localhost:5173'
    ],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
}))

// ✅ SOLUCIÓN: Aumentar el límite y agregar configuración adicional
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Middleware para logging (debugging)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body)
    next()
})

// GET todos los productos
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        console.error('Error al obtener productos:', error)
        res.status(500).json({ 
            message: 'Error al obtener los productos',
            error: error.message 
        })
    }
})

// POST crear producto
app.post('/products', async (req, res) => {
    try {
        console.log('📦 Body recibido:', req.body)
        console.log('📦 Headers:', req.headers)
        
        const { name, price, description } = req.body
        
        // Validación
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'El nombre es obligatorio' })
        }
        
        if (!price && price !== 0) {
            return res.status(400).json({ message: 'El precio es obligatorio' })
        }
        
        if (!description || description.trim() === '') {
            return res.status(400).json({ message: 'La descripción es obligatoria' })
        }
        
        // Convertir y validar precio
        const priceNumber = parseFloat(price)
        
        if (isNaN(priceNumber)) {
            return res.status(400).json({ 
                message: 'El precio debe ser un número válido',
                recibido: { price, tipo: typeof price }
            })
        }
        
        if (priceNumber < 0) {
            return res.status(400).json({ message: 'El precio no puede ser negativo' })
        }
        
        console.log('✅ Creando producto con:', { 
            name: name.trim(), 
            price: priceNumber, 
            description: description.trim() 
        })
        
        // Crear producto
        const newProduct = await Product.create({ 
            name: name.trim(), 
            price: priceNumber,
            description: description.trim()
        })
        
        console.log('✅ Producto creado exitosamente:', newProduct)
        
        res.status(201).json(newProduct)
        
    } catch (error) {
        console.error('❌ Error completo:', error)
        res.status(500).json({ 
            message: 'Error al crear el producto',
            error: error.message,
            detalles: error.toString()
        })
    }
})

// DELETE producto
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deletedProduct = await Product.findByIdAndDelete(id)
        
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }
        
        res.status(200).json({ 
            message: 'Producto eliminado correctamente',
            deletedProduct 
        })
    } catch (error) {
        console.error('Error al eliminar:', error)
        res.status(500).json({ 
            message: 'Error al eliminar el producto',
            error: error.message 
        })
    }
})

// PUT actualizar producto
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { name, price, description } = req.body
        
        // Validación
        if (!name || !price || !description) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' })
        }
        
        const priceNumber = parseFloat(price)
        
        if (isNaN(priceNumber)) {
            return res.status(400).json({ message: 'El precio debe ser un número válido' })
        }
        
        // Actualizar
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { 
                name: name.trim(), 
                price: priceNumber,
                description: description.trim()
            },
            { new: true, runValidators: true }
        )
        
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }
        
        res.status(200).json({
            message: 'Producto actualizado correctamente',
            updatedProduct
        })
    } catch (error) {
        console.error('Error al actualizar:', error)
        res.status(500).json({
            message: 'Error al actualizar el producto',
            error: error.message
        })
    }
})

// Ruta de salud para verificar que el servidor funciona
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        mongodb: 'connected'
    })
})

export default app