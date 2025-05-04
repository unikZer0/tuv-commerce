const express = require('express')

const bodyParser = require('body-parser')
const cookiesParser = require('cookie-parser')
const app = express()
const port = 3000
const cors = require('cors')
//call route
app.use(cors())
const authRoute = require('./src/router/auth')
const products = require('./src/router/product')

app.use(bodyParser.json())
app.use(cookiesParser())

//auth
app.use('/api/auth',authRoute)


//product
app.use('/api',products)


app.listen(port,()=>{
    console.log(`running at http://localhost:${port}`);
    
})
