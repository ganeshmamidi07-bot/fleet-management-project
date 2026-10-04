const router=require("express").Router();
const db=require("../config");
const {auth,roles}=require("../middleware/auth");

router.get("/",auth,async(req,res)=>{
 const [rows]=await db.query(`SELECT a.*,v.license_plate,d.name driver_name
 FROM assignments a JOIN vehicles v ON v.id=a.vehicle_id JOIN drivers d ON d.id=a.driver_id
 WHERE a.status='active' ORDER BY a.assigned_at DESC`);
 res.json(rows);
});
router.post("/",auth,roles("admin","manager"),async(req,res)=>{
 const {vehicle_id,driver_id}=req.body;
 if(!vehicle_id||!driver_id) return res.status(400).json({message:"Vehicle and driver are required"});
 const conn=await db.getConnection();
 try{
  await conn.beginTransaction();
  await conn.query("UPDATE assignments SET status='ended' WHERE vehicle_id=? AND status='active'",[vehicle_id]);
  await conn.query("UPDATE assignments SET status='ended' WHERE driver_id=? AND status='active'",[driver_id]);
  await conn.query("INSERT INTO assignments(vehicle_id,driver_id) VALUES(?,?)",[vehicle_id,driver_id]);
  await conn.commit(); res.status(201).json({message:"Assignment created"});
 }catch(e){await conn.rollback();res.status(500).json({message:e.message});}
 finally{conn.release();}
});
router.delete("/:id",auth,roles("admin","manager"),async(req,res)=>{
 await db.query("UPDATE assignments SET status='ended' WHERE id=?",[req.params.id]);
 res.json({message:"Assignment ended"});
});
module.exports=router;