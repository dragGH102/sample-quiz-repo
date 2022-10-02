const jwt = require('jsonwebtoken');

const { prismaFindUniqueQueryOrThrow } = require('./utils/prisma-query-or-throw.js');

const jwtKey = 'my_secret_key';

const jwtExpirySeconds = 10;

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({log: ['query']});


const login = async (req, res) => {
	// Get credentials from JSON body
    const { username, password } = req.body;
	
	try {
		const user = await prismaFindUniqueQueryOrThrow({
			where: { username: username },
		}, 'user');

		if (!username || !password || user['password'] !== password) {
			// return 401 error is username or password doesn't exist, or if password does
			// not match the password in our records
			return res.status(401).end();
		}
	} catch(e) {
		console.log('User not found');
		return res.status(401).end();
	}

     // Create a new token with the username in the payload
     // and which expires 300 seconds after issue
     const token = jwt.sign({ username }, jwtKey, {
         algorithm: 'HS256',
         expiresIn: jwtExpirySeconds,
     });
 
     // set the cookie as the token string, with a similar max age as the token
     // here, the max age is in milliseconds, so we multiply by 1000
	res.cookie('token', token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: jwtExpirySeconds * 1000 }); 

	res.json({token: token}).end();

};

const refresh = async (req, res) => {
	console.log(req.body);
	const {token} = req.body;

	if (!token) {
		return res.status(401).end();
	}

	var payload = jwt.decode(token);
	// (END) The code uptil this point is the same as the first part of the `welcome` route

	// We ensure that a new token is not issued until enough time has elapsed
	// In this case, a new token will only be issued if the old token is within
	// 30 seconds of expiry. Otherwise, return a bad request status
	const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
	if (payload.exp - nowUnixSeconds > 30) {
		return res.status(400).end();
	}

	// Now, create a new token for the current user, with a renewed expiration time
	const newToken = jwt.sign({ username: payload.username }, jwtKey, {
		algorithm: 'HS256',
		expiresIn: jwtExpirySeconds,
	});

	// Set the new token as the users `token` cookie
	res.cookie('token', newToken, { maxAge: jwtExpirySeconds * 1000 });
	res.json({token: newToken}).end();
	res.end();

};

const logout = async (req, res) => {
    const token = req.cookies.token;

	if(token){
		res.clearCookie('token');
	}
	
    res.end();
};

const expired = (req, res) => {
	const {token} = req.body;
	let expired = false;

	if(!token){
		res.json({isExpired: true});
		return;
	}

	try{
		jwt.verify(token, jwtKey);
	}catch(err){
		if (err instanceof jwt.TokenExpiredError) {
			expired = true;
		}
	}

	res.json({isExpired: expired});
	res.end();
};

const saveResult = async (req,res) => {
   const { username, totQuestions, score } = req.body;

   const token = req.cookies.token;

	if(!token){
		res.json({message: "Not authorized"});
		res.status(401).end();
		return;
	}

   try{
      const result = await prisma.result.create({
		data: {
			username,
			totQuestions,
			score
		}
    });

	res.json(result);

   }catch(err){
      res.json(err);
   }
};

const getResults = async (req,res) => {
	const { username } = req.params;

	const token = req.cookies.token;

	if(!token){
		res.json({message: "Not authorized"});
		res.status(401).end();
		return;
	}
	
	const results = await prisma.result.findMany({ where: { username}});

	res.json(results);
};

module.exports = {
    login,
    refresh,
    logout,
	expired,
	saveResult,
	getResults,
	jwtKey
};