import "./db.js"
import app from './app.js'
import {PORT} from './config.js'

//INDEX ARRANCA EL SERVIDOR

app.listen(PORT)
console.log(`Server running on http://locahost:${PORT}`)