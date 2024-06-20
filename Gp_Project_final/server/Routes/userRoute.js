const express = require("express");

const { registerUser , loginUser, findUser, getUsers, updateUser } = require("../Controllers/userController");
const router = express.Router();



router.post("/register", registerUser) ;
router.post("/login", loginUser) ;
router.get("/find/:userId", findUser) ;
router.get("/", getUsers) ;
router.put("/:id", updateUser);
  

module.exports = router ;