const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../utils/logger');

/**
 * Scrape IMDb Top 250 movies
 */
const scrapeImdbTop250 = async () => {
  try {
    const url = process.env.IMDB_TOP_250_URL || 'https://www.imdb.com/chart/top';

    logger.info(`Scraping IMDb Top 250 from: ${url}`);

    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 30000,
    });

    const $ = cheerio.load(response.data);
    const movies = [];

    // Parse movie list
    $('tbody.lister-list tr').each((index, element) => {
      try {
        const titleColumn = $(element).find('.titleColumn');
        const ratingColumn = $(element).find('.ratingColumn.imdbRating');

        const title = titleColumn.find('a').text().trim();
        const year = titleColumn.find('.secondaryInfo').text().replace(/[()]/g, '').trim();
        const imdbLink = titleColumn.find('a').attr('href');
        const imdbId = imdbLink ? imdbLink.match(/\/title\/(tt\d+)\//)?.[1] : null;
        const rating = parseFloat(ratingColumn.find('strong').text().trim());

        if (title && imdbId) {
          movies.push({
            title,
            releaseDate: new Date(`${year}-01-01`),
            rating,
            imdbId,
            description: `${title} is ranked #${index + 1} in IMDb's Top 250 movies.`,
            duration: 120, // Default duration, will be updated by TMDB
            genres: ['Drama'], // Default genre, will be updated by TMDB
            posterUrl: `https://via.placeholder.com/300x450?text=${encodeURIComponent(title)}`,
            status: 'active',
          });
        }
      } catch (error) {
        logger.error(`Error parsing movie at index ${index}:`, error.message);
      }
    });

    logger.info(`Successfully scraped ${movies.length} movies from IMDb`);
    return movies;
  } catch (error) {
    logger.error('IMDb scraping failed:', error.message);
    throw new Error(`Failed to scrape IMDb: ${error.message}`);
  }
};

/**
 * Enrich movie data with TMDB API
 */
const enrichWithTMDB = async (imdbId) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      logger.warn('TMDB API key not configured');
      return null;
    }

    const baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

    // Find movie by IMDb ID
    const findResponse = await axios.get(`${baseUrl}/find/${imdbId}`, {
      params: {
        api_key: apiKey,
        external_source: 'imdb_id',
      },
    });

    const movieResults = findResponse.data.movie_results;
    if (!movieResults || movieResults.length === 0) {
      return null;
    }

    const tmdbMovie = movieResults[0];

    // Get detailed movie info
    const detailsResponse = await axios.get(`${baseUrl}/movie/${tmdbMovie.id}`, {
      params: {
        api_key: apiKey,
        append_to_response: 'credits,videos',
      },
    });

    const details = detailsResponse.data;

    return {
      tmdbId: details.id.toString(),
      description: details.overview || '',
      duration: details.runtime || 120,
      genres: details.genres.map((g) => g.name),
      posterUrl: details.poster_path
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : null,
      backdropUrl: details.backdrop_path
        ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
        : null,
      director: details.credits?.crew?.find((c) => c.job === 'Director')?.name || '',
      cast: details.credits?.cast?.slice(0, 10).map((c) => ({
        name: c.name,
        character: c.character,
        profileUrl: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null,
      })) || [],
      trailerUrl: details.videos?.results?.find((v) => v.type === 'Trailer')?.key
        ? `https://www.youtube.com/watch?v=${details.videos.results.find((v) => v.type === 'Trailer').key}`
        : null,
      budget: details.budget || 0,
      revenue: details.revenue || 0,
      language: details.original_language || 'en',
      country: details.production_countries?.[0]?.iso_3166_1 || 'US',
    };
  } catch (error) {
    logger.error(`TMDB enrichment failed for ${imdbId}:`, error.message);
    return null;
  }
};

/**
 * Scrape and enrich movies
 */
const scrapeAndEnrichMovies = async () => {
  try {
    const movies = await scrapeImdbTop250();

    // Enrich with TMDB data (with rate limiting)
    const enrichedMovies = [];

    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];

      try {
        const tmdbData = await enrichWithTMDB(movie.imdbId);

        if (tmdbData) {
          enrichedMovies.push({
            ...movie,
            ...tmdbData,
          });
        } else {
          enrichedMovies.push(movie);
        }

        // Rate limiting: wait 250ms between requests (4 requests per second)
        if (i < movies.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 250));
        }

        if ((i + 1) % 10 === 0) {
          logger.info(`Enriched ${i + 1}/${movies.length} movies`);
        }
      } catch (error) {
        logger.error(`Failed to enrich movie ${movie.title}:`, error.message);
        enrichedMovies.push(movie);
      }
    }

    logger.info(`Successfully enriched ${enrichedMovies.length} movies`);
    return enrichedMovies;
  } catch (error) {
    logger.error('Scrape and enrich failed:', error);
    throw error;
  }
};

/**
 * Get movie details from OMDb API (alternative)
 */
const getMovieFromOMDb = async (imdbId) => {
  try {
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
      return null;
    }

    const baseUrl = process.env.OMDB_BASE_URL || 'http://www.omdbapi.com';

    const response = await axios.get(baseUrl, {
      params: {
        apikey: apiKey,
        i: imdbId,
        plot: 'full',
      },
    });

    const data = response.data;

    if (data.Response === 'False') {
      return null;
    }

    return {
      title: data.Title,
      description: data.Plot,
      rating: parseFloat(data.imdbRating) || 0,
      duration: parseInt(data.Runtime) || 120,
      releaseDate: new Date(data.Released),
      genres: data.Genre ? data.Genre.split(', ') : [],
      posterUrl: data.Poster !== 'N/A' ? data.Poster : null,
      director: data.Director,
      cast: data.Actors
        ? data.Actors.split(', ').map((name) => ({ name, character: '', profileUrl: null }))
        : [],
      imdbId: data.imdbID,
      language: data.Language,
      country: data.Country,
    };
  } catch (error) {
    logger.error(`OMDb fetch failed for ${imdbId}:`, error.message);
    return null;
  }
};

module.exports = {
  scrapeImdbTop250,
  enrichWithTMDB,
  scrapeAndEnrichMovies,
  getMovieFromOMDb,
};
