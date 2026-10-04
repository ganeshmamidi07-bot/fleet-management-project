const router=require("express").Router();
const db=require("../config");
const {auth,roles}=require("../middleware/auth");

router.get("/",auth,async(req,res)=>{
 const [rows]=await db.query(`SELECT d.*,v.license_plate vehicle_plate FROM drivers d
 LEFT JOIN assignments a ON a.driver_id=d.id AND a.status='active'
 LEFT JOIN vehicles v ON v.id=a.vehicle_id ORDER BY d.id DESC`);
 res.json(rows);
});
router.post("/",auth,roles("admin","manager"),async(req,res)=>{
 try{
  const {name,phone,email,license_number,license_expiry,status}=req.body;
  if(!name||!phone||!license_number) return res.status(400).json({message:"Name, phone and license are required"});
  await db.query("INSERT INTO drivers SET ?",[{name,phone,email,license_number,license_expiry,status}]);
  res.status(201).json({message:"Driver added"});
 }catch(e){res.status(400).json({message:e.code==="ER_DUP_ENTRY"?"License number already exists":e.message});}
});
router.put("/:id",auth,roles("admin","manager"),async(req,res)=>{
 try{
  const {name,phone,email,license_number,license_expiry,status}=req.body;
  await db.query("UPDATE drivers SET ? WHERE id=?",
   [{name,phone,email,license_number,license_expiry,status},req.params.id]);
  res.json({message:"Driver updated"});
 }catch(e){res.status(400).json({message:e.message});}
});
router.delete("/:id",auth,roles("admin"),async(req,res)=>{
 await db.query("DELETE FROM drivers WHERE id=?",[req.params.id]);
 res.json({message:"Driver deleted"});
});
module.exports=router;