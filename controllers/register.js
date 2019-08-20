    const handleRegister=(req,res,db,bcrypt)=>{
    let {name,email,password}=req.body;
    let isRegistered=db.select('email').from('users').where({email:email}).then(console.log)
    //create new user 
    //validation
    if(!email||!name||!password){
        res.status(400).json('missing fields')
    }
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
        .catch(err=>res.json('user already registered'))
    })
    .catch(err=>res.status(400).json('unable to add'))
}

module.exports={
    handleRegister:handleRegister
}