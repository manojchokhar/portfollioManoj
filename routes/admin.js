var express=require("express")
var route=express.Router()
var exe=require("./connection")
var url=require("url");

function checkAdminLogin(req, res, next) {
    if (req.session.admin_id === undefined) {
        res.redirect("/login");
    } else {
        next();
    }
}


route.get("/admin_logout", async (req,res)=>{
    if(req.session){
        req.session.admin_id = undefined
        res.redirect("/login")
    }
})


route.get("/",checkAdminLogin, async function(req,res){
    var admin_info =await exe(`SELECT * FROM admin_data`)
    res.render("admin/home.ejs",{"admin_info":admin_info[0]})
});

route.get("/dashbord",async (req,res)=>{ 
    var admin_info =await exe(`SELECT * FROM admin_data`)   
    res.render("admin/dashbord.ejs",{"admin_info":admin_info[0]})
});

route.get("/admin_data",async (req,res)=>{
    var admin_info =await exe(`SELECT * FROM admin_data`)
    res.render("admin/admin_data.ejs",{"admin_info":admin_info[0]})
});

route.post("/save_admin_data", async (req, res) => {
    const d = req.body;
    let admin_image;

    if (req.files && req.files.admin_image) {
        admin_image = Math.random().toFixed(4) + " " + req.files.admin_image.name;
        await req.files.admin_image.mv("public/uploads/" + admin_image);
    } else {
        const [currentImageData] = await exe(`SELECT admin_image FROM admin_data WHERE admin_id ='${d.admin_id}'`);
        admin_image = currentImageData ? currentImageData.admin_image : 'default_image.jpg';
    }

    const sql = `UPDATE admin_data SET admin_image ='${admin_image}', admin_name ='${d.admin_name}', admin_skill ='${d.admin_skill}', admin_desc ='${d.admin_desc}' WHERE admin_id ='${d.admin_id}'`;
    await exe(sql);

    res.redirect("/admin/admin_data");
});


route.get("/about_data",async (req,res)=>{
    var about_info =await exe(`SELECT * FROM about_data`)
    var admin_info =await exe(`SELECT * FROM admin_data`)   
    res.render("admin/about_data.ejs",{"about_info":about_info[0],"admin_info":admin_info[0]})
});

route.post("/save_about_data", async (req, res) => {
    const d = req.body;
    let admin_resume;

    if (req.files && req.files.admin_resume) {
        admin_resume = Math.random().toFixed(4) + " " + req.files.admin_resume.name;
        await req.files.admin_resume.mv("public/uploads/" + admin_resume);
    } else {
        const [currentData] = await exe(`SELECT admin_resume FROM about_data WHERE about_id ='${d.about_id}'`);
        admin_resume = currentData ? currentData.admin_resume : 'default_resume.pdf';
    }

    const sql = `UPDATE about_data SET admin_resume ='${admin_resume}', first_name ='${d.first_name}', last_name ='${d.last_name}', admin_age ='${d.admin_age}', admin_nationality ='${d.admin_nationality}', admin_freelance ='${d.admin_freelance}', admin_mobile ='${d.admin_mobile}', admin_languages ='${d.admin_languages}', admin_linkedinLink ='${d.admin_linkedinLink}', admin_address ='${d.admin_address}', admin_adress_main ='${d.admin_adress_main}', admin_exp ='${d.admin_exp}', admin_compName ='${d.admin_compName}' WHERE about_id ='${d.about_id}'`;
    await exe(sql);

    res.redirect("/admin/about_data");
});


// Projects 

route.get("/projects", async (req,res)=>{
    var project_info =await exe(`SELECT * FROM project_data`)
    var admin_info =await exe(`SELECT * FROM admin_data`)   
    res.render("admin/projects.ejs",{"project_info":project_info,"admin_info":admin_info[0]})
})

route.post("/save_projects", async (req, res) => {
    const d = req.body;
    let project_image;

    if (req.files && req.files.project_image) {
        project_image = Math.random().toFixed(4) + " " + req.files.project_image.name;
        await req.files.project_image.mv("public/uploads/" + project_image);
    } else {
        project_image = 'default_project_image.jpg';
    }

    const sql = `INSERT INTO project_data (project_name, project_image, project_role, client_name, project_technology, project_duration, project_desc) VALUES ('${d.project_name}', '${project_image}', '${d.project_role}', '${d.client_name}', '${d.project_technology}', '${d.project_duration}', '${d.project_desc}')`;
    await exe(sql);

    res.redirect("/admin/projects");
});


route.get("/edit_projects/:id", async (req,res)=>{
    var id = req.params.id;
    var project_info =await exe(`SELECT * FROM project_data WHERE project_id ='${id}'`)
    var admin_info =await exe(`SELECT * FROM admin_data`)   
    res.render("admin/edit_projects.ejs",{"project_info":project_info,"admin_info":admin_info[0]})
})

route.post("/update_projects", async (req, res) => {
    const d = req.body;
    let project_image;

    if (req.files && req.files.project_image) {
        project_image = Math.random().toFixed(4) + " " + req.files.project_image.name;
        await req.files.project_image.mv("public/uploads/" + project_image);
    } else {
        const [currentData] = await exe(`SELECT project_image FROM project_data WHERE project_id ='${d.project_id}'`);
        project_image = currentData ? currentData.project_image : 'default_project_image.jpg';
    }

    const sql = `UPDATE project_data SET project_image ='${project_image}', project_name ='${d.project_name}', project_role ='${d.project_role}', client_name ='${d.client_name}', project_technology ='${d.project_technology}', project_duration ='${d.project_duration}', project_desc ='${d.project_desc}' WHERE project_id ='${d.project_id}'`;
    await exe(sql);

    res.redirect("/admin/projects");
});


route.get('/delete_project/:id', async (req,res)=>{
    var id = req.params.id;
    var sql = `DELETE FROM project_data WHERE project_id ='${id}'`;
    var data = await exe(sql)
    // res.send(data)
    res.redirect("/admin/projects")
});


// CERTIFICATE 

route.get("/certificate", async (req,res)=>{
    var certificate_details =await exe(`SELECT * FROM certificate_data`)
    var admin_info =await exe(`SELECT * FROM admin_data`)   
    res.render("admin/certificate.ejs",{"certificate_details":certificate_details,"admin_info":admin_info[0]})
});

route.post("/save_certificates", async (req, res) => {
    const d = req.body;
    let certificate_image;

    if (req.files && req.files.certificate_image) {
        certificate_image = Math.random().toFixed(4) + " " + req.files.certificate_image.name;
        await req.files.certificate_image.mv("public/uploads/" + certificate_image);
    } else {
        certificate_image = 'default_certificate_image.jpg';
    }

    const sql = `INSERT INTO certificate_data (certificate_image, certificate_title, certificate_date, certificate_desc) VALUES ('${certificate_image}', '${d.certificate_title}', '${d.certificate_date}', '${d.certificate_desc}')`;
    await exe(sql);

    res.redirect("/admin/certificate");
});


route.get("/edit_certificate/:id", async (req,res)=>{
    var id = req.params.id;
    var certificate_info =await exe(`SELECT * FROM certificate_data WHERE certificate_id ='${id}'`)
    res.render("admin/edit_certificate.ejs",{"certificate_info":certificate_info[0]})
});

route.post("/update_certificates", async (req, res) => {
    const d = req.body;
    let certificate_image;

    if (req.files && req.files.certificate_image) {
        certificate_image = Math.random().toFixed(4) + " " + req.files.certificate_image.name;
        await req.files.certificate_image.mv("public/uploads/" + certificate_image);
    } else {
        const [currentData] = await exe(`SELECT certificate_image FROM certificate_data WHERE certificate_id ='${d.certificate_id}'`);
        certificate_image = currentData ? currentData.certificate_image : 'default_certificate_image.jpg';
    }

    const sql = `UPDATE certificate_data SET certificate_image ='${certificate_image}', certificate_title ='${d.certificate_title}', certificate_date ='${d.certificate_date}', certificate_desc ='${d.certificate_desc}' WHERE certificate_id ='${d.certificate_id}'`;
    await exe(sql);

    res.redirect("/admin/certificate");
});


route.get("/delete_certificate/:id", async (req,res)=>{
    var id = req.params.id;
    var sql = `DELETE FROM certificate_data WHERE certificate_id ='${id}'`;
    var data = await exe(sql)
    // res.send(data)
    res.redirect("/admin/certificate")
});

route.get("/contact_info", async (req,res)=>{
    var contact_info =await exe(`SELECT * FROM contact_custdata`)
    var admin_info =await exe(`SELECT * FROM admin_data`) 
    res.render("admin/contact_info.ejs",{"contact_info":contact_info ,"admin_info":admin_info[0]})
});

route.get("/delete_contact/:id", async (req,res)=>{
    var id = req.params.id;
    var sql = `DELETE FROM contact_custdata WHERE contact_id ='${id}'`;
    var data = await exe(sql)
    // res.send(data)
    res.redirect("/admin/contact_info")
});

route.get("/social", async (req, res) => {
    var social_info = await exe(`SELECT * FROM admin_social`);
    var admin_info =await exe(`SELECT * FROM admin_data`) 
    res.render("admin/social.ejs", { "social_info": social_info[0],"admin_info":admin_info[0]});
});

route.post("/save_social", async (req, res) => {
    var d = req.body;
    var admin_logo = '';

    if (req.files && req.files.admin_logo) {
        admin_logo = Math.random().toFixed(4) + " " + req.files.admin_logo.name;
        await req.files.admin_logo.mv("public/uploads/" + admin_logo);
    }

    var sql = `
        UPDATE admin_social 
        SET admin_logo = ?, insta_link = ?, twitter_link = ?, linkedin_link = ?, github_link = ?
        WHERE social_id = ?
    `;
    var values = [admin_logo, d.insta_link, d.twitter_link, d.linkedin_link, d.github_link, d.social_id];

    var data = await exe(sql, values);
    // res.send(data);
    res.redirect("/admin/social");
});




module.exports= route;
