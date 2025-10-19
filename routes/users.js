const express=require('express');
const router = express.Router();
const catchAsync=require('../utilities/catchAsync');
const User=require('../models/user');
const passport=require('passport');


router.get('/register', async(req,res)=>{
    res.render('userview/register')

}) 

router.post('/register',catchAsync(async(req,res)=>{
const {email,username,password}=req.body;
const newuser=new User({email,username});
const registereduser=await User.register(newuser,password);
req.login(registereduser,err =>{
    if(err)return next(err);
    res.redirect('/matches');
})

}))

router.get('/login', (req, res) => {
    const { error } = req.query;
    res.render('userview/login', { error });
});


router.post('/login',passport.authenticate('local',{failureflash:true,failureRedirect:'/login'}),(req,res)=>{
res.redirect('/matches');
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/matches?msg=You have been logged out successfully');
    });
});



module.exports=router;


