const jwt = require('jsonwebtoken')

const secret = 'super Secr3tCode1'


function createToken(userData){
const payload = {
    email: userData.email,
    _id: userData._id
}
const token =  jwt.sign(payload, secret, {
expiresIn: '1d'

})
return token;
}
function verifyToken(token){

const data = jwt.verify(token, secret)

return data;
}

module.exports = {
    createToken,
    verifyToken,
}