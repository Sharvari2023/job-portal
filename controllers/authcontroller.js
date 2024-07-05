/*import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const saltRounds = 10;


//register controller
export const registercontroller = async (req, res, next) => {
   
    console.log("request recieved");

    //registering ke time username,password and email uthana hai
    const { username, email, password, first_name, last_name, user_type } = req.body;
    //validate
    console.log(req.body);
    if (!username) {
        next('please provide username');
    }
    if (!email) {
        next('please provide email');
    }
    if (!password) {
        next('please provide password');
    }
    if (!user_type) {
        next('please provide user_type');
    }
    const user = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if (user.rows.length > 0) {
        next('email already exist try logging in');
    }
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.error("Error hashing password:", err);
        } else {
            await db.query("INSERT INTO users(username,password,email,first_name,last_name,user_type) VALUES($1,$2,$3,$4,$5,$6)", [username, hash, email, first_name, last_name, user_type]);
        }
        //generating jwt
        const token = jwt.sign({ email, username, user_type }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).send({ message: 'User registered successfully', success: true, token });
    })
}

//login controller
export const logincontroller = async (req, res) => {
    const { name, email, password, first_name, last_name, user_type } = req.body;
    try {
        const user = await db.query("SELECT * FROM users WHERE email = $1 ", [
            email
        ]);
        if (user.rows.length > 0) {
            const result = user.rows[0];
            const storedHashedPassword = result.password;
            bcrypt.compare(password, storedHashedPassword, (err, valid) => {
                if (err) {
                    console.error("Error comparing passwords:", err);

                } else {
                    if (valid) {

                        const tokenPayload = { id: result.id, email: result.email, name: result.username, user_type: result.user_type };
                        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });
                        
                        res.status(201).send({ message: 'User logged in successfully', success: true, token });
                    } else {
                        res.send({ message: 'could not log in try again' });
                    }
                }
            });
        } else {
            res.send({ message: 'User not found' });
        }
    } catch (err) {
        console.log(err);
    }
}
*/
/*import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const saltRounds = 10;


//register controller
export const registercontroller = async (req, res, next) => {

    //registering ke time username,password and email uthana hai
    const { username, email, password, first_name, last_name, user_type } = req.body;
    //validate
    if (!username) {
        next('please provide name');
    }
    if (!email) {
        next('please provide email');
    }
    if (!password) {
        next('please provide password');
    }
    if (!user_type) {
        next('please provide user_type');
    }
    const user = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if (user.rows.length > 0) {
        next('email already exist try logging in');
    }
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.error("Error hashing password:", err);
        } else {
            await db.query("INSERT INTO users(username,password,email,first_name,last_name,user_type) VALUES($1,$2,$3,$4,$5,$6)", [username, hash, email, first_name, last_name, user_type]);
        }
        //generating jwt
        const token = jwt.sign({ email, username, user_type }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).send({ message: 'User registered successfully', success: true, token });
    })
}

//login controller
export const logincontroller = async (req, res) => {
    const { name, email, password, first_name, last_name, user_type } = req.body;
    try {
        const user = await db.query("SELECT * FROM users WHERE email = $1 ", [
            email
        ]);
        if (user.rows.length > 0) {
            const result = user.rows[0];
            const storedHashedPassword = result.password;
            bcrypt.compare(password, storedHashedPassword, (err, valid) => {
                if (err) {
                    console.error("Error comparing passwords:", err);

                } else {
                    if (valid) {

                        const tokenPayload = { id: result.id, email: result.email, name: result.username, user_type: result.user_type };
                        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });
                       
                        res.status(201).send({ message: 'User logged in successfully', success: true, token });
                    } else {
                        res.send({ message: 'could not log in try again' });
                    }
                }
            });
        } else {
            res.send({ message: 'User not found' });
        }
    } catch (err) {
        console.log(err);
    }
}*/
import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = 10;

//register controller
export const registercontroller = async (req, res, next) => {
    const { username, email, password, first_name, last_name } = req.body;

    //validate
    if (!username) {
        return next('Please provide username');
    }
    if (!email) {
        return next('Please provide email');
    }
    if (!password) {
        return next('Please provide password');
    }

    try {
        const user = await db.query("SELECT * FROM users WHERE email=$1", [email]);
        if (user.rows.length > 0) {
            return next('Email already exists, try logging in');
        }

        const hash = await bcrypt.hash(password, saltRounds);

        await db.query("INSERT INTO users(username, password, email, first_name, last_name) VALUES($1, $2, $3, $4, $5)", [username, hash, email, first_name, last_name]);

        //generating jwt
        const token = jwt.sign({ email, username }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).send({ message: 'User registered successfully', success: true, token });
    } catch (error) {
        next(error);
    }
}

//login controller
export const logincontroller = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        const result = user.rows[0];
        const storedHashedPassword = result.password;
        const valid = await bcrypt.compare(password, storedHashedPassword);

        if (valid) {
            const tokenPayload = { id: result.id, email: result.email, name: result.username, user_type: result.user_type };
            const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).send({ message: 'User logged in successfully', success: true, token });
        } else {
            res.status(401).send({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error' });
    }
}
