const jwt = require('jsonwebtoken')
const { User,Cart } = require('../models/index.js')
function authentication(req,res,next){
  if(!req.headers.access_token){
    res.status(401).json({
      message:'Auth Fail'
    })
  }
  else{
    try{
      const payload = jwt.verify(req.headers.access_token,process.env.SECRET_KEY)
      User.findOne({
        where:{
          email:payload.email
        },
        include: Cart
      })
      .then(user =>{
        if(user){
          req.userCart = user
          req.loggedInUser = payload
          next()
        }
        else{
          res.status(401).message({
            message:"Access Denied"
          })
        }
      })
      .catch(err =>{
        res.send(err)
      })
    }
    catch(err){
      console.log('error on')
      console.log(err)
      res.status(401).json({
        message:"Unauthorize Request"
      })
    }
  }
}
module.exports = authentication
