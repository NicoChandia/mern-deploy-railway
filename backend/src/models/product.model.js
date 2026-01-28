// backend/src/models/product.model.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [100, 'El nombre no puede exceder los 100 caracteres'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0.01, 'El precio debe ser mayor a 0'],
        // ✅ Setter simplificado y seguro
        get: v => v ? Math.round(v * 100) / 100 : v,
        set: v => v ? Math.round(parseFloat(v) * 100) / 100 : v
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
        maxlength: [500, 'La descripción no puede exceder los 500 caracteres'],
        trim: true
    }
}, { 
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

export default mongoose.model('Product', productSchema);