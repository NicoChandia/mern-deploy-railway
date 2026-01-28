import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'], // Mensaje personalizado
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'], // Longitud mínima
        maxlength: [100, 'El nombre no puede exceder los 100 caracteres'], // Longitud máxima
        trim: true // Elimina espacios al inicio y final
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0.01, 'El precio debe ser mayor a 0'], // Valor mínimo
        set: value => Math.round(parseFloat(value) * 100) / 100 // Redondea a 2 decimales, mantiene numero
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria'], // Ahora es requerida
        minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
        maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
    }
}, { 
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

export default mongoose.model('Product', productSchema);