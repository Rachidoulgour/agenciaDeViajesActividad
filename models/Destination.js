const connection=require('../config/sequelize');
const Sequelize=require('sequelize');
const Destination=connection.define('destination',{
    destination : Sequelize.STRING,
    imagePath: Sequelize.STRING,
    // price : Sequelize.NUMBER,
    // discount: Sequelize.NUMBER,
})
Destination.sync({
    logging:console.log
}).then(()=>{
    console.log('destination model syncronized')
}).catch(err=>console.log("Error al sincrozizar:"+err))

module.exports=Destination; 