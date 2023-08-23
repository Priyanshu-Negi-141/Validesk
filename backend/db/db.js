require('dotenv').config()
const mongoose = require("mongoose");
const mongoDBURL = process.env.MONGO_URL

// Connect to DB
const connectToMongo = mongoose.connect(mongoDBURL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
})
.then(() => {
    console.log(`MongoDB Connected at ${mongoDBURL}`)
    })
.catch((err) => {
    throw new Error('Could not connect to MongoDB')
    });
      


module.exports = async () => await connectToMongo;