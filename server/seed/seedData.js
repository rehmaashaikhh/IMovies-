const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });
if (!process.env.MONGO_URI) {
  dotenv.config(); // fallback to current dir
}

const Movie = require('../models/movieModel');
const Theatre = require('../models/theatreModel');
const Show = require('../models/showModel');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Imovies';

const movies = [
  {
    movieName: 'Og',
    description: 'An action thriller featuring a fearless protagonist navigating high-stakes underworld turf wars with razor-sharp vengeance.',
    genres: ['Action', 'Thriller', 'Crime'],
    releaseDate: new Date('2025-09-25'),
    runtime: '155 min',
    certification: 'UA',
    language: 'Telugu / Hindi / English',
    posterUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    rating: 9.1,
    cast: ['Pawan Kalyan', 'Emraan Hashmi', 'Priyanka Arul Mohan'],
    director: 'Sujeeth',
    featured: true,
  },
  {
    movieName: 'Rrr',
    description: 'A tale of two legendary revolutionaries and their perilous journey away from home before they began fighting for their country in the 1920s.',
    genres: ['Action', 'Drama', 'Period'],
    releaseDate: new Date('2022-03-25'),
    runtime: '187 min',
    certification: 'UA',
    language: 'Telugu / Hindi / Tamil',
    posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=f_vbAtFSEc0',
    rating: 9.3,
    cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt', 'Ajay Devgn'],
    director: 'S.S. Rajamouli',
    featured: true,
  },
  {
    movieName: 'Baahubali 2: The Conclusion',
    description: 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.',
    genres: ['Action', 'Drama', 'Fantasy'],
    releaseDate: new Date('2017-04-28'),
    runtime: '167 min',
    certification: 'UA',
    language: 'Telugu / Hindi / Tamil',
    posterUrl: 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=G62HrubdD6o',
    rating: 9.0,
    cast: ['Prabhas', 'Rana Daggubati', 'Anushka Shetty'],
    director: 'S.S. Rajamouli',
    featured: true,
  },
  {
    movieName: 'Rajasaab',
    description: 'A romantic horror-comedy wrapped in breathtaking visual splendor and spine-chilling ancestral intrigue.',
    genres: ['Comedy', 'Horror', 'Romantic'],
    releaseDate: new Date('2025-12-05'),
    runtime: '148 min',
    certification: 'UA',
    language: 'Telugu / Hindi',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com',
    rating: 8.6,
    cast: ['Prabhas', 'Malavika Mohanan', 'Nidhhi Agerwal'],
    director: 'Maruthi',
    featured: false,
  },
  {
    movieName: 'Toxic',
    description: 'A fairy tale for grown-ups. Set in a gritty underworld crime syndicate spanning across the world.',
    genres: ['Action', 'Thriller'],
    releaseDate: new Date('2025-10-01'),
    runtime: '150 min',
    certification: 'A',
    language: 'Kannada / Hindi / English',
    posterUrl: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com',
    rating: 8.9,
    cast: ['Yash', 'Kiara Advani', 'Nayanthara'],
    director: 'Geetu Mohandas',
    featured: false,
  },
  {
    movieName: 'Avatar: The Way of Water',
    description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns, Jake must work with Neytiri to protect their home.',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    releaseDate: new Date('2025-09-30'),
    runtime: '192 min',
    certification: 'UA',
    language: 'English / Hindi',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com',
    rating: 8.8,
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
    director: 'James Cameron',
    featured: false,
  },
  {
    movieName: 'The Pride of Bharat - Chhatrapati Shivaji Maharaj',
    description: 'The monumental saga of the visionary Maratha monarch who forged Swarajya through strategic brilliance and indomitable courage.',
    genres: ['Historical', 'Drama', 'Action'],
    releaseDate: new Date('2026-01-02'),
    runtime: '165 min',
    certification: 'UA',
    language: 'Marathi / Hindi',
    posterUrl: 'https://images.unsplash.com/photo-1580130775552-25082fea50b4?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com',
    rating: 9.4,
    cast: ['Sharad Kelkar', 'Raveena Tandon'],
    director: 'Sandeep Singh',
    featured: true,
  },
];

const theatres = [
  {
    theatreName: 'Srinivasa Theatres',
    theatreId: 'THTR-SRINIVASA',
    location: 'MG Road, City Center',
    balconySeatPrice: 250,
    middleSeatPrice: 180,
    lowerSeatPrice: 120,
    balconySeats: 20,
    middleSeats: 40,
    lowerSeats: 30,
    totalScreens: 3,
  },
  {
    theatreName: 'Gokul Cinemas',
    theatreId: 'THTR-GOKUL',
    location: 'Central Avenue, Metro Square',
    balconySeatPrice: 280,
    middleSeatPrice: 200,
    lowerSeatPrice: 140,
    balconySeats: 25,
    middleSeats: 50,
    lowerSeats: 35,
    totalScreens: 4,
  },
  {
    theatreName: 'PVR IMAX Cinemas',
    theatreId: 'THTR-PVR-IMAX',
    location: 'Phoenix Mall, Tech Corridor',
    balconySeatPrice: 400,
    middleSeatPrice: 280,
    lowerSeatPrice: 190,
    balconySeats: 30,
    middleSeats: 60,
    lowerSeats: 40,
    totalScreens: 6,
  },
];

const seedDB = async () => {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connection established for seeding.');

    // Clear existing collections safely
    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Show.deleteMany({});
    await User.deleteMany({});
    await Admin.deleteMany({});

    console.log('Cleared existing data.');

    // Insert Movies
    const createdMovies = await Movie.insertMany(movies);
    console.log(`Inserted ${createdMovies.length} movies.`);

    // Insert Theatres
    const createdTheatres = await Theatre.insertMany(theatres);
    console.log(`Inserted ${createdTheatres.length} theatres.`);

    // Create Shows
    const shows = [
      {
        adminEmail: 'admin@imovies.com',
        showId: 'SHW-OG-01',
        movieId: createdMovies[0]._id.toString(),
        movieName: 'Og',
        theatreName: 'Srinivasa Theatres',
        theatreLocation: 'MG Road, City Center',
        showdate: 'Sep 25, 2026',
        showtime: '2:00 PM',
        seatPrices: { balcony: 250, middle: 180, lower: 120 },
        bookedSeats: ['M12', 'M13'],
      },
      {
        adminEmail: 'admin@imovies.com',
        showId: 'SHW-OG-02',
        movieId: createdMovies[0]._id.toString(),
        movieName: 'Og',
        theatreName: 'Srinivasa Theatres',
        theatreLocation: 'MG Road, City Center',
        showdate: 'Sep 25, 2026',
        showtime: '4:00 PM',
        seatPrices: { balcony: 250, middle: 180, lower: 120 },
        bookedSeats: [],
      },
      {
        adminEmail: 'admin@imovies.com',
        showId: 'SHW-OG-03',
        movieId: createdMovies[0]._id.toString(),
        movieName: 'Og',
        theatreName: 'Srinivasa Theatres',
        theatreLocation: 'MG Road, City Center',
        showdate: 'Sep 26, 2026',
        showtime: '9:00 PM',
        seatPrices: { balcony: 250, middle: 180, lower: 120 },
        bookedSeats: ['B1', 'B2'],
      },
      {
        adminEmail: 'admin@imovies.com',
        showId: 'SHW-GOKUL-01',
        movieId: createdMovies[0]._id.toString(),
        movieName: 'Og',
        theatreName: 'Gokul Cinemas',
        theatreLocation: 'Central Avenue',
        showdate: 'Nov 14, 2026',
        showtime: '2:00 PM',
        seatPrices: { balcony: 280, middle: 200, lower: 140 },
        bookedSeats: [],
      },
      {
        adminEmail: 'admin@imovies.com',
        showId: 'SHW-GOKUL-02',
        movieId: createdMovies[0]._id.toString(),
        movieName: 'Og',
        theatreName: 'Gokul Cinemas',
        theatreLocation: 'Central Avenue',
        showdate: 'Nov 14, 2026',
        showtime: '6:00 PM',
        seatPrices: { balcony: 280, middle: 200, lower: 140 },
        bookedSeats: ['M20', 'M21'],
      },
      {
        adminEmail: 'admin@imovies.com',
        showId: 'SHW-SHIVAJI-01',
        movieId: createdMovies[6]._id.toString(),
        movieName: 'The Pride of Bharat - Chhatrapati Shivaji Maharaj',
        theatreName: 'Gokul Cinemas',
        theatreLocation: 'Central Avenue',
        showdate: 'Jan 2, 2026',
        showtime: '8:30 PM',
        seatPrices: { balcony: 280, middle: 200, lower: 140 },
        bookedSeats: ['B10'],
      },
    ];

    const createdShows = await Show.insertMany(shows);
    console.log(`Inserted ${createdShows.length} shows.`);

    // Create demo users
    const userPass = await bcrypt.hash('user123', 10);
    const adminPass = await bcrypt.hash('admin123', 10);

    await User.create([
      {
        username: 'user_demo',
        email: 'user@imovies.com',
        password: userPass,
        role: 'user',
      },
      {
        username: 'admin_demo',
        email: 'admin@imovies.com',
        password: adminPass,
        role: 'admin',
      },
    ]);

    await Admin.create({
      username: 'admin_master',
      email: 'admin@imovies.com',
      password: adminPass,
      role: 'admin',
    });

    console.log('Seeded demo users:');
    console.log(' - User:  user@imovies.com  / user123');
    console.log(' - Admin: admin@imovies.com / admin123');

    console.log('🎉 Seed script executed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed script failed:', error.message);
    process.exit(1);
  }
};

seedDB();
