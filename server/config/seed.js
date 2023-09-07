const db = require('./connection');
// Add models in curly brackets to import
const {  } = require('../models'); // Make sure to import the model

db.once('open', async () => {
    
  await Category.deleteMany();

  const categories = await Category.insertMany([
    { name: 'Fiction' },
    { name: 'Non-Fiction' },
    { name: 'Mystery' },
    { name: 'Science Fiction' },
    // Add more categories as needed
  ]);

  console.log('Categories seeded');

  await Book.deleteMany();

  const books = await Book.insertMany([
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'A classic novel about the American Dream.',
      condition: 'New',
      image: 'The Great Gatsby.jpg',
      category: categories[0]._id,
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      description: 'A story of racial injustice in the American South.',
      condition: 'Used',
      image: 'Mockingbird.jpg',
      category: categories[3]._id,
    },
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      description: 'An epic fantasy adventure.',
      condition: 'Like New',
      image: 'Hobbit.jpg',
      category: categories[0]._id,
    },
    // Add more book data as needed
  ]);

  console.log('Books seeded');

  await User.deleteMany();

  await User.create({
    firstName: 'Pamela',
    lastName: 'Washington',
    email: 'pamela@testmail.com',
    password: 'password12345',
    orders: [
      {
        products: [books[0]._id, books[0]._id, books[1]._id] // Update this with book IDs
      }
    ]
  });

  await User.create({
    firstName: 'Elijah',
    lastName: 'Holt',
    email: 'eholt@testmail.com',
    password: 'password12345'
  });

  console.log('Users seeded');

  process.exit();
});