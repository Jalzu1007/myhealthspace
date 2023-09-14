const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets- ask question to james
app.use('/images', express.static(path.join(__dirname, '../client/images')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

//Stripe Donation service
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { amount } = req.body; 
    
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: 'usd', 
        product_data: {
          name: 'Donation', 
        },
        unit_amount: amount, 
      },
      quantity: 1,
    },
  ],
  mode: 'payment',
  success_url: 'http://localhost:3000/profile',
  cancel_url: 'http://localhost:3000/profile', 
});

res.status(200).json({ sessionId: session.id });
} catch (error) {
console.error('Error creating Stripe session:', error);
res.status(500).json({ error: 'Unable to create Stripe session' });
}
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
  };
  
// Call the async function to start the server
  startApolloServer();
 