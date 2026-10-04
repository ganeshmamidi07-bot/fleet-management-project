const router=require("express").Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const db=require("../config");

router.post("/login",async(req,res)=>{
  try{
    const {email,password}=req.body;
    const [rows]=await db.query("SELECT * FROM users WHERE email=?",[email]);
    if(!rows.length || !(await bcrypt.compare(password,rows[0].password)))
      return res.status(401).json({message:"Invalid email or password"});
    const u=rows[0];
    const token=jwt.sign({id:u.id,name:u.name,email:u.email,role:u.role},process.env.JWT_SECRET,{expiresIn:"8h"});
    res.json({token,user:{id:u.id,name:u.name,email:u.email,role:u.role}});
  }catch(e){res.status(500).json({message:e.message});}
});
module.exports=router;