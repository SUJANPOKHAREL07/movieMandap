// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear existing data (optional - be careful in production!)
  await prisma.follow.deleteMany();
  await prisma.watchlistItem.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.review.deleteMany();
  await prisma.castMember.deleteMany();
  await prisma.crewMember.deleteMany();
  await prisma.movieProductionCompany.deleteMany();
  await prisma.movieGenre.deleteMany();
  await prisma.person.deleteMany();
  await prisma.productionCompany.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.login.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "john_doe",
        email: "john@example.com",
        password: "$2b$10$hashedpassword123", // In real app, use bcrypt
        role: "user",
        verified: true,
        createdAt: new Date("2024-01-15T10:00:00Z")
      }
    }),
    prisma.user.create({
      data: {
        username: "movie_lover",
        email: "alice@example.com",
        password: "$2b$10$hashedpassword456",
        role: "user",
        verified: true,
        createdAt: new Date("2024-01-20T14:30:00Z")
      }
    }),
    prisma.user.create({
      data: {
        username: "cinema_mod",
        email: "mod@example.com",
        password: "$2b$10$hashedpassword789",
        role: "moderator",
        verified: true,
        createdAt: new Date("2024-01-10T09:15:00Z")
      }
    })
  ]);

  // Create Genres
  const genres = await Promise.all([
    prisma.genre.create({ data: { name: "Action" } }),
    prisma.genre.create({ data: { name: "Drama" } }),
    prisma.genre.create({ data: { name: "Sci-Fi" } }),
    prisma.genre.create({ data: { name: "Thriller" } }),
    prisma.genre.create({ data: { name: "Crime" } })
  ]);

  // Create Production Companies
  const companies = await Promise.all([
    prisma.productionCompany.create({
      data: {
        name: "Warner Bros. Pictures",
        logoPath: "/warner_bros_logo.png",
        originCOuntry: "US"
      }
    }),
    prisma.productionCompany.create({
      data: {
        name: "Legendary Pictures",
        logoPath: "/legendary_logo.png",
        originCOuntry: "US"
      }
    }),
    prisma.productionCompany.create({
      data: {
        name: "Castle Rock Entertainment",
        logoPath: "/castle_rock_logo.png",
        originCOuntry: "US"
      }
    })
  ]);

  // Create Movies
  const movies = await Promise.all([
    prisma.movie.create({
      data: {
        title: "Inception",
        originalTitle: "Inception",
        overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        releaseDate: new Date("2010-07-16"),
        runtime: 148,
        posterPath: "/inception_poster.jpg",
        trailerLink: "https://youtube.com/watch?v=YoHD9XEInc0",
        budget: 160000000,
        revenue: 836836967,
        status: "RELEASED",
        tagline: "Your mind is the scene of the crime.",
        adult: false
      }
    }),
    prisma.movie.create({
      data: {
        title: "The Shawshank Redemption",
        originalTitle: "The Shawshank Redemption",
        overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        releaseDate: new Date("1994-09-23"),
        runtime: 142,
        posterPath: "/shawshank_poster.jpg",
        trailerLink: "https://youtube.com/watch?v=6hB3S9bIaco",
        budget: 25000000,
        revenue: 58300000,
        status: "RELEASED",
        tagline: "Fear can hold you prisoner. Hope can set you free.",
        adult: false
      }
    })
  ]);

  // Create People
  const people = await Promise.all([
    prisma.person.create({
      data: {
        name: "Leonardo DiCaprio",
        birthDay: new Date("1974-11-11"),
        birthPlace: "Los Angeles, California, USA",
        adult: true
      }
    }),
    prisma.person.create({
      data: {
        name: "Christopher Nolan",
        birthDay: new Date("1970-07-30"),
        birthPlace: "London, England, UK",
        adult: true
      }
    }),
    prisma.person.create({
      data: {
        name: "Tim Robbins",
        birthDay: new Date("1958-10-16"),
        birthPlace: "West Covina, California, USA",
        adult: true
      }
    }),
    prisma.person.create({
      data: {
        name: "Morgan Freeman",
        birthDay: new Date("1937-06-01"),
        birthPlace: "Memphis, Tennessee, USA",
        adult: true
      }
    })
  ]);

  // Create Movie-Genre relationships
  await Promise.all([
    prisma.movieGenre.create({ data: { movieId: movies[0].id, generesId: genres[0].id } }), // Inception - Action
    prisma.movieGenre.create({ data: { movieId: movies[0].id, generesId: genres[2].id } }), // Inception - Sci-Fi
    prisma.movieGenre.create({ data: { movieId: movies[0].id, generesId: genres[3].id } }), // Inception - Thriller
    prisma.movieGenre.create({ data: { movieId: movies[1].id, generesId: genres[1].id } }), // Shawshank - Drama
    prisma.movieGenre.create({ data: { movieId: movies[1].id, generesId: genres[4].id } })  // Shawshank - Crime
  ]);

  // Create Movie-Production Company relationships
  await Promise.all([
    prisma.movieProductionCompany.create({ data: { movieId: movies[0].id, productionId: companies[0].id } }),
    prisma.movieProductionCompany.create({ data: { movieId: movies[0].id, productionId: companies[1].id } }),
    prisma.movieProductionCompany.create({ data: { movieId: movies[1].id, productionId: companies[2].id } })
  ]);

  // Create Crew Members
  await Promise.all([
    prisma.crewMember.create({
      data: {
        movieId: movies[0].id,
        personId: people[1].id, // Christopher Nolan
        department: "Directing",
        job: "Director"
      }
    }),
    prisma.crewMember.create({
      data: {
        movieId: movies[0].id,
        personId: people[1].id,
        department: "Writing",
        job: "Writer"
      }
    })
  ]);

  // Create Cast Members
  await Promise.all([
    prisma.castMember.create({
      data: {
        movieId: movies[0].id,
        personId: people[0].id, // Leonardo DiCaprio
        character: "Cobb",
        creditId: 1
      }
    }),
    prisma.castMember.create({
      data: {
        movieId: movies[1].id,
        personId: people[2].id, // Tim Robbins
        character: "Andy Dufresne",
        creditId: 2
      }
    }),
    prisma.castMember.create({
      data: {
        movieId: movies[1].id,
        personId: people[3].id, // Morgan Freeman
        character: "Ellis Boyd 'Red' Redding",
        creditId: 3
      }
    })
  ]);

  // Create Reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        title: "Mind-blowing experience!",
        content: "Christopher Nolan delivers another masterpiece that challenges perception and reality.",
        rating: "Absolute_Cinema",
        isSpoiler: false,
        userId: users[0].id,
        movieId: movies[0].id
      }
    }),
    prisma.review.create({
      data: {
        title: "A timeless classic",
        content: "The story of hope and friendship that stands the test of time.",
        rating: "Absolute_Cinema",
        isSpoiler: false,
        userId: users[1].id,
        movieId: movies[1].id
      }
    })
  ]);

  // Create Likes
  await Promise.all([
    prisma.like.create({
      data: {
        userId: users[1].id,
        reviewId: reviews[0].id
      }
    }),
    prisma.like.create({
      data: {
        userId: users[0].id,
        reviewId: reviews[1].id
      }
    })
  ]);

  // Create Comments
  await Promise.all([
    prisma.comment.create({
      data: {
        content: "Completely agree! The dream sequences were incredible.",
        userId: users[1].id,
        reviewId: reviews[0].id
      }
    }),
    prisma.comment.create({
      data: {
        content: "One of my all-time favorites!",
        userId: users[0].id,
        reviewId: reviews[1].id
      }
    })
  ]);

  // Create Watchlist Items
  await Promise.all([
    prisma.watchlistItem.create({
      data: {
        userId: users[0].id,
        movieId: movies[1].id,
        note: "Need to watch this classic"
      }
    }),
    prisma.watchlistItem.create({
      data: {
        userId: users[1].id,
        movieId: movies[0].id,
        note: "Want to rewatch for the details"
      }
    })
  ]);

  // Create Follow relationships
  await Promise.all([
    prisma.follow.create({
      data: {
        followerId: users[1].id, // movie_lover follows john_doe
        followingId: users[0].id
      }
    }),
    prisma.follow.create({
      data: {
        followerId: users[0].id, // john_doe follows movie_lover
        followingId: users[1].id
      }
    })
  ]);

  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });