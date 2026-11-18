const db = require("./db");

const profiles = [
    ["Aarav", 22, "https://i.pravatar.cc/300?img=12", "Love music and travelling", "Delhi", "Music, Travel", 1],
    ["Riya", 21, "https://i.pravatar.cc/300?img=47", "Coffee and books", "Noida", "Reading, Coffee", 0],
    ["Kabir", 23, "https://i.pravatar.cc/300?img=13", "Cricket enthusiast", "Mumbai", "Cricket, Fitness", 1],
    ["Ananya", 22, "https://i.pravatar.cc/300?img=44", "Art is my therapy", "Pune", "Art, Movies", 0],
    ["Ishaan", 24, "https://i.pravatar.cc/300?img=14", "Foodie and explorer", "Bangalore", "Food, Travel", 1],
    ["Meera", 21, "https://i.pravatar.cc/300?img=45", "Nature lover", "Jaipur", "Nature, Photography", 0],
    ["Arjun", 23, "https://i.pravatar.cc/300?img=15", "Football fan", "Delhi", "Football, Music", 0],
    ["Sara", 22, "https://i.pravatar.cc/300?img=46", "Dancing through life", "Noida", "Dance, Fitness", 1],
    ["Dev", 24, "https://i.pravatar.cc/300?img=16", "Tech and gaming", "Hyderabad", "Gaming, Technology", 0],
    ["Aisha", 21, "https://i.pravatar.cc/300?img=48", "Sunsets and beaches", "Goa", "Travel, Photography", 0],
    ["Reyansh", 22, "https://i.pravatar.cc/300?img=17", "Always up for an adventure", "Mumbai", "Adventure, Sports", 0],
    ["Kiara", 23, "https://i.pravatar.cc/300?img=49", "Movies and chill", "Pune", "Movies, Music", 1],
    ["Aditya", 21, "https://i.pravatar.cc/300?img=18", "Fitness enthusiast", "Delhi", "Gym, Running", 0],
    ["Myra", 22, "https://i.pravatar.cc/300?img=50", "Painting my world", "Jaipur", "Painting, Art", 0],
    ["Vivaan", 24, "https://i.pravatar.cc/300?img=19", "Music is life", "Bangalore", "Music, Guitar", 1],
    ["Tara", 21, "https://i.pravatar.cc/300?img=51", "Bookworm", "Kolkata", "Books, Writing", 0],
    ["Rohan", 23, "https://i.pravatar.cc/300?img=20", "Adventure seeker", "Chennai", "Travel, Trekking", 0],
    ["Diya", 22, "https://i.pravatar.cc/300?img=52", "Dance and laughter", "Mumbai", "Dance, Movies", 0],
    ["Krish", 24, "https://i.pravatar.cc/300?img=21", "Car enthusiast", "Noida", "Cars, Gaming", 1],
    ["Ira", 21, "https://i.pravatar.cc/300?img=53", "Minimalist living", "Delhi", "Yoga, Reading", 0],
    ["Atharv", 22, "https://i.pravatar.cc/300?img=22", "Sports lover", "Pune", "Football, Cricket", 0],
    ["Zoya", 23, "https://i.pravatar.cc/300?img=54", "Fashion and travel", "Hyderabad", "Fashion, Travel", 0],
    ["Dhruv", 21, "https://i.pravatar.cc/300?img=23", "Learning something new", "Jaipur", "Technology, Books", 1],
    ["Naina", 24, "https://i.pravatar.cc/300?img=55", "Coffee addict", "Bangalore", "Coffee, Music", 0],
    ["Manav", 22, "https://i.pravatar.cc/300?img=24", "Nature and trekking", "Dehradun", "Nature, Trekking", 0],
    ["Sia", 21, "https://i.pravatar.cc/300?img=56", "Creative soul", "Mumbai", "Art, Photography", 1],
    ["Yash", 23, "https://i.pravatar.cc/300?img=25", "Food explorer", "Delhi", "Food, Travel", 0],
    ["Avni", 22, "https://i.pravatar.cc/300?img=57", "Music and movies", "Noida", "Music, Movies", 0],
    ["Kunal", 24, "https://i.pravatar.cc/300?img=26", "Fitness and football", "Chandigarh", "Fitness, Football", 0],
    ["Pihu", 21, "https://i.pravatar.cc/300?img=58", "Always smiling", "Lucknow", "Dance, Reading", 1]
];

const insertProfile = db.prepare(`
    INSERT INTO users (name, age, photo, bio, city, interests, liked_current_user)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const seedProfiles = db.transaction(() => {
    db.prepare("DELETE FROM matches").run();
    db.prepare("DELETE FROM swipes").run();
    db.prepare("DELETE FROM users").run();

    for (const profile of profiles) {
        insertProfile.run(...profile);
    }
});

seedProfiles();

console.log(`${profiles.length} mock profiles inserted successfully!`);