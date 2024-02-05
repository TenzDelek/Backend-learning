import express from 'express'
import 'dotenv/config'
const App=express()

App.get('/',(req,res)=>{
    res.send('HELLO TENZIN')
})
App.get('/anime',(req,res)=>{
res.send("<h1> plus ultra </h1>")
})
const port= process.env.PORT ||3000; //now this will use .env (the .env should be install and imported unlike in react we use it directly)

App.listen(port,()=>{
    console.log(`server is on http://localhost:${port}`)
})