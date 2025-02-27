console.log(process.env.MONGODB_URI)
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongodbtest'         
//'mongodb+srv://nicochan:12345@clustermongodbtest.sashi.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMongodbtest'
export const PORT = process.env.PORT || 8080 //localmente 8080 por railway, deploy lee PORT

console.log("PORT:", process.env.PORT);

