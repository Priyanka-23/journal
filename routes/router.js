var express=require('express');
var router=express.Router();      //to access the routes get put post delete
var User=require('../models/user');
router.get('/',function(req,res){               //if we need to call from any nested file
    res.sendFile(__dirname+'/views/index.html');
})
router.post('/',function(req,res,next){
    if(req.body.password!=req.body.passwordconf){
        var err=new Error('Passwords do not match.')
        err.status=400;
        res.send("Password do not match");
        return next(err);
    }

    if(req.body.username && req.body.email && req.body.password && req.body.passwordconf){
        var userData={
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            passwordconf:req.body.passwordconf
        }
        User.create(userData,function(err,user){
            if(err){
                throw err;
            }
            else{
                req.session.userID=user._id             //create a session variable called userID
                return res.redirect('/admin');
            }
        })
    }
})
router.get('/admin',function(req,res,next){
    if(req.session.userID){
        User.findById(req.session.userID).exec(function(err,user){
            if(err){
                return next(err);
            }
            else{
                if(user==null){
                    var err=new Error('Not authorised');
                    err.status=400;
                    return next(err);
                }    
            else{
                return res.send('<h2>Hello '+user.username+' !!</h2><a href="/Logout">Logout</a>');
            }        }
        })
    }
}) 
        router.get('/Logout',function(req,res,next){
            if(req.session){
                req.session.destroy(function(err){
                    if(err){
                        return next(err);
                    }
                    else{
                        return res.redirect('/')
                    }
                })
            }
        })
   
module.exports=router;
