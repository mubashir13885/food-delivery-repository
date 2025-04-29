const jwt = require('jsonwebtoken')


const generateAdminToken = (id , role ="admin")=>{
    const Admin_token = jwt.sign({ id ,role },process.env.JWT_SECRET)
    return Admin_token
}
module.exports = generateAdminToken