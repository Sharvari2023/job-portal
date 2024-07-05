//error middlewares
/*const errorhandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.log(err);
    res.status(500).send({
        success: false,
        message: 'something went wrong',
        err
    })
}
export default errorhandler;*/
//error middlewares
const errorhandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({
        success: false,
        message: 'something went wrong',
        err
    })
}
export default errorhandler;