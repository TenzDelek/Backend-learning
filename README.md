# Backend-learning

# note
# object model Prisma and Mongoose are helper- to store data

# use git bash terminal in vscode for using command like touch, mkdir, cd and all

you have seen app.get right inside it we write a url like /insta and after that we write a callback. basically what we are doing is that we are mentioning that if it hit that url do this and the work is define in the call back 

#the callback has it own param which is req and res . and we can write like res.send("tenz"). 
 so now whenever a /insta url is hit the respond tenz is send.
 now the middleware comes simply we can say it as a checker. whether it fullfill some requirement like whether he is login first
now when the url is hit it check the login first then it compute the response

the callback have mainly four param that are (err,req,res,next) next is a flag, when the middleware is done it pass a flag saying i am done now go to next middleware or any

# the cloudinary is used for file uploading ,back then we use express/fileupload but
these days multer is more prefered

what we will do is take image from user and store it in local for temporarly using multer and then using cloudinary we upload it in cloudinary, 
we can directly do it but it is not a good practice

# when people ask about what exactly is middleware- the best answer is 
when going just met me once( jab jarahe ho to mil ke jana)

# http 
the http and the https difference is that http when send data and recieve data it is the same like hello to hello but in https -a layer is introduce where the encrpytion is done

# url uri urn all are like same url is the uniform resource locator, the uri is the identifier and urn is the name

# http header- in the form of metadata-(key val pair) header is both in res and req

 the header are used in caching, auth and state management

# the request header is from the client
# the response header is from the server

# representation header for knowing encoding and compression

# payload header is data need to send


# most common headers
1. accept: application/json # which type is accepted
2. user-agent //info of from where the data is coming like browser ,postman
3. authorization: bearer (here jwt token is wrote)
4. content-type // like images pdf
5. Cookie: //like seting the cokkies

# the HTTP methods
basic operation that is used to interact with the server

1.GET - retrieve a resource(taking resource)
2.HEAD - only header no message body
3.OPTION - what operation are avialable
4.TRACE - mainly in debugging / loopback test(get same data)
5.DELETE -remove resource
6.PUT - replace resource
7.POST - interact with the resource(mostly add) like add new user (mostly used method)
8.PATCH - particular part is change rest are same

# HTTP STATUS CODE
1** informational
2** sucess
3** redirection
4** client error
5** server error

100 continue
102 processing
200 ok
201 created
202 accepted
307 temporary redirect
308 permanent redirect
400 bad request
401 unauthroizied
402 payment required
404 not found
500 internal server error
504 gateway time out


# most of the times we put routes and controllers import in app.js rather than index.js

# [fullName,email,username,password].some((field)=>field?.trim()==="")
here the .some is usefull to find whether true or not for many files

# access token duration is shortlive whereas the refreshtoken is long live(expiry)

# access token -
if u have it u have the access to the features that need authentication that are only explicit to the person
now when it get expire then refresh token comes in place(save both in user and database) user validation is done with access token but u dont have to put password always if u have the refresh token. u just have to hit a endpoint(if the refresh token and at the endpoint and urs match then it will give you a new access token)


# let talk about access token and the refresh token
main thing is that user dont have to give email and password always
access token is usually short live (like 1 hr)

refresh token is store in database access is not

so to refresh the token we have to creata end point to do so

#database
usually when we try to write query related to database we use await and async as database is in other continent