const UserD = require("../models/userModel")

exports.createUser = async(req,res,next)=>{
    try{
        const user = await UserD.create(req.body);
        
        res.status(200).json({
            status :"success",
            data:{
                user
            }
        })
    }catch(e){
        res.status(400).json({
           status:"Failed to create task"
        })
    }
}

exports.getAllUsers = async(req,res,next)=>{
    try{
        const userList = await UserD.find();
        res.status(200).json({
            status :"success",
            count : userList.length,
            data:{
                userList
            }
        })
    }catch(e){
        res.status(400).json({
            status:"Failed to get all task"
        })
    }
}

exports.getOneUser = async(req,res,next)=>{
    try{
        const user = await UserD.findById(req.params.id);
        res.status(200).json({
            status :"success",
            data:{
                user
            }
        })
    }catch(e){
        res.status(400).json({
            status:"Failed to get task"
        });
    }
}
