const auth = (req, res, next) => {
    const { authorization } = req.headers;
  
    if (!authorization) {
      return res.status(401).send('Unauthorized');
    }
  
    const [username, password] = Buffer.from(authorization.split(' ')[1], 'base64').toString().split(':');
  
    // Check credentials
    if (username === 'allmr' && password === 'translate214') {
      return next();
    }
  
    return res.status(401).send('Unauthorized');
  };
  
  module.exports = auth;