const router=require("express").Router();
const db=require("../config");
const {auth,roles}=require("../middleware/auth");

router.get("/",auth,async(req,res)=>{
  const [rows]=await db.query(`SELECT v.*,d.name driver_name FROM vehicles v
    LEFT JOIN assignments a ON a.vehicle_id=v.id AND a.status='active'
    LEFT JOIN drivers d ON d.id=a.driver_id ORDER BY v.id DESC`);
  res.json(rows);
});
router.post("/",auth,roles("admin","manager"),async(req,res)=>{
  try{
    const {license_plate,model,manufacturer,year,capacity,status}=req.body;
    if(!license_plate||!model) return res.status(400).json({message:"License plate and model are required"});
    await db.query("INSERT INTO vehicles SET ?",[{license_plate,model,manufacturer,year,capacity,status}]);
    res.status(201).json({message:"Vehicle added"});
  }catch(e){res.status(400).json({message:e.code==="ER_DUP_ENTRY"?"License plate already exists":e.message});}
});
router.put("/:id",auth,roles("admin","manager"),async(req,res)=>{
  try{
    const {license_plate,model,manufacturer,year,capacity,status}=req.body;
    await db.query("UPDATE vehicles SET ? WHERE id=?",
      [{license_plate,model,manufacturer,year,capacity,status},req.params.id]);
    res.json({message:"Vehicle updated"});
  }catch(e){res.status(400).json({message:e.message});}
});
router.delete("/:id",auth,roles("admin"),async(req,res)=>{
  await db.query("DELETE FROM vehicles WHERE id=?",[req.params.id]);
  res.json({message:"Vehicle deleted"});
});
module.exports=router;