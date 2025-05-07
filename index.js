const express = require('express')

const bodyParser = require('body-parser')
const cookiesParser = require('cookie-parser')
const app = express()
const port = 3000
const cors = require('cors')

app.use(bodyParser.json())
app.use(cookiesParser())

//admin route

//call client route

app.use(cors())
const authRoute = require('./src/router/client/auth')
const products = require('./src/router/client/product')


//auth
app.use('/api/auth/',authRoute)


//product
app.use('/api',products)


app.listen(port,()=>{
    console.log(`running at http://localhost:${port}`);
    
})
