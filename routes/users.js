var express = require('express');
var router = express.Router();
var bcrypt=require('bcrypt');
const UserModel=require('../models/user');
const transporter=require('../config/nodemailer')
const jwt = require( 'jsonwebtoken' );
const SECRET_JWT = require( '../config/password' ).SECRET_JWT;
const uploadPics=require('../config/multer');

/* GET users listing. */


router.post('/signup', function(req,res, next){
  
  new UserModel({
    ...req.body,
    confirmedEmail:false
  }).save()
  .then(user=>{
    const token=jwt.sign({_id: user._id},SECRET_JWT, { expiresIn: "48h"})
    const url = `http://localhost:3000/users/activacion/${token}`
  transporter.sendMail({
    from:"bootcampstream@gmail.com",
    to:user.email,
    subject:"Active su cuenta en nuestra web de viajes",
    html:`
    <h1>Bienvenido a nuestra página de viajes</h1>
    <p>Porfavor, active su cuenta clicando el siguiente lik:
      <a href="${url}">
        click aquí para activar tu cuenta
      </a>
    </p>
    `
    });
    res.status(201).send("Usuario regitrsado, cofirme su dirección")
  })
  .catch(console.log)
});
router.get('/activacion/:jwt',(req,res)=>{
  try{
    const payload = jwt.verify( req.params.jwt, SECRET_JWT )
    UserModel.findByIdAndUpdate(payload._id,{confirmedEmail:true},{new:true})
      .then(user=> res.redirect('/'))
}catch (error){
  res.status(400).send(error)
  }
})
router.post( '/login', ( req, res ) => {

  UserModel.findOne( {
          $or: [ // checks if either the username or the email are in the database
              { username: req.body.usernameEmail }, 
              { email: req.body.usernameEmail }
          ]

      } )
      .then( user => {
          if ( !user ) return res.status( 400 ).send( 'Wrong credentials' ); // if the user/email does not exist in the db responds with this message
          if ( user.confirmedEmail === false ) return res.status( 400 ).send( 'You have to verify your email' ); //if the user exist but the email is not confirmed yet. It responds with this message.

          bcrypt.compare( req.body.password, user.password ).then( isMatch => { //the first argument is the plain text password entered by the user, the second argument is the password hash in the db.
              if ( !isMatch ) return res.status( 400 ).send( 'Wrong credentials' ); //if there is no match between the password entered by the user and the one in the db it responds with "Wrong Credentials"
              const token=user.generateAuthToken(); //calls the method generateAuthToken from the UserModel
              user['token']=token; //here we create a user property which is going to contain the generated token

              res.json( user ); // if both the username/email and the password are correct, it responds with the user as a json.

          } )

      } )

} )
router.post('/recovery',(req,res)=>{
  console.log(req.body.email)
  const token=jwt.sign({email: req.body.email},SECRET_JWT, { expiresIn: "48h"})
    const url = `http://localhost:3000/users/resetPassword1/${token}`
  transporter.sendMail({
    from:"bootcampstream@gmail.com",
    to:req.body.email,
    subject:"Recover your password",
    html:`
    <h1>Recover your password following the instructions bellow</h1>
    <p>Please, click the following link to reset your password:
      <a href="${url}">
        click aquí para activar tu cuenta
      </a>
      <span>This link will expire in 48 hours.</span>
    </p>
    `
    }).then(()=>res.render(''))
    .catch(console.log)
});
router.get('/resetPassword1/:jwt',(req,res)=>{
  res.render('resetPassword')
})
router.post('/resetPassword2',(req,res)=>{
 // req.headers.referer //aquí viene la url anterior
 console.log(req.headers.referer.split('resetPassword/'))
 const email=jwt.verify(token,SECRET_JWT)
 UserModel.findOne({email}).then(user=>{

 const password= bcrypt.hash(req.body.password,10)
  UserModel.findOneAndUpdate({email},{password}).then(user=>{
    res.redirect('/login')
  })
 })
})
router.post('/uploadImage', uploadPics.single('avatar'),(req,res)=>{
  console.log(req.file.fieldname)
  res.send('hola')
})


module.exports = router;
