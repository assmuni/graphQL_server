const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const axios = require('axios');

const Book = require('../models/book');
const Author = require('../models/author');
const friendMongo = require('../models/friend');
const hospitalMongo = require('../models/hospital');

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        genre: {
            type: GraphQLString
        },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                // return _.find(authors, { id: parent.authorId })
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({ authorId: parent.id });
            }
        }
    })
});

const hospitalAddress = new GraphQLObjectType({
    name: 'HospitalAddress',
    fields: () => ({
        postal_code: { type: GraphQLInt },
        address : { type: GraphQLString },
        districts : { type: GraphQLString },
        phone : { type: GraphQLString },
        fax : { type: GraphQLString },
        email : { type: GraphQLString }
    })
});

const hospitalType = new GraphQLObjectType({
    name: 'HospitalType',
    description: 'ini tu buat nganu emm ngefetch data hospital gitu!',
    fields: () => ({
        code : { type: GraphQLInt },
        name : { type: GraphQLString },
        type : { type: GraphQLString },
        class : { type: GraphQLString },
        owner : { type: GraphQLString },
        location: { type: hospitalAddress },
        last_update : { type: GraphQLString }
    })
});

const userJP = new GraphQLObjectType({
    name: 'userJP',
    description: 'get data exrternal API from jsonplaceholder.typicode.com',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString }  
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                // return _.find(books, { id: args.id });
                // return console.log(args.id);
                return Book.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books;
                return Book.find({});
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                // return _.find(authors, { id: args.id });
                // return Author.findById({_id: args.id});
                return Author.findById(args.id);
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors;
                return Author.find({});
            }
        },
        // ### JSON data dengan object bersarang
        hospitals: {
            type: new GraphQLList(hospitalType),
            resolve(parent, args) {
                return hospitalMongo.find();
            }
        },
        // ### searching data mongodb
        hospitalFindByName: {
            type: new GraphQLList(hospitalType),
            args: {
                name: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                // return hospitalMongo.find({ name: { '$regex': args.name, '$options': 'i' } });
                return hospitalMongo.find({ name: {'$regex': args.name, '$options': 'i'} }).then(
                    (data) => {
                        return data;
                    }
                )
            }
        },
        // ### get data from external API
        usersJP: {
            type: new GraphQLList(userJP),
            resolve(parent, args) {
                return axios.get('https://jsonplaceholder.typicode.com/users').then((result) => {
                    return result.data;
                });
            }
        }
    }
});


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {
                    // ### VALIDASI DENGAN GraphQLNotNull
                    type: new GraphQLNonNull(GraphQLString)
                },
                age: {
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve(parent, args) {
                // ### THIS IS MODEL INSTANCE
                let authorData = new Author({
                    name: args.name,
                    age: args.age
                });

                return authorData.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                genre: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                authorId: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve(parent, args) {
                let bookData = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });

                return bookData.save();
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});