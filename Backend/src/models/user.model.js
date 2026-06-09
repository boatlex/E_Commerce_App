import mongoose, { Types } from "mongoose"

 const addressSchema = new mongoose.Schema({
    label:{
        type:String,
        required:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    streetAddress:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    zipCode:{
        type:Number,
        required:true,
    },
    phoneNumber:{
        type:Number,
        required:true,
    },
    isDefault:{
        type:Boolean,
        default:false,
    },
 })

const userSchema = new mongoose.Schema({
   email:{
    type:String,
    unique:true,
    required:true
   },
   name:{
    type:String,
    required:true
   },
   imageUrl:{
    type:String,
     default:"",
   },
   clerkId:{
    type:String,
    required:true,
    unique:true
   },
   addresses:[addressSchema],
   wishList:[
   { type:mongoose.Schema.Types.ObjectId,
     ref:"Product"
   }
   ],
}, {timestamps:true})

const User = mongoose.model("User", userSchema)

export default User