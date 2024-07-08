import JWT from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        next('auth failed');
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = JWT.verify(token, process.env.JWT_SECRET)
        req.body.user = { id: payload.id }
        next()
    } catch (error) {
        next('auth failedd')
    }
}
export default userAuth;