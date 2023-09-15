const { User, Workouts } = require('../models');
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
   getUser: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById({_id:context.user._id}).populate('savedWorkouts');
        return user;
      }
      throw new AuthenticationError('User not authenticated');
    },
    // listWorkouts: async (_, { userId }) => {
    //   const user = await User.findById(userId).populate('savedWorkouts');
    //   return user.savedWorkouts;
    // },
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
      return { token, ...user.toObject()};
  },
    createWorkout: async (parent, { input }, context) => {
    
    if (!context.user) {
      throw new AuthenticationError('User not authenticated');
    }
    const workout = new Workouts({
      ...input,
    });
  
    await workout.save();

    await User.findByIdAndUpdate(
      {_id:context.user._id},
      { $push: { savedWorkouts: workout._id } },
      { new: true }
    );
    return workout;
  },

    updateWorkout: async (parent, { id, input }, context) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated');
      }
    
      const existingWorkout = await Workouts.findById(id);
    
      if (!existingWorkout || existingWorkout.userId.toString() !== context.user._id.toString()) {
        throw new AuthenticationError('Unauthorized');
      }
    
      const updatedWorkout = await Workouts.findByIdAndUpdate(id, input, { new: true });
    
      const user = await User.findById(context.user._id);
    
      const savedWorkouts = user.savedWorkouts.map((savedWorkout) => {
        if (savedWorkout._id.toString() === id) {
          if (input.name) savedWorkout.name = input.name;
          if (input.weight) savedWorkout.weight = input.weight;
          if (input.sets) savedWorkout.sets = input.sets;
          if (input.reps) savedWorkout.reps = input.reps;
          if (input.date) savedWorkout.date = input.date;
        }
        return savedWorkout;
      });
    
      user.savedWorkouts = savedWorkouts;
    
      // Save the updated user document
      await user.save();
    
      return updatedWorkout;
    },
    
    deleteWorkout: async (parent, { id }, context) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated');
      }

      const existingWorkout = await Workouts.findById(id);

      if (!existingWorkout || existingWorkout.userId.toString() !== context.user._id.toString()) {
        throw new AuthenticationError('Unauthorized');
      }

      await Workouts.findByIdAndRemove(id);

      await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedWorkouts: id } },
        { new: true }
      );

      return savedWorkouts; 
    },
},
};

module.exports = resolvers;