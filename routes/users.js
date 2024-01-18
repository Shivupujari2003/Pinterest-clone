const mongoose=require('mongoose');
const plm=require('passport-local-mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/pin") //creatng db with name pin
const userSchema=mongoose.Schema({  //creating schema/ documents
  username: String,
  name: String,
  email: String,
  password: String,
  profileImage: String,
  contact: Number,
  boards:{
    type: Array,
    default:[]
  },
  posts:[{
    type: mongoose.Schema.Types.ObjectId,  //linking post id to user
    ref:"post"
  }]
});
userSchema.plugin(plm);      // to use serialize and deserialize in app.js
module.exports=mongoose.model("user",userSchema);