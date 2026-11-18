const db = require("../database/db");

const getFeed = (req, res) => {
    try {
        const profiles = db.prepare(`
            SELECT
                users.id,
                users.name,
                users.age,
                users.photo,
                users.bio,
                users.city,
                users.interests
            FROM users
            LEFT JOIN swipes
                ON users.id = swipes.profile_id
            WHERE swipes.profile_id IS NULL
        `).all();

        res.status(200).json({
            success: true,
            count: profiles.length,
            profiles
        });

    } catch (error) {
        console.error("Feed error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch profiles"
        });
    }
};

const swipeProfile = (req, res) => {
    try {
        const { profileId, action } = req.body;

        if (!profileId || !["LIKE", "PASS"].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Valid profileId and action are required"
            });
        }

        const profile = db.prepare(
            "SELECT id, name, liked_current_user FROM users WHERE id = ?"
        ).get(profileId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        const existingSwipe = db.prepare(
            "SELECT id FROM swipes WHERE profile_id = ?"
        ).get(profileId);

        if (existingSwipe) {
            return res.status(409).json({
                success: false,
                message: "You have already swiped on this profile"
            });
        }

        const processSwipe = db.transaction(() => {
            db.prepare(`
                INSERT INTO swipes (profile_id, action)
                VALUES (?, ?)
            `).run(profileId, action);

            let matched = false;

            if (action === "LIKE" && profile.liked_current_user === 1) {
                db.prepare(`
                    INSERT INTO matches (profile_id)
                    VALUES (?)
                `).run(profileId);

                matched = true;
            }

            return matched;
        });

        const matched = processSwipe();

        res.status(200).json({
            success: true,
            matched,
            ...(matched && {
                message: "It's a match!",
                match: {
                    id: profile.id,
                    name: profile.name
                }
            })
        });

    } catch (error) {
        console.error("Swipe error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to process swipe"
        });
    }
};


const getMatches = (req, res) => {
    try {
        const matches = db.prepare(`
            SELECT
                users.id,
                users.name,
                users.age,
                users.photo,
                users.bio,
                users.city,
                users.interests,
                matches.created_at
            FROM matches
            INNER JOIN users
                ON matches.profile_id = users.id
            ORDER BY matches.created_at DESC
        `).all();

        res.status(200).json({
            success: true,
            count: matches.length,
            matches
        });

    } catch (error) {
        console.error("Matches error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch matches"
        });
    }
};


module.exports = {
    getFeed,
    swipeProfile,
    getMatches
};