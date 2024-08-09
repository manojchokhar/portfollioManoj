var express=require("express")
var exe=require("./connection")
var route=express.Router()

route.get("/",async function(req,res){
    res.render("login/login.ejs")
})
route.post("/admin_login",async function(req,res){
    var d = req.body;
    var sql=`SELECT * from admin_logdata WHERE admin_email="${d.admin_email}" AND admin_password="${d.admin_password}"`;
    var data=await exe(sql)
    if(data.length>0){
        req.session["admin_id"]=data[0].admin_id;
        res.redirect("/admin/")
    }
    else{
        res.redirect("/login")
    }
})


module.exports=route;