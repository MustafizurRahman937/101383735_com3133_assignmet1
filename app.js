const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolver');


async function startServer() {
    const app = express();
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });
    //Change this part to your own MongoDB link
    await mongoose.connect('mongodb+srv://mostafizurregina:assignment01@cluster0.kv5asxb.mongodb.net/comp3133_assignment01?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Could not connect to MongoDB', err));

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}${apolloServer.graphqlPath}`);
    });
}

startServer();

