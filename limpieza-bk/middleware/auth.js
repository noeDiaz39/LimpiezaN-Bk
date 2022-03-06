const jwt=require('jsonwebtoken')

function auth(req,res,next){
    const jwtoken=req.header('Authorization')
        if(!jwtoken){
        return res.status(401).send('Acceso denegado. se necesita token')
    }
    try {
        const payload=jwt.verify(jwtoken,'contraseña')
        next()
    } catch (e) {
        res.status(400).send('acceso denegado. token no valido')
    }
        
}
module.exports=auth;