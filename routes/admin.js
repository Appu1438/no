var express = require('express');
var router = express.Router();
var adminhelp=require('../helper/adminhelp');
const userhelp = require('../helper/userhelp');


/* GET home page. */
const verifylogin=(req,res,next)=>{
  if(req.session.adminloggedIn){
    next()
  }else{
    res.redirect('/admin/login')
  }
}
router.get('/', verifylogin,async(req, res, next) =>{
 
  let admins=req.session.admin
  let count=await adminhelp.countPendingRequests()
  let usercount=await adminhelp.countUsers()
  console.log(count)
  console.log(usercount)
    res.render('admin/index',{admin:true,admins,count,usercount});
  });
  router.get('/users',verifylogin,async(req,res)=>{
    let admins=req.session.admin
    let count=await adminhelp.countPendingRequests()
    let usercount=await adminhelp.countUsers()
    adminhelp.getuser().then((users)=>{
        res.render('admin/users',{admin:true,users,admins,count,usercount})
    })

   
  })
  router.get('/profile',verifylogin,async(req,res)=>{
    let admins=req.session.admin
    let count=await adminhelp.countPendingRequests()
    let usercount=await adminhelp.countUsers()
    res.render('admin/profile',{admin:true,admins,count,usercount})
  })
  router.get('/contact',async(req,res)=>{
    let count=await adminhelp.countPendingRequests()
    let usercount=await adminhelp.countUsers()
    res.render('admin/contact',{admin:true,count,usercount})
  })
  router.get('/adduser',verifylogin,async(req,res)=>{
    let admins=req.session.admin
    let count=await adminhelp.countPendingRequests()
    let usercount=await adminhelp.countUsers()
    res.render('admin/adduser',{admin:true,admins,count,usercount})
  })
  router.post('/add-user',(req,res)=>{
    let admins=req.session.admin
    adminhelp.adduser(req.body,(id)=>{
        let Vimage=req.files.VImage
        let Dimage=req.files.DImage
        let Rimage=req.files.RImage
        
       
        Vimage.mv('./public/userimages/'+id+'.jpg',(err,done)=>{
            if(!err){
            
             }else{
                console.log(err)
            }
        })
        Dimage.mv('./public/licenseimages/'+id+'.jpg',(err,done)=>{
           if(!err){
            
          }else{
            console.log('D'+err)
          }
        })
        Rimage.mv('./public/driverimages/'+id+'.jpg',(err,done)=>{
          if(!err){
              
          }else{
              console.log('R'+err)
          }
      })
      res.render('admin/index',{admin:true,admins})
    })
  })
  router.get('/login',(req,res)=>{
    if(req.session.adminloggedIn){
      res.redirect('/admin',{admin:true})
    }else{
      res.render('admin/login',{'LoginErr':req.session.adminloginErr,admin:true})
       req.session.adminloginErr=false
    }
  })
  // router.get('/signup',(req,res)=>{
  //   res.render('admin/signup',{admin:true})
  // })
  // router.post('/signup',(req,res)=>{
  //   adminhelp.doSignup(req.body).then((response)=>{
  //     console.log(response)
  //     req.session.adminloggedIn=true
  //     req.session.admin=response
  //     res.redirect('/admin')
      
  //   })
  
  
  // })
  router.post('/login',(req,res)=>{
    adminhelp.dologin(req.body).then((response)=>{
      console.log(response)
      if(response.status){
        req.session.adminloggedIn=true
        req.session.admin=response.admin
        res.redirect('/admin')
      }else{
        req.session.adminloginErr="Invalid Admin"
        res.redirect('/admin/login')
      }
    })
  })
  router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/admin')
  })
  router.get('/edituser/:id',async(req,res)=>{
    let user= await adminhelp.getuserDetails(req.params.id)
    let admins=req.session.admin
    let count=await adminhelp.countPendingRequests()
    let usercount=await adminhelp.countUsers()
    console.log(user)
    res.render('admin/edit',{admin:true,user,admins,count,usercount})
  })
  router.post('/edit-user/:id',(req,res)=>{
    adminhelp.updateUser(req.params.id,req.body).then(()=>{
      if(req.files.VImage){
         let vimage=req.files.VImage
         vimage.mv('./public/userimages/'+req.params.id+'.jpg')
   
       }
       if(req.files.DImage){
        let dimage=req.files.DImage
        dimage.mv('./public/licenseimages/'+req.params.id+'.jpg')
  
      }
      if(req.files.RImage){
        let rimage=req.files.RImage
        rimage.mv('./public/driverimages/'+req.params.id+'.jpg')
  
      }
       res.redirect('/admin')
     })

  })
  router.get('/deleteuser/:id',(req,res)=>{
    let userID=req.params.id
    console.log(userID)
    adminhelp.deleteuser(userID).then(()=>{
      res.redirect('/admin/users')
    })
  })
  router.get('/pending',verifylogin,async(req,res)=>{
    let admins=req.session.admin
    let count=await adminhelp.countPendingRequests()
    let usercount=await adminhelp.countUsers()
    adminhelp.getreq().then((request)=>{
      res.render('admin/pending',{admin:true,admins,request,count,usercount})
 
    })
    })
    router.get('/viewmore/:id',async(req,res)=>{
      let admins=req.session.admin
      let count=await adminhelp.countPendingRequests()
      let vehicle=await userhelp.getvehicle(req.params.id)
      let usercount=await adminhelp.countUsers()
      res.render('admin/view-vehicle',{admin:true,admins,vehicle,count,usercount})
    })
    router.get('/reject/:id',(req,res)=>{
      adminhelp.rejectuser(req.params.id).then(()=>{
        res.redirect('/admin/pending')
      })
      
    })
    router.get('/accept/:id',async(req,res)=>{
      let admins=req.session.admin
      let count=await adminhelp.countPendingRequests()
      let usercount=await adminhelp.countUsers()
      let vehicle=await userhelp.getvehicle(req.params.id)
      // adminhelp.rejectuser2(req.params.id).then(()=>{

      // })
      res.render('admin/accept',{admin:true,admins,vehicle,count,usercount})

    })

  
  
module.exports = router;
