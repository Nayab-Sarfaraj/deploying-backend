const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
require("./db/connection");
const userRouter = require("./router/userRoutes");
const errorhandler = require("./middleware/erorr");
const { default: sendEmail } = require("./utils/sendEmail");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1", userRouter);
app.use("/api/v1/test", (req, res, next) => {
    return res.json({success:true,message:"successfully send the message"})
});
app.use(errorhandler);
const PORT = process.env.PORT || 5000;
app.listen(8080, () => console.log(`server running on the port ${PORT}`));
