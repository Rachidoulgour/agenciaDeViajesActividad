const mongoose=require('mongoose');
const SALT=10;
const bcrypt=require('bcrypt')
const {isEmail}= require('validator')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxlength:40
    },
    lastname:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate: function ( email ) {
            return new Promise( function ( resolve ) {
                setTimeout( function () {
                    resolve( isEmail( email ) );
                }, 5 );
           } );
        },
        
    },
    username:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
        minlength:8,
        required:true
    },
    confirmedEmail:Boolean,
});
userSchema.methods.ToJSON = function (){
    const { _id, name, lastname, username, email, token } = this;
    return { _id, name, lastname, username, email, token };
};
userSchema.pre('save',function(next){
    const user=this;
    if(user.isModified('password')){
        bcrypt.genSalt(SALT).then(salt=>bcrypt.hash(user.password,salt))
        .then(hash=>{
            user.password=hash;
            return next()
        })
        .catch(err => next(err)).catch(err => next(err))
        
    }
    else next();
});
userSchema.methods.generateAuthTonken = function(){
const user =this
const token = jwt.sign({_id:user._id}, SECRET_AUTH_JWT)
return token;
}
const userModel= mongoose.model('User',userSchema);
module.exports=userModel;