const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGOURI} =  require('./keys')


mongoose.connect(MONGOURI)
mongoose.connection.on('connected', ()=>{
    // const db = client.db(insta_db);
    console.log('Connected to mongo yeahhh');
})

mongoose.connection.on('error', (err)=>{
    console.log('err connecting', err);
})

require('./models/user')
require('./models/post')

app.use(express.json()) //It kind of middleware needed to be parse all the incoming request into json 
app.use(require('./routes/auth'))
app.use(require('./routes/post'))

// const customMiddleware = (req, res, next) => {
//     console.log('middleware executed');
//     next()
// }

// app.use(customMiddleware)

// app.get('/', (req, res)=>{
//     console.log('home');
//     res.send('Hello World')
// })

// app.get('/about', customMiddleware, (req, res)=>{
//     console.log('About me');
//     res.send("Hello I'm Azmain about to learn node js.")
// })



app.listen(PORT, () => {
    console.log('server is running on', PORT);
})