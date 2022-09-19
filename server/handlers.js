const jwt = require('jsonwebtoken');

const { prismaFindUniqueQueryOrThrow } = require('./utils/prisma-query-or-throw.js');

const jwtKey = 'my_secret_key';

const jwtExpirySeconds = 300;


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
	res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 });

	res.end();
};

const refresh = (req, res) => {
	const token = req.cookies.token;
	console.log(req.cookies);

	if (!token) {
		return res.status(401).end();
	}

	var payload;
	try {
		payload = jwt.verify(token, jwtKey);
		console.log(payload);
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			return res.status(401).end();
		}
		return res.status(400).end();
	}
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
	res.end();
};

const logout = async (req, res) => {
    const token = req.cookies.token;

	if (!token) {
		return res.status(401).end();
	}

    res.clearCookie('token');
    res.end();
};

module.exports = {
    login,
    refresh,
    logout,
	jwtKey
};