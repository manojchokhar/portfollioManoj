var express=require("express")
var route=express.Router()
var exe=require("./connection")
var url=require("url");

route.get("/",async function (req,res){
    var admin_info =await exe(`SELECT * FROM admin_data`);
    var about_info =await exe(`SELECT * FROM about_data`);
    var project_info =await exe(`SELECT * FROM project_data`);
    var certificate_details =await exe(`SELECT * FROM certificate_data`)
    var social_info = await exe(`SELECT * FROM admin_social`);



    var obj ={"admin_info":admin_info[0],"about_info":about_info[0],"project_info":project_info,"certificate_details":certificate_details,'social_info':social_info[0]}
    res.render("user/home.ejs",obj)
});

route.post("/save_contact", async (req,res)=>{
    var d = req.body;
    var sql =`INSERT INTO contact_custdata (contact_name,contact_email,contact_subject,contact_desc) VALUES ('${d.contact_name}','${d.contact_email}','${d.contact_subject}','${d.contact_desc}')`;
    var data = await exe(sql)
    // res.send(data)
    res.redirect("/");
})

module.exports= route;
