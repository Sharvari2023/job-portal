import db from "../config/db.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const updateusercontroller = async (req, res, next) => {

    const { username, email, first_name, last_name } = req.body;
    if (!username || !email) {
        next('please provide all fields')
    }
    console.log('Request Body:', req.body);
    const result = await db.query("SELECT * FROM users WHERE id = $1 ", [
        req.body.user.id
    ]);
    if (result.rows.length === 0) {
        return res.status(404).send({ message: 'User not found', success: false });
    }

    await db.query(
        "UPDATE users SET username = $1, first_name = $2, last_name = $3 , email = $4 WHERE id=$5",
        [username, first_name, last_name, email, req.body.user.id]
    );
    const token = jwt.sign({ id: req.body.user.id, email, username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).send({ message: 'User updated successfully', success: true, token });
}

//get user data

export const getUserDataController = async (req, res, next) => {
    try {
        const userResult = await db.query("SELECT * FROM users WHERE id=$1", [req.body.user.id]);

        if (userResult.rows.length === 0) {
            return res.status(404).send({
                message: "User not found",
                success: false
            });
        }

        const user = userResult.rows[0];
        user.password = undefined;

        res.status(200).send({
            success: true,
            data: user,

        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};
