const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const requireLogin = require('../middleware/requireLogin')

router.post('/create-post', requireLogin, (req, res)=>{
    const {title, body} = req.body
    if(!title || !body){
        return res.status(422)
        .json({error:"Please add all the required fields"})
    }
    // console.log(req.user);
    // res.send('okS')
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedBy: req.user
    })
    post.save().then((result)=>{
        res.json({post: result})
    })
    .catch((err)=>{
        console.log('Error in create post:', err);
    })
})


router.get('/all-post', requireLogin, (req,res)=>{
    Post.find().populate('postedBy','_id name').then((allPosts)=>{
        res.json({allPosts})
    })
    .catch((err)=>{
        console.log('Error in get all post:', err);
    })
})

module.exports = router