const express = require('express')

const bodyParser = require('body-parser')
const cookiesParser = require('cookie-parser')
const app = express()
const port = 3000
const cors = require('cors')

app.use(bodyParser.json())
app.use(cookiesParser())


app.use(cors())

//admin route
const users = require('./src/router/admin/user')
const dashboard = require('./src/router/admin/dashboard')
const product_t = require('./src/router/admin/product')


app.use('/api/admin/',users)
app.use('/api/admin/',dashboard)
app.use('/api/admin/',product_t)


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
