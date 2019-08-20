const handleUsers=(req,res,db)=>{db('users').select('*').then(data=>res.json(data))}

module.exports={
    handleUsers:handleUsers
}