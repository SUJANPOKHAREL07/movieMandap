const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding extra reviews...');

  // 1. Get or create users
  const userNames = ['cine_critic', 'movie_buff', 'rating_pro', 'casual_viewer', 'super_fan'];
  const users = await Promise.all(
    userNames.map(username => 
      prisma.user.upsert({
        where: { username },
        update: {},
        create: {
          username,
          email: `${username}@test.com`,
          password: 'hashed_password_placeholder', // Not used for UI testing
          role: 'user',
          verified: true
        }
      })
    )
  );

  // 2. Get Inception Movie
  const inception = await prisma.movie.findUnique({ where: { title: 'Inception' } });
  if (inception) {
    console.log('Adding movie reviews for Inception...');
    const movieRatings = [
      { title: 'Must Watch!', content: 'Absolutely brilliant storytelling.', rating: 'Absolute_Cinema' },
      { title: 'Pretty good', content: 'Loved the concept, execution was great.', rating: 'Worthy' },
      { title: 'A bit confusing', content: 'I had to watch it twice but it was good.', rating: 'Good_To_Watch' },
      { title: 'Not for me', content: 'Too complicated for a Friday night.', rating: 'Bearable' },
      { title: 'Overrated', content: 'I didn\'t get the hype.', rating: 'Worst' }
    ];

    for (let i = 0; i < movieRatings.length; i++) {
      await prisma.review.upsert({
        where: { userId_movieId: { userId: users[i].id, movieId: inception.id } },
        update: { ...movieRatings[i] },
        create: { ...movieRatings[i], userId: users[i].id, movieId: inception.id }
      });
    }
  }

  // 3. Get Breaking Bad31 Series
  const bb = await prisma.series.findUnique({ where: { title: 'Breaking Bad31' } });
  if (bb) {
    console.log('Adding series reviews for Breaking Bad31...');
    const seriesRatings = [
      { title: 'Masterpiece', content: 'Best show ever made.', rating: 'Absolute_Cinema' },
      { title: 'Incredible acting', content: 'Bryan Cranston is a god.', rating: 'Absolute_Cinema' },
      { title: 'Solid drama', content: 'Slow start but gets intense.', rating: 'Worthy' },
      { title: 'Good stuff', content: 'Very well written.', rating: 'Worthy' },
      { title: 'Decent', content: 'I liked it.', rating: 'Good_To_Watch' }
    ];

    for (let i = 0; i < seriesRatings.length; i++) {
      await prisma.seriesReview.upsert({
        where: { userId_seriesId: { userId: users[i].id, seriesId: bb.id } },
        update: { ...seriesRatings[i] },
        create: { ...seriesRatings[i], userId: users[i].id, seriesId: bb.id }
      });
    }
  }

  console.log('Extra seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
