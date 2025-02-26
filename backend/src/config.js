console.log(process.env.MONGODB_URI)
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongodbtest'//'mongodb+srv://nicochan:12345@clustermongodbtest.sashi.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMongodbtest'

export const PORT = process.env.PORT || 3000 //localmente 3000, deploy lee PORT
