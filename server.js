const express=require('express')
const app=express();
const bodyParser=require('body-parser')

const database={
    users:[
        {
            id:"123",
            name:"John",
            email:"john@gmail.com",
            password:'cookies',
            entries:0,
            joined:new Date()
        },
        {
            id:"124",
            name:"Sally",
            email:"sally@gmail.com",
            password:'bananas',
            entries:0,
            joined:new Date()
        },
    ]
}


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


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
   console.log(req.body)
    if( req.body.email===database.users[0].email&&
        req.body.password===database.users[0].password){
        res.json("signed-in")
    }
    else{
        res.status(400).json("username or password incorrect")
    }
})

app.post ('/register',(req,res)=>{
    let {name,email,password}=req.body;
    database.users.push({
        id:String(Math.floor(Math.random()*1000)),
        name:name,
        email:email,
        password:password,
        entries:0,
        joined:new Date()
    })
    res.json(database.users[database.users.length-1])
})

app.put('/image',(req,res)=>{
    const {id}=req.body;
    let found=false;
    database.users.forEach(user=>{
        if(user.id===id){
            found=!false;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if(!found){res.status(404).json("not found")}
})

//Route Planning
/* 
    1/-->res = this is working
    2/signin
        -->POST
            -->success/failure
    2/register
        -->POST
            -->user
    3/profile/:userId 
        --> GET = user
    4/images 
        --> PUT 
            --> user; 

*/

app.listen(3000,()=>{
    console.log('App is runing on port 3000')
})