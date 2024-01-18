const mongoose=require('mongoose');
const postSchema=mongoose.Schema({  
  user: {
    type:mongoose.Schema.Types.ObjectId,     //checks who is user who created post ,user info like id
    ref:"user"  //from which model "user" is the name given in users.js while exporting both should be same
},
  title: String,
  description: String,
 image:String
});
module.exports=mongoose.model("post",postSchema);