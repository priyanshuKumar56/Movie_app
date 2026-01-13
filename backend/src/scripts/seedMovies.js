/**
 * IMDb Top 250 Seeder Script
 * 
 * This script seeds the database with IMDb Top 250 movies.
 * It uses hardcoded fallback data that's guaranteed to work.
 * 
 * Usage: 
 *   cd backend
 *   node src/scripts/seedMovies.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import the actual Movie model
const Movie = require('../models/Movie');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movieapp';

/**
 * Get fallback movie data with all required fields
 */
function getMovies() {
  return [
    { 
      title: "The Shawshank Redemption", 
      imdbId: "tt0111161", 
      rating: 9.3, 
      releaseDate: new Date(1994, 9, 14), 
      duration: 142, 
      genres: ["Drama"], 
      description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg",
      director: "Frank Darabont",
      featured: true
    },
    { 
      title: "The Godfather", 
      imdbId: "tt0068646", 
      rating: 9.2, 
      releaseDate: new Date(1972, 2, 24), 
      duration: 175, 
      genres: ["Crime", "Drama"], 
      description: "The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BYTJkNGQyZDgtZDQ0NC00MDM0LWEzZWQtYzUzZDEwMDljZWNjXkEyXkFqcGc@._V1_.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      director: "Francis Ford Coppola",
      featured: true
    },
    { 
      title: "The Dark Knight", 
      imdbId: "tt0468569", 
      rating: 9.0, 
      releaseDate: new Date(2008, 6, 18), 
      duration: 152, 
      genres: ["Action", "Crime", "Drama", "Thriller"], 
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
      director: "Christopher Nolan",
      featured: true
    },
    { 
      title: "The Godfather Part II", 
      imdbId: "tt0071562", 
      rating: 9.0, 
      releaseDate: new Date(1974, 11, 20), 
      duration: 202, 
      genres: ["Crime", "Drama"], 
      description: "The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNzc1OWY5MjktZDllMi00ZDEzLWEwMGItYjk1YmRhYjBjNTVlXkEyXkFqcGc@._V1_.jpg",
      director: "Francis Ford Coppola",
      featured: true
    },
    { 
      title: "12 Angry Men", 
      imdbId: "tt0050083", 
      rating: 9.0, 
      releaseDate: new Date(1957, 3, 10), 
      duration: 96, 
      genres: ["Crime", "Drama"], 
      description: "The jury in a New York City murder trial is frustrated by a single member whose skeptical caution forces them to more carefully consider the evidence before voting.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BYjE4NzdmOTYtYjc5Yi00YzBhLWEzNDEtNTgzNzU2NmE5YmEwXkEyXkFqcGc@._V1_.jpg",
      director: "Sidney Lumet",
      featured: true
    },
    { 
      title: "Schindler's List", 
      imdbId: "tt0108052", 
      rating: 9.0, 
      releaseDate: new Date(1993, 11, 15), 
      duration: 195, 
      genres: ["Biography", "Drama", "History"], 
      description: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNjM1ZDQxYWUtMzQyZS00MTE1LWJmZGYtNGUyNTdlYjM3ZmVmXkEyXkFqcGc@._V1_.jpg",
      director: "Steven Spielberg",
      featured: true
    },
    { 
      title: "The Lord of the Rings: The Return of the King", 
      imdbId: "tt0167260", 
      rating: 9.0, 
      releaseDate: new Date(2003, 11, 17), 
      duration: 201, 
      genres: ["Action", "Adventure", "Drama", "Fantasy"], 
      description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTZkMjBjNWMtZGI5OC00MGU0LTk4ZTItODg2NWM3NTVmNWQ4XkEyXkFqcGc@._V1_.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/lXhgCODAbBXL5buk9yEmTpOoOgR.jpg",
      director: "Peter Jackson",
      featured: true
    },
    { 
      title: "Pulp Fiction", 
      imdbId: "tt0110912", 
      rating: 8.9, 
      releaseDate: new Date(1994, 9, 14), 
      duration: 154, 
      genres: ["Crime", "Drama"], 
      description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
      director: "Quentin Tarantino",
      featured: true
    },
    { 
      title: "The Lord of the Rings: The Fellowship of the Ring", 
      imdbId: "tt0120737", 
      rating: 8.9, 
      releaseDate: new Date(2001, 11, 19), 
      duration: 178, 
      genres: ["Action", "Adventure", "Drama", "Fantasy"], 
      description: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNzIxMDQ2YTctNDY4MC00ZTRhLTk4ODQtMTVlOWY4NTdiYmMwXkEyXkFqcGc@._V1_.jpg",
      director: "Peter Jackson",
      featured: true
    },
    { 
      title: "The Good, the Bad and the Ugly", 
      imdbId: "tt0060196", 
      rating: 8.8, 
      releaseDate: new Date(1966, 11, 23), 
      duration: 178, 
      genres: ["Adventure", "Western"], 
      description: "A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNjJlYmNkZGItM2NhYy00MjlmLTk5NmQtNjg1NmM2ODU4OTMwXkEyXkFqcGc@._V1_.jpg",
      director: "Sergio Leone",
      featured: true
    },
    { 
      title: "Forrest Gump", 
      imdbId: "tt0109830", 
      rating: 8.8, 
      releaseDate: new Date(1994, 6, 6), 
      duration: 142, 
      genres: ["Drama", "Romance"], 
      description: "The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/ghgfzbEV7kbpbi1O8eIILKVXEA8.jpg",
      director: "Robert Zemeckis"
    },
    { 
      title: "Fight Club", 
      imdbId: "tt0137523", 
      rating: 8.8, 
      releaseDate: new Date(1999, 9, 15), 
      duration: 139, 
      genres: ["Drama"], 
      description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
      director: "David Fincher"
    },
    { 
      title: "Inception", 
      imdbId: "tt1375666", 
      rating: 8.8, 
      releaseDate: new Date(2010, 6, 16), 
      duration: 148, 
      genres: ["Action", "Adventure", "Sci-Fi", "Thriller"], 
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
      director: "Christopher Nolan"
    },
    { 
      title: "The Lord of the Rings: The Two Towers", 
      imdbId: "tt0167261", 
      rating: 8.8, 
      releaseDate: new Date(2002, 11, 18), 
      duration: 179, 
      genres: ["Action", "Adventure", "Drama", "Fantasy"], 
      description: "While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron's new ally, Saruman, and his hordes of Isengard.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BZGMxZTdjZmYtMmE2Ni00ZTdkLWI5NTgtNjlmMjBiNzU2MmI5XkEyXkFqcGc@._V1_.jpg",
      director: "Peter Jackson"
    },
    { 
      title: "Star Wars: Episode V - The Empire Strikes Back", 
      imdbId: "tt0080684", 
      rating: 8.7, 
      releaseDate: new Date(1980, 4, 21), 
      duration: 124, 
      genres: ["Action", "Adventure", "Fantasy", "Sci-Fi"], 
      description: "After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda, while his friends are pursued across the galaxy by Darth Vader.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMjE2MzQwMTgxN15BMl5BanBnXkFtZTcwMDQzNjk2OQ@@._V1_.jpg",
      director: "Irvin Kershner"
    },
    { 
      title: "The Matrix", 
      imdbId: "tt0133093", 
      rating: 8.7, 
      releaseDate: new Date(1999, 2, 31), 
      duration: 136, 
      genres: ["Action", "Sci-Fi"], 
      description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
      director: "Lana Wachowski, Lilly Wachowski"
    },
    { 
      title: "Goodfellas", 
      imdbId: "tt0099685", 
      rating: 8.7, 
      releaseDate: new Date(1990, 8, 19), 
      duration: 146, 
      genres: ["Biography", "Crime", "Drama"], 
      description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BN2E5NzI2ZGMtY2VjNi00YTRjLWI1MDUtZGY5OWU1MWJjZjRjXkEyXkFqcGc@._V1_.jpg",
      director: "Martin Scorsese"
    },
    { 
      title: "One Flew Over the Cuckoo's Nest", 
      imdbId: "tt0073486", 
      rating: 8.7, 
      releaseDate: new Date(1975, 10, 19), 
      duration: 133, 
      genres: ["Drama"], 
      description: "In the Fall of 1963, a Korean War veteran and target of anti-social behavior is relocated to a state mental hospital for evaluation.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BYmJkODkwOTItZThjZC00MTE0LWJjZWQtZTczZmNhMDY5ZjllXkEyXkFqcGc@._V1_.jpg",
      director: "Milos Forman"
    },
    { 
      title: "Interstellar", 
      imdbId: "tt0816692", 
      rating: 8.7, 
      releaseDate: new Date(2014, 10, 7), 
      duration: 169, 
      genres: ["Adventure", "Drama", "Sci-Fi"], 
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
      director: "Christopher Nolan"
    },
    { 
      title: "Se7en", 
      imdbId: "tt0114369", 
      rating: 8.6, 
      releaseDate: new Date(1995, 8, 22), 
      duration: 127, 
      genres: ["Crime", "Drama", "Mystery", "Thriller"], 
      description: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BY2IzNzMxZjctZjUxZi00YzAxLTk3ZjMtODFjODdhMDU5NDM1XkEyXkFqcGc@._V1_.jpg",
      director: "David Fincher"
    },
  ];
}

/**
 * Main seeding function
 */
async function seedDatabase() {
  console.log('\n🚀 CineSphere Movie Seeder\n');
  console.log('='.repeat(50) + '\n');
  
  try {
    // Connect to MongoDB
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const movies = getMovies();
    console.log(`💾 Seeding ${movies.length} movies...\n`);
    
    let saved = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const movie of movies) {
      try {
        // Check if already exists
        const existing = await Movie.findOne({ imdbId: movie.imdbId });
        if (existing) {
          skipped++;
          console.log(`  ⏭️  ${movie.title} (already exists)`);
          continue;
        }
        
        // Add default status
        movie.status = 'active';
        
        await Movie.create(movie);
        saved++;
        console.log(`  ✅ ${movie.title}`);
      } catch (err) {
        errors++;
        console.log(`  ❌ ${movie.title}: ${err.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`\n🎉 Seeding Complete!`);
    console.log(`   ✅ Saved: ${saved}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📊 Total in DB: ${await Movie.countDocuments()}\n`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📦 Disconnected from MongoDB\n');
  }
}

// Run the seeder
seedDatabase();
