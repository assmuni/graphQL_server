const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

// mongoose open connections + even listener
// mongoose.connect('mongodb://localhost/portofolio', {useNewUrlParser: true});
mongoose.connect('mongodb://userGraphql:userGraphql123@ds157509.mlab.com:57509/portofolio', {useNewUrlParser: true});
mongoose.connection.once('open', () => {
    console.info('mongoDB connected');
});

// const schema = require('./schema/schema(dummy_data)');
const schema = require('./schema/schema');

const app = express();

// ###SET graphqlHTTP sebagai middleware ketika melakukan route ke /graphql
// dan kita menjalanka schema yg di buat di dalamnya
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));


app.listen(4000, () => { 
    console.info('Server listening in port 4000') 
});