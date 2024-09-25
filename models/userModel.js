const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    userName:{
        type:String,
        required:[true,"User name is required"]
    },
    userEmail:{
        type:String,
        required:[true,"User Email is required"]
    },
    userPassword:{
        type:String,
        required:[true,"User password is required"]
    }
});

//Encrypting the password before Saving the user
userSchema.pre("save",async function (next){
    if(this.isModified("userPassword")||this.isNew){
        const salt = await bcrypt.genSalt(10);//Salt Generation
        this.userPassword = await bcrypt.hash(this.userPassword,salt);
    }
    next();
});

const UserD = mongoose.model("UserDetails",userSchema);
module.exports=UserD;