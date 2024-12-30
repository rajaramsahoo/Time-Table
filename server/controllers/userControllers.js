const userModel = require("../models/userModel.js")
const { hashPassword, comparePassword } = require("../utils/authUtils.js")
const jwt = require('jsonwebtoken');
const signUoController = async (req, res) => {
    try {
        const { name, email, phone, password, confirmpassword } = req.body;
        if (!name) {
            return res.send({ message: "Name is Required" });
        }
        if (!email) {
            return res.send({ message: "Email is Required" });
        }
        if (!phone) {
            return res.send({ message: "Phone is Required" });
        }
        if (!password) {
            return res.send({ message: "Password no is Required" });
        }
        if (!confirmpassword) {
            return res.send({ message: "Confirmpassword is Required" });
        }
        if (password !== req.body.confirmpassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        //check user
        const exisitingUser = await userModel.findOne({ email });
        //exisiting user
        if (exisitingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Register please login",
            });
        }

        const hashedPassword = await hashPassword(password);
        const hashedConfirmPassword = await hashPassword(confirmpassword);

        const user = await new userModel({
            name, email, phone, password: hashedPassword, confirmpassword: hashedConfirmPassword
        }).save();

        res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Errro in Registeration",
            error,
        })
    }
}
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            });
        }
        //check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registerd",
            });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }
        //token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,

            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
};

module.exports = { signUoController, loginController };