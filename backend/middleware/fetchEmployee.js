const jwt = require('jsonwebtoken')
const JWT_SECRET = "ValidexIndia"
const fetchEmployee = (req,res,next) => {

    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        // console.log('Decoded token:', data)
        if(!data.employeeData || !data.employeeData.id){
            return res.status(401).send({ error: 'Invalid token. Failed to retrieve employee data.' });
        }
        req.employeeData = data.employeeData
        next()  
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
}

module.exports = fetchEmployee