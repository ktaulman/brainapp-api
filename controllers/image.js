const Clarifai = require('clarifai');
const app = new Clarifai.App({
  apiKey: 'a448da03a2814ac1b4781e6a65e34381'
 });

const handleApiCall=(req,res)=>{
 app.models
    .predict(
        Clarifai.FACE_DETECT_MODEL,req.body.input
        )
    .then(data=>res.json(data))
    .catch(err=>res.status(400).json('unable to work with API!'))
}

const handleImage=(req,res,db)=>{
    console.log(req.body)
    const {id}=req.body;
    db('users').where({id:id}).increment('entries',1).returning('entries')
    .then(entries=>res.json(entries[0]))
    .catch(err=>res.status(400).json('unable to update'))
}

module.exports={
    handleImage:handleImage,
    handleApiCall:handleApiCall
}