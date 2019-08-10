const express=require('express')
const app=express();
const bodyParser=require('body-parser')
const bcrypt=require('bcrypt-nodejs');
const cors = require('cors')
//

const database={
    users:[
        {
            id:"123",
            name:"John",
            password:"cookies",
            email:"john@gmail.com",
            entries:0,
            joined:new Date()
        },
        {
            id:"124",
            name:"Sally",
            password:"bananas",
            email:"sally@gmail.com",
            entries:0,
            joined:new Date()
        },
        ],
    login:[
            {
                id:"987",
                hash:'',
                email:'john@gmail.com'
            }

         ]
}

//Middleware
//urlencoded is for utf8
app.use(bodyParser.urlencoded({extended:false}))
//bodyParser.json() is for json data. 
app.use(bodyParser.json())
//cors
app.use(cors())


//GETS
app.get('/',(req,res)=>{
    res.send('this is working')
})

app.get("/users",(req,res)=>{
   res.json(database.users)
})

app.get('/profile/:id',(req,res)=>{
    const {id}=req.params;
    let found=false;
    database.users.forEach(user=>{
        if(user.id===id){
            found=!false;
            return res.json(user);
        }
    })
    if(!found){res.status(404).json("not found")}
})


//POSTS

app.post('/signin',(req,res)=>{
   
     let found=false;
    let {email,password}=req.body
    database.users.forEach(user=>{
        if(user.email===email&&user.password==password){
            found=!false;
            return res.json(user);
        }
    })
    if(!found){res.status(400).json("username or password incorrect")}
    }
)

app.post ('/register',(req,res)=>{
    let {name,email,password}=req.body;
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     console.log(hash)
    // });
    database.users.forEach(el=>{
        if(el.email===email){
        res.json("email is already registered")
        }
    })
    database.users.push({
        id:String(Math.floor(Math.random()*100)),
        name:name,
        email:email,
        password:password,
        entries:0,
        joined:new Date()
    })
    // res.json("registered")
    res.json(database.users[database.users.length-1])
})


app.put('/image',(req,res)=>{
    console.log(req.body)
    const {id}=req.body;
    let found=false;
    database.users.forEach(user=>{
        if(user.id===id){
            found=!false;
            user.entries++;
            console.log(user.entries)
            return res.json(user.entries);
        }
    })
    if(!found){res.status(404).json("not found")}
})







app.listen(3000,()=>{
    console.log('App is running on port 3000')
})