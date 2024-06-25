const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')

router.get('/', (req, res)=>{
    res.send('Hello from auth.js')
})

router.get('/protected', requireLogin, (req, res)=>{
    res.send('Hello from protected auth.js')
})



router.post('/sign-up', (req, res)=>{
    const {name, email, password} = req.body
    if(!name || !email || !password){
        return res.status(422).json({error: 'Please add all the fields value'})
    }
    User.findOne({email:email}).then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error: 'User already exists with that email'})
        }
        // .then((hashedPass)=>{
            
        // }) 

        const user = new User({
            name,
            email,
            password: bcrypt.hashSync (password, 12)
        })
        user.save()
        .then((user)=>{
            res.json({message: "User saved successfully"})
        })
        .catch((err)=>{
            console.log('err in save:',err);
        })
    })
    .catch((err)=>{
        console.log('err in find', err);
    })
    // res.json({message: 'Successfully posted'})
    // console.log(req.body); 
})

router.post('/sign-in', (req, res)=>{
    const {email, password} = req.body
    User.findOne({email:email}).then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password, savedUser.password).then((doMatch)=>{
            if(doMatch){
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET) //savedUser._id -> get id from db record
                const {_id, name, email} = savedUser
                return res.json({message:"Login successful", token, user:{_id, name, email}})
            }
            return res.status(422).json({error:"Invalid email or password"})
        })
        .catch((err)=>{
            console.log('error in password decryption: ', err);
        })  
    })
})


module.exports = router