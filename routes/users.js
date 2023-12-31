var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers=require('../helpers/user-helpers')
const alert=require('alert')
/* GET home page. */
const verifyLogin=(req,res,next)=>{
  if(req.session.user.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
router.get('/', function(req, res, next) { 
  let user=req.session.user
  console.log(user);
productHelpers.getAllProducts().then((products)=>{
  
  res.render('user/view-products',{admin:false,products,user});
})
 
});
router.get('/login',(req,res)=>{
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('user/login',{"loginErr":req.session.userLoginErr})
    req.session.userLoginErr=false
  }
  
})

router.get('/register',(req,res)=>{
 
  res.render('user/register')
  
})
router.post('/register',(req,res)=>{
    userHelpers.doSignup(req.body).then((response)=>{
    console.log(response)
    req.session.user=response.user  
    alert('account created')
    res.redirect('/login')
   
    
})
});

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      
      req.session.user=response.user
      req.session.user.loggedIn=true
      res.redirect('/')
    }else{
      req.session.userLoginErr=true
      res.redirect('/login')
    }
  })

})
router.get('/logout',(req,res)=>{
  req.session.user=null
  res.redirect('/')
})
router.get('/cart',verifyLogin,(req,res)=>{
  res.render('user/cart')
})





module.exports = router;
























































































































































































































































































































































































































































































































































































