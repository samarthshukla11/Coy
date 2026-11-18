import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
    getFeed,
    swipeProfile,
    getMatches
} from "./services/api";

import "./App.css";

function App() {
    const [activeTab, setActiveTab] = useState("discover");

    const [profiles, setProfiles] = useState([]);
    const [matches, setMatches] = useState([]);

    const [loading, setLoading] = useState(true);
    const [matchesLoading, setMatchesLoading] = useState(false);
    const [isSwiping, setIsSwiping] = useState(false);

    const [match, setMatch] = useState(null);
    const [error, setError] = useState("");
    const [swipeError, setSwipeError] = useState("");

    const [dragX, setDragX] = useState(0);
    const [swipeDirection, setSwipeDirection] = useState("LIKE");

    // Directional card animation
    const cardVariants = {
        initial: {
            opacity: 0,
            scale: 0.9
        },

        animate: {
            opacity: 1,
            scale: 1
        },

        exit: (direction) => ({
            opacity: 0,
            x: direction === "LIKE" ? 400 : -400,
            rotate: direction === "LIKE" ? 25 : -25,
            transition: {
                duration: 0.3
            }
        })
    };

    // Fetch Discover profiles
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const data = await getFeed();
                setProfiles(data.profiles);
            } catch (err) {
                console.error(err);
                setError("Unable to load profiles.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    // Handle Like and Pass
    const handleSwipe = async (action) => {
        if (profiles.length === 0 || isSwiping) return;

        const currentProfile = profiles[0];

        setIsSwiping(true);
        setSwipeError("");
        setSwipeDirection(action);
        setDragX(0);

        try {
            const result = await swipeProfile(
                currentProfile.id,
                action
            );

            // Remove the swiped profile
            setProfiles((previous) =>
                previous.filter(
                    (profile) => profile.id !== currentProfile.id
                )
            );

            // Show popup only for mutual matches
            if (result.matched) {
                setMatch(result.match);
            }

        } catch (err) {
            console.error("Swipe failed:", err);

            setSwipeError(
                err.response?.data?.message ||
                "Unable to process swipe. Please try again."
            );
        } finally {
            setIsSwiping(false);
        }
    };

    // Open Matches tab
    const openMatches = async () => {
        setActiveTab("matches");
        setMatchesLoading(true);

        try {
            const data = await getMatches();
            setMatches(data.matches);
        } catch (err) {
            console.error("Unable to fetch matches:", err);
        } finally {
            setMatchesLoading(false);
        }
    };

    // Open Discover tab
    const openDiscover = () => {
        setActiveTab("discover");
        setSwipeError("");
    };

    // Open Home tab
    const openHome = () => {
        setActiveTab("home");
    };

    // Loading screen
    if (loading) {
        return (
            <div className="center">
                Loading profiles...
            </div>
        );
    }

    // Initial API error
    if (error) {
        return (
            <div className="center">
                {error}
            </div>
        );
    }

    const currentProfile = profiles[0];

    return (
        <div className="app">

            {/* Navbar */}
            <header className="navbar">

                <h1>
                    coy<span>.</span>
                </h1>

                <nav>
                    <button
                        className={
                            activeTab === "home" ? "active" : ""
                        }
                        onClick={openHome}
                    >
                        Home
                    </button>

                    <button
                        className={
                            activeTab === "discover" ? "active" : ""
                        }
                        onClick={openDiscover}
                    >
                        Discover
                    </button>

                    <button
                        className={
                            activeTab === "matches" ? "active" : ""
                        }
                        onClick={openMatches}
                    >
                        Matches
                    </button>
                </nav>

            </header>

            {/* Main Content */}
            <main className="discover">

                {/* HOME TAB */}
                {activeTab === "home" && (
                    <div className="home-tab">
                        {/* Intentionally blank as required */}
                    </div>
                )}

                {/* DISCOVER TAB */}
                {activeTab === "discover" && (
                    <>
                        <h2>Discover</h2>

                        <p className="subtitle">
                            Find someone who shares your interests.
                        </p>

                        {swipeError && (
                            <p className="error-message">
                                {swipeError}
                            </p>
                        )}

                        <div className="card-container">

                            <AnimatePresence
                                mode="wait"
                                custom={swipeDirection}
                            >

                                {currentProfile ? (

                                    <motion.div
                                        key={currentProfile.id}
                                        className="profile-card"

                                        drag="x"

                                        dragConstraints={{
                                            left: 0,
                                            right: 0
                                        }}

                                        dragElastic={0.7}

                                        onDrag={(event, info) => {
                                            setDragX(info.offset.x);
                                        }}

                                        onDragEnd={(event, info) => {
                                            if (info.offset.x > 100) {
                                                handleSwipe("LIKE");
                                            } else if (info.offset.x < -100) {
                                                handleSwipe("PASS");
                                            } else {
                                                setDragX(0);
                                            }
                                        }}

                                        variants={cardVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"

                                        transition={{
                                            duration: 0.3
                                        }}
                                    >

                                        {/* LIKE Indicator */}
                                        {dragX > 30 && (
                                            <div className="swipe-indicator like-indicator">
                                                LIKE ❤️
                                            </div>
                                        )}

                                        {/* PASS Indicator */}
                                        {dragX < -30 && (
                                            <div className="swipe-indicator pass-indicator">
                                                PASS ✕
                                            </div>
                                        )}

                                        {/* Profile Photo */}
                                        <img
                                            src={currentProfile.photo}
                                            alt={currentProfile.name}
                                            draggable="false"
                                        />

                                        {/* Profile Details */}
                                        <div className="profile-info">

                                            <h2>
                                                {currentProfile.name},{" "}
                                                {currentProfile.age}
                                            </h2>

                                            <p>
                                                📍 {currentProfile.city}
                                            </p>

                                            <p>
                                                {currentProfile.bio}
                                            </p>

                                            {/* Interests */}
                                            <div className="interests">

                                                {currentProfile.interests
                                                    .split(", ")
                                                    .map((interest) => (
                                                        <span key={interest}>
                                                            {interest}
                                                        </span>
                                                    ))}

                                            </div>

                                        </div>

                                        {/* Like and Pass Buttons */}
                                        <div className="actions">

                                            <button
                                                className="pass"
                                                disabled={isSwiping}
                                                onClick={() =>
                                                    handleSwipe("PASS")
                                                }
                                            >
                                                ✕
                                            </button>

                                            <button
                                                className="like"
                                                disabled={isSwiping}
                                                onClick={() =>
                                                    handleSwipe("LIKE")
                                                }
                                            >
                                                ♥
                                            </button>

                                        </div>

                                    </motion.div>

                                ) : (

                                    <div className="empty-state">
                                        <h2>
                                            You've seen everyone!
                                        </h2>

                                        <p>
                                            Check back later for new profiles.
                                        </p>
                                    </div>

                                )}

                            </AnimatePresence>

                        </div>
                    </>
                )}

                {/* MATCHES TAB */}
                {activeTab === "matches" && (
                    <>

                        <h2>Your Matches ❤️</h2>

                        <p className="subtitle">
                            People who liked you back.
                        </p>

                        {matchesLoading ? (

                            <p>Loading matches...</p>

                        ) : matches.length > 0 ? (

                            <div className="matches-grid">

                                {matches.map((person) => (

                                    <div
                                        className="match-card"
                                        key={person.id}
                                    >

                                        <img
                                            src={person.photo}
                                            alt={person.name}
                                        />

                                        <h3>
                                            {person.name}, {person.age}
                                        </h3>

                                        <p>
                                            📍 {person.city}
                                        </p>

                                        <span>
                                            It's a mutual match! ❤️
                                        </span>

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <div className="empty-state">

                                <h2>No matches yet!</h2>

                                <p>
                                    Keep discovering to find your match.
                                </p>

                            </div>

                        )}

                    </>
                )}

            </main>

            {/* Match Popup */}
            <AnimatePresence>

                {match && (

                    <motion.div
                        className="match-overlay"

                        initial={{ opacity: 0 }}

                        animate={{ opacity: 1 }}

                        exit={{ opacity: 0 }}
                    >

                        <motion.div
                            className="match-box"

                            initial={{ scale: 0.7 }}

                            animate={{ scale: 1 }}

                            exit={{ scale: 0.7 }}
                        >

                            <h1>
                                It's a Match! ❤️
                            </h1>

                            <p>
                                You and {match.name} liked each other.
                            </p>

                            <button
                                onClick={() => setMatch(null)}
                            >
                                Continue Discovering
                            </button>

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>

        </div>
    );
}

export default App;