const express = require('express');
const router = express.Router();
const friends = require('../controllers/friends');
const authenticateToken = require("../middleware/authMiddleware");

router.use(express.urlencoded({ extended: true }));

router.get("/*", (req, res) => res.send("Error 404. Page Not Found."));

// Get the listing of the sent requests.
router.post("/sent-requests", authenticateToken, friends.sentRequests );

// Send the request to other user.
router.post("/send-request", authenticateToken, friends.sendRequest );

// Get the listing of the received requests.
router.post("/received-requests", authenticateToken, friends.receivedRequests );

// Update the received requests.
router.post("/update-request", authenticateToken, friends.updateRequest );


module.exports = router;