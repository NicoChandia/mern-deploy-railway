// backend/src/index.js
import mongoose from 'mongoose'
import app from './app.js'
import { PORT, MONGODB_URI } from './config.js'

// Conectar a MongoDB primero
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ DB is connected')
        
        // Iniciar servidor solo después de conectar a DB
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`)
        })
    })
    .catch((error) => {
        console.error('❌ Error connecting to MongoDB:', error)
        process.exit(1)
    })