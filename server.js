require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Movie Schema
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

// Movie Model
const Movie = mongoose.model("Movie", movieSchema);

// Add default movies when database is empty
async function addDefaultMovies() {
    // Remove old default movies
    await Movie.deleteMany({});

    await Movie.insertMany([
        {
            title: "Spider-Man: No Way Home",
            description: "Peter Parker asks Doctor Strange for help after his identity is revealed, but the spell opens the multiverse and brings dangerous villains into his world.",
            image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg"
        },
        {
            title: "The Batman",
            description: "Batman uncovers corruption in Gotham City while facing a mysterious serial killer known as the Riddler.",
            image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg"
        },
        {
            title: "Avengers: Endgame",
            description: "The surviving Avengers assemble once more to reverse the damage caused by Thanos and restore balance to the universe.",
            image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg"
        },
        {
            title: "Inception",
            description: "A skilled thief who steals secrets through dreams is offered a chance to erase his criminal past by performing an impossible task.",
            image: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"
        },
        {
            title: "Interstellar",
            description: "A group of explorers travel through a wormhole in space in search of a new home for humanity.",
            image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
        },
        {
            title: "Joker",
            description: "A struggling comedian experiences a series of events that lead him toward a violent transformation into the Joker.",
            image: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"
        },
        {
            title: "John Wick",
            description: "A retired hitman returns to his violent past after criminals steal his car and kill the last gift left by his late wife.",
            image: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg"
        },
        {
            title: "Black Panther",
            description: "T'Challa returns to Wakanda to take his rightful place as king, but faces a powerful challenger who threatens his nation.",
            image: "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg"
        }
    ]);

    console.log("movies added");
}

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
    console.log("MongoDB connected successfully");
    await addDefaultMovies();
})
.catch((error) => {
    console.log("MongoDB connection error:", error);
});

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get all movies
app.get("/api/movies", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({
            error: "Could not get movies"
        });
    }
});

// Add a movie
app.post("/api/movies", async (req, res) => {
    try {
        const movie = new Movie({
            title: req.body.title,
            description: req.body.description,
            image: req.body.image
        });

        await movie.save();
        res.status(201).json(movie);

    } catch (error) {
        res.status(500).json({
            error: "Could not add movie"
        });
    }
});

// Delete a movie
app.delete("/api/movies/:id", async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);

        res.json({
            message: "Movie deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: "Could not delete movie"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`CineVerse running at http://localhost:${PORT}`);
});