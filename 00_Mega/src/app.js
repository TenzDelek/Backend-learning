import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app=express()
//.use is used for middleware
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//data will come from different ways that we define here
//through json
app.use(express.json({limit:"16kb"}))

//through url
app.use(express.urlencoded({extended:true,limit:"16kb"}))

//for image assets
app.use(express.static("public"))

app.use(cookieParser())

//routes
import userRouter from './routes/user.routes.js '

//route declaration
app.use('/api/v1/users',userRouter)

export{app}