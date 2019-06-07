const Sequelize=require('sequelize');
const connection=new Sequelize('webtravelagency', 'root', 'root', {
    host:'localhost',
    dialect:'mysql',
    operatorAliases:'false',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },

})
connection.authenticate()
    .then(() => console.log('connection has been established succefully.'))
    .catch ( err => console.error('unable to connect to data base', err));
module.exports=connection;