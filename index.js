const express = require('express')

const bodyParser = require('body-parser')
const app = express()
const port = 3000
const cors = require('cors')

app.use(express.static('public'));
const webhook = require('./src/router/client/webhook')
app.use('/api',webhook)


app.use(bodyParser.json())

app.use(cors())

//admin route
const users = require('./src/router/admin/user')

//get users
app.use('/api/admin/',users)
//call client route


const authRoute = require('./src/router/client/auth')
const products = require('./src/router/client/product')


//auth
app.use('/api/auth/',authRoute)


//product
app.use('/api/',products)


app.listen(port,()=>{
    console.log(`running at http://localhost:${port}`);
    
})
