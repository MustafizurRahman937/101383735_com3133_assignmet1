const Employee = require('../models/Employee');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const resolvers = {
  Query: {
    // Login logic could be implemented here. 
    // Note: Returning password is a bad practice. This is just to align with your typeDefs
    login: async (_, { username, email, password }) => {
      // Ideally, you should use either username or email to log in, not both.
      const user = await User.findOne({ $or: [{ username }, { email }] });
      if (!user) {
        throw new Error('User not found');
      }
      const isMatch = await bcrypt.compare(password);
      if (!isMatch) {
        throw new Error('Incorrect password');
      }
      return user;
    },
    getAllEmployees: async () => {
      return await Employee.find({});
    },
    searchEmployeeById: async (_, { eid }) => {
      return await Employee.findById(eid);
    },
  },
  Mutation: {
    signup: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        throw new Error('User already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      return user;
    },
    addNewEmployee: async (_, { first_name, last_name, email, gender, salary }) => {
      const newEmployee = new Employee({ first_name, last_name, email, gender, salary });
      await newEmployee.save();
      return newEmployee;
    },
    updateEmployeeById: async (_, { eid, first_name, last_name, email, gender, salary }) => {
      const updatedEmployee = await Employee.findByIdAndUpdate(eid, { first_name, last_name, email, gender, salary }, { new: true });
      return updatedEmployee;
    },
    deleteEmployeeById: async (_, { eid }) => {
      await Employee.findByIdAndDelete(eid);
      return "Employee deleted successfully";
    },
  },
};

module.exports = resolvers;