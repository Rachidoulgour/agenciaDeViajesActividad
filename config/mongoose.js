var mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost:27017/WebTravelAgency_dev`,{
        useCreateIndex: true, useNewUrlParser: true })
.then(() => console.log(`Connected to database mongodb://localhost:27017/WebTravelAgency_dev`))
.catch((e) => console.log('Connection to MongoDB failed!:( \n' + e))
module.exports=mongoose;