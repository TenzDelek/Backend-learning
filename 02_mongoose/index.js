import express from 'express'

const App=express()

App.get('/mongo',(req,res)=>{
    res.send("good")
})
const port= process.env.PORT || 3000;

App.listen(port,()=>{
    console.log(`the server is on http://localhost:${port}`)
})