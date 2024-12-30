const express = require("express")
const {signUoController,loginController} = require("../controllers/userControllers.js")
const router = express.Router();

router.post("/signup",signUoController)
router.post("/login",loginController)


module.exports = router