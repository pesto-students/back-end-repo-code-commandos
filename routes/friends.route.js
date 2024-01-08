const express = require('express');
const router = express.Router();
const friends = require('../controllers/friends');
const authenticateToken = require("../middleware/authMiddleware");

router.use(express.urlencoded({ extended: true }));

router.get("/*", (req, res) => res.send("Error 404. Page Not Found."));

router.post("/sent-requests", authenticateToken, friends.sentRequests );

router.post("/send-request", authenticateToken, friends.sendRequest );

router.post("/received-requests", authenticateToken, friends.receivedRequests );

router.post("/update-request", authenticateToken, friends.updateRequest );


module.exports = router;