const jwt = require("jsonwebtoken");

function auth(req,res,next){
  const token=(req.headers.authorization||"").replace("Bearer ","");
  if(!token) return res.status(401).json({message:"Login required"});
  try { req.user=jwt.verify(token,process.env.JWT_SECRET); next(); }
  catch(e){ return res.status(401).json({message:"Invalid or expired token"}); }
}
function roles(...allowed){
  return (req,res,next)=>allowed.includes(req.user.role)
    ? next() : res.status(403).json({message:"Access denied"});
}
module.exports={auth,roles};