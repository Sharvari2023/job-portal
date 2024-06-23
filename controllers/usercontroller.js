import db from "../config/db.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const updateusercontroller = async (req, res, next) => {
    const userId = req.params.id || req.user.userId;
    const { name, email, first_name, last_name, user_type } = req.body;
    if (!name || !email || !user_type) {
        next('please provide all fields')
    }
    console.log('Request Body:', req.body);
    console.log('User ID:', userId);



    const result = await db.query("SELECT * FROM users WHERE id = $1 ", [
        userId
    ]);
    if (result.rows.length === 0) {
        return res.status(404).send({ message: 'User not found', success: false });
    }
    const user = result.rows[0];
    await db.query(
        "UPDATE users SET name = $1, first_name = $2, last_name = $3, email = $4, user_type = $5 WHERE id = $6",
        [name, first_name, last_name, email, user_type, userId]
    );
    const token = jwt.sign({ email, name, user_type }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).send({ message: 'User updated successfully', success: true, token });
}