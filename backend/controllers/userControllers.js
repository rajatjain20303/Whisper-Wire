const asyncHandler=require("express-async-handler")
const User= require("../models/usermodel")
const generatetoken= require("../CONFIG/generatetoken")

const registerUser=asyncHandler(async(req,res)=>{
    const{name,email,password,picture}=req.body;
    if(!name|| !password|| !email){
        res.status(400);
        throw new Error("Please fill all fields"); 
    }
    const userExist=await User.findOne({email})
    if(userExist)
    {
        res.status(400)
        throw new Error("User already exists"); 
    }
    const user= await User.create({
        name,email,password,picture,
    });
    if(user)
    {
        res.status(201).json({
            _id: user._id,
            name:user.name,
            email: user.email,
            pic: user.pic,
            token:generatetoken(user._id)
        })
    }
    else
    {
        res.status(400)
        throw new Error("Failed to create user")
    }
})

const authUser=asyncHandler(async(req,res)=>{
    const{ email,password}=req.body;
    const user=await User.findOne({email});

    if(user&&(await user.matchpassword(password)))
    {
        res.json({
            _id: user._id,
            name:user.name,
            email: user.email,
            pic: user.pic,
            token:generatetoken(user._id)
        })
    }
})

const allUsers=asyncHandler(async(req,res)=>{
    const keyword=req.query.search?{
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
    }:{};

    const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
    res.send(users)
    // console.log(keyword)

})

module.exports={registerUser,authUser,allUsers}