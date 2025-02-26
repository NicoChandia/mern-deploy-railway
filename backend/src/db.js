import mongoose from 'mongoose'
import {MONGODB_URI } from './config.js'

mongoose.connect(MONGODB_URI) //viene de la creacion en mongodbatlas mas el cluster
    .then((db) => console.log('DB is connected'));