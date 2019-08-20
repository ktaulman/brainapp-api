const express=require('express')
const app=express();
const bodyParser=require('body-parser')
const bcrypt=require('bcrypt-nodejs');
const cors = require('cors');
const register=require('./controllers/register');
const signIn=require('./controllers/signin')
const image=require('./controllers/image')
const users=require('./controllers/users')
const profileID=require('./controllers/profileID')

//KNEX
const db = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'kevin',
      password : '',
      database : 'smart-brain'
    }
  });

//Middleware
//urlencoded is for utf8
app.use(bodyParser.urlencoded({extended:false}));
//bodyParser.json() is for json data. 
app.use(bodyParser.json());
//cors
app.use(cors());


//GETS
app.get('/',(req,res)=>{
    res.send('this is working')
})
app.get("/users",(req,res)=>{users.handleUsers(req,res,db)})

app.get('/profile/:id',(req,res)=>{profileID.handleProfile(req,res,db)})

//POSTS
app.post('/signin',(req,res)=>{signIn.handleSignIn(req,res,db,bcrypt)})//dependency injection

app.post('/register',(req,res)=>{register.handleRegister(req,res,db,bcrypt)});

app.post('/imageurl',(req,res)=>{image.handleApiCall(req,res)})

//PUTS
app.put('/image',(req,res)=>{image.handleImage(req,res,db)})


app.listen(3000,()=>{
    console.log('App is running on port 3000')
})