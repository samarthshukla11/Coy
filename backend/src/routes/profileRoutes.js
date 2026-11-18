const express = require("express");
const router = express.Router();

const {
    getFeed,
    swipeProfile,
    getMatches
} = require("../controllers/profileController");

router.get("/feed", getFeed);
router.post("/swipe", swipeProfile);
router.get("/matches", getMatches);

module.exports = router;