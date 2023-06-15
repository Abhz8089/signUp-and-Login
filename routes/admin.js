var express = require('express');
 const {render}=require('../app')
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers= require('../helpers/user-helpers');
const adminHelpers=require('../helpers/admin-helpers')
const fileUpload = require('express-fileupload');
const verifyLogin=(req,res,next)=>{
  if(req.session.admin && req.session.admin.loggedIn){
    next()
  }else{
    res.redirect('/admin/adminLogin')
  }
}
/* GET users listing. */
router.get('/',verifyLogin, function(req, res, next) {
  let admin=req.session.admin
productHelpers.getAllProducts().then((products)=>{
  console.log(products)
  res.render('admin/view-products',{admin:true,products,admin});
})
// ---
// router.get("/user-data",async(req,res)=>{
//   let users=await adminHelpers.getAllUsers(req.session)
//   res.render("admin/user-data",{admin:true,users})
// })
  //--
 
  
});
router.get('/add-product',verifyLogin,(req,res,next)=>{
  console.log('product added')
   res.render('admin/add-product',{admin:true})
})
// router.get('/user-data',verifyLogin,(req,res)=>{
//   res.render('admin/user-data')
// })

router.post('/add-product',(req,res)=>{
    console.log(req.body)
    console.log(req.files.image);
    
    productHelpers.addProduct(req.body,(id)=>{
       let image=req.files.image
       console.log("yay get the id:"+id)
       image.mv('./public/images/'+id+'.jpg',(err,done)=>{
       if(!err){
          res.render('admin/add-product')
      }else{
         console.log("this is the error   :"+err);
       }
      })
      
})
})
router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
})
//-----------------------------
router.get('/adminLogin',function(req,res){
  if(req.session.admin){
    res.redirect("/admin")  //--c
  }
  else{
    res.render("admin/login",{"loginErr":req.session.adminLoginErr})
    req.session.adminLoginErr=false
  }
 
})
router.post('/adminLogin',(req,res)=>{
  adminHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      
      console.log("Admin in successfully loged in");
      req.session.admin=response.admin
      req.session.admin.loggedIn=true
      res.redirect('/admin')
    }
    else{
      req.session.adminLoginErr=true
      res.redirect('/admin/adminLogin') 
    }
  })
})
router.get("/adminLogout",function(req,res){
  req.session.admin=null
  res.redirect("/")
})

//------------------------all users
router.get("/user-data",verifyLogin,async (req,res)=>{
  let users=await adminHelpers.getAllUsers(req.session)
  res.render("admin/all-users",{admin:true,users})
})
//----------------------------------------








router.get('/edit-product/:id',async(req,res)=>{
  let product=await productHelpers.getProductDetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id',(req,res)=>{
  console.log(req.params.id);
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{

    res.redirect('/admin')
    if(req.files.image){
      let image=req.files.image
      image.mv('./public/images/'+id+'.jpg')
       
       
    }
  })
});

module.exports = router;
