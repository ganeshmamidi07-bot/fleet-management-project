require("dotenv").config();
const express=require("express");
const cors=require("cors");
const path=require("path");
const bcrypt=require("bcryptjs");
const db=require("./config");

const app=express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"../frontend")));

app.use("/api/auth",require("./routes/auth"));
app.use("/api/vehicles",require("./routes/vehicles"));
app.use("/api/drivers",require("./routes/drivers"));
app.use("/api/assignments",require("./routes/assignments"));

app.get("/api/dashboard",require("./middleware/auth").auth,async(req,res)=>{
 const [[v]]=await db.query("SELECT COUNT(*) total, SUM(status='active') active, SUM(status='maintenance') maintenance, SUM(status='inactive') inactive FROM vehicles");
 const [[d]]=await db.query("SELECT COUNT(*) total, SUM(status='active') active FROM drivers");
 const [[a]]=await db.query("SELECT COUNT(*) total FROM assignments WHERE status='active'");
 const [[u]]=await db.query(`SELECT COUNT(*) total FROM drivers d WHERE d.status='active'
 AND NOT EXISTS(SELECT 1 FROM assignments a WHERE a.driver_id=d.id AND a.status='active')`);
 res.json({vehicles:v,drivers:d,assignments:a.total,unassignedDrivers:u.total});
});

app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"../frontend/index.html")));
const PORT=process.env.PORT||5000;
app.listen(PORT,async()=>{
 console.log(`Fleet Management running at http://localhost:${PORT}`);
 try{
  const hash=await bcrypt.hash("Admin@123",10);
  await db.query(`INSERT IGNORE INTO users(name,email,password,role) VALUES
  ('Administrator','admin@fleet.com',?,'admin')`,[hash]);
  console.log("Default login: admin@fleet.com / Admin@123");
 }catch(e){console.log("Database not ready:",e.message);}
});