# Backend-learning

# note
# object model Prisma and Mongoose are helper- to store data

# use git bash terminal in vscode for using command like touch, mkdir, cd and all

# you have seen app.get right inside it we write a url like /insta and after that we write a callback. basically what we are doing is that we are mentioning that if it hit that url do this and the work is define in the call back 
# the callback has it own param which is req and res . and we can write like res.send("tenz"). 
# so now whenever a /insta url is hit the respond tenz is send.
# now the middleware comes simply we can say it as a checker. whether it fullfill some requirement like whether he is login first

# now when the url is hit it check the login first then it compute the response

# the callback have mainly four param that are (err,req,res,next) next is a flag, when the middleware is done it pass a flag saying i am done now go to next middleware or any