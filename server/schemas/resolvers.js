const { User, Cardio, Resistance } = require('../models');
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
   user: async (parent, args, context) => {
      if (!context.user) {
        const user = await User.findById(context.user._id);
        return user;
      }
      throw new AuthenticationError('User not authenticated');
    },
    cardio: async (parent, { _id }) => {
      return await Cardio.findById(_id);
    },
    resistance: async (parent, { _id }) => {
      return await Resistance.findById(_id);
    },
    userWorkouts: async (_, { userId }) => {
      const user = await User.findById(userId).populate('savedWorkouts');
      return user.savedWorkouts;
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);

      return { token, user };
  },
    createUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
  },
    createCardio: async (parent, { cardioInput }, context) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated');
      }
    
      cardioInput.userId = context.user._id;
      const cardio = await Cardio.create(cardioInput);
      const user = await User.findByIdAndUpdate(
        context.user._id,
        { $push: { savedWorkouts: cardio._id } },
        { new: true }
      );

      return cardio;
  },
    updateCardio: async (parent, { _id, cardioInput }, context) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated');
      }
    
      const existingCardio = await Cardio.findById(_id);
      if (existingCardio.userId.toString() !== context.user._id.toString()) {
        throw new AuthenticationError('Unauthorized');
      }  

      const updatedCardio = await Cardio.findByIdAndUpdate(_id, cardioInput,
         { new: true });
    //update in user's profile as well
      await User.findByIdAndUpdate(
        context.user._id,
        { $set: { 'savedWorkouts.$[elem]': updatedCardio } },
        { arrayFilters: [{ 'elem._id': _id }], new: true }
      );
  
      return updatedCardio;
  },
    deleteCardio: async (parent, { _id }, context) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated');
      }
    
      const existingCardio = await Cardio.findById(_id);
      if (existingCardio.userId.toString() !== context.user._id.toString()) {
        throw new AuthenticationError('Unauthorized');
      }
    
      await Cardio.findByIdAndRemove(_id);
      await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedWorkouts: _id } },
        { new: true }
      );
    
      return 'Cardio workout deleted successfully';
  },
    createResistance: async (parent, { resistanceInput }, context) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated');
      }
    
      resistanceInput.userId = context.user._id;
      const resistance = await Resistance.create(resistanceInput);
    //adding to user's profile
      const user = await User.findByIdAndUpdate(
        context.user._id,
        { $push: { savedWorkouts: resistance._id } },
        { new: true }
      );
    
      return resistance;
  },
    updateResistance: async (parent, { _id, resistanceInput }, context) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated');
      }
    
      const existingResistance = await Resistance.findById(_id);
      if (existingResistance.userId.toString() !== context.user._id.toString()) {
        throw new AuthenticationError('Unauthorized');
      }
    
      const updatedResistance = await Resistance.findByIdAndUpdate(
        _id,
        resistanceInput,
        { new: true }
      );
      //updates user's profile with updatedresistance
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: context.user._id,
          'savedWorkouts._id': _id,
        },
        {
          $set: {
            'savedWorkouts.$.name': updatedResistance.name,
            'savedWorkouts.$.weight': updatedResistance.weight,
            'savedWorkouts.$.sets': updatedResistance.sets,
            'savedWorkouts.$.reps': updatedResistance.reps,
            'savedWorkouts.$.date': updatedResistance.date,
          },
        },
        { new: true }
      );
    
      return updatedResistance;
  },
    deleteResistance: async (_, { _id }, context) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated');
      }
    
      const existingResistance = await Resistance.findById(_id);
      if (existingResistance.userId.toString() !== context.user._id.toString()) {
        throw new AuthenticationError('Unauthorized');
      }
    
      const deletedResistance = await Resistance.findByIdAndRemove(_id);
      //remove from user's savedWorkouts
      await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedWorkouts: _id } },
        { new: true }
      );
    
      return deletedResistance;
  },
  },
};

module.exports = resolvers;
