const express = require("express");
const router = express.Router();
const chat = require("../controllers/chat");
const authenticateToken = require("../middleware/authMiddleware")

router.use(express.urlencoded({ extended: true }));

router.get("/*", (req, res) => res.send("Error 404. Page Not Found."));

router.post("/create", chat.createChat );
router.post("/get-chat", authenticateToken, chat.getChat );

module.exports = router;