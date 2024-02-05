import express from 'express'
import 'dotenv/config'
const App=express()

const delekgit={
    "login": "TenzDelek",
    "id": 122612557,
    "node_id": "U_kgDOB07rTQ",
    "avatar_url": "https://avatars.githubusercontent.com/u/122612557?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/TenzDelek",
    "html_url": "https://github.com/TenzDelek",
    "followers_url": "https://api.github.com/users/TenzDelek/followers",
    "following_url": "https://api.github.com/users/TenzDelek/following{/other_user}",
    "gists_url": "https://api.github.com/users/TenzDelek/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/TenzDelek/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/TenzDelek/subscriptions",
    "organizations_url": "https://api.github.com/users/TenzDelek/orgs",
    "repos_url": "https://api.github.com/users/TenzDelek/repos",
    "events_url": "https://api.github.com/users/TenzDelek/events{/privacy}",
    "received_events_url": "https://api.github.com/users/TenzDelek/received_events",
    "type": "User",
    "site_admin": false,
    "name": "TenzDelek",
    "company": null,
    "blog": "https://tenzindelek.vercel.app/",
    "location": null,
    "email": null,
    "hireable": null,
    "bio": "ONE DAY OR DAY ONE",
    "twitter_username": null,
    "public_repos": 25,
    "public_gists": 0,
    "followers": 3,
    "following": 5,
    "created_at": "2023-01-13T12:03:36Z",
    "updated_at": "2024-01-21T08:10:01Z"
  }
App.get('/',(req,res)=>{
    res.send('HELLO TENZIN')
})
App.get('/anime',(req,res)=>{
res.send("<h1> plus ultra </h1>")
})
App.get('/github',(req,res)=>{
    res.json(delekgit)
})
const port= process.env.PORT ||3000; //now this will use .env (the .env should be install and imported unlike in react we use it directly)

App.listen(port,()=>{
    console.log(`server is on http://localhost:${port}`)
})