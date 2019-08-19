const express=require('express')
const app=express();
const bodyParser=require('body-parser')
const bcrypt=require('bcrypt-nodejs');
const cors = require('cors');

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

app.get("/users",(req,res)=>{
   db('users').select('*').then(data=>res.json(data))
})

app.get('/profile/:id',(req,res)=>{
    const {id}=req.params;

    db.select('*').from('users').where({id:id}).then(user=>{
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json('not found')
        }    
    })
    .catch(err=>res.status(400).json('Error finding user'));
})


//POSTS

app.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    db.select('email','hash').from('login')
    .where('email',email)
    .then(data=>{
        const isValid=bcrypt.compareSync(password,data[0].hash);
        console.log(isValid)
        if(isValid){
            db.select('*').from('users')
            .where({email:email})
            .then(user=>res.json(user[0]))
        }
        else{
            res.status(400).json('Email or Password is incorrect')
         }
        
        })
        .catch(err=>res.status(400).json('Not Registered'))
})
//


app.post ('/register',(req,res)=>{
    let {name,email,password}=req.body;
    let isRegistered=db.select('email').from('users').where({email:email}).then(console.log)
    //create new user 
    const hash = bcrypt.hashSync(password);
    db.transaction(trx=>{
        trx.insert({
            hash:hash,
            email:email
        })
        .into('login')
        .returning('email')

        .then(loginEmail=>{
          return trx('users')
            .returning('*')
            .insert({
                email:loginEmail[0],
                name:name,
                joined:new Date()
            })
            .then(user=>res.json(user[0]))
        })
        .then(trx.commit)
        .then(trx.rollback)
    })
    .catch(err=>res.status(400).json('unable to add'))
})


app.put('/image',(req,res)=>{
    console.log(req.body)
    const {id}=req.body;
    db('users').where({id:id}).increment('entries',1).returning('entries')
    .then(entries=>res.json(entries[0]))
    .catch(err=>res.status(400).json('unable to update'))
})


app.listen(3000,()=>{
    console.log('App is running on port 3000')
})