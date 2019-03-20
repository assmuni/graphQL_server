// ### DUMMY DATA
let books = [
    { name: "Koala Kumal", genre: "Commedy", id: "1", authorId: "1" },
    { name: "Ketika Cinta Rasa Eek", genre: "Romance", id: "2", authorId: "1" },
    { name: "The Secret of Happines", genre: "Motivation", id: "3", authorId: "2" },
    { name: "The Revenant", genre: "Action", id: "4", authorId: "2" },
    { name: "The Mumy", genre: "Horor", id: "5", authorId: "2" },
    { name: "Under The Silver Lake", genre: "Mistery", id: "6", authorId: "2" }
];

let authors = [
    { name: "Raditya Dika", age: "30", id: "1" },
    { name: "JK. Rollings", age: "45", id: "2" }
];

// ############################################################################

const _ = require('lodash');

// ### IMPORT BEBERAPA GRAPHQL PROPERTY
const { 
        GraphQLObjectType, 
        GraphQLSchema ,
        GraphQLString, 
        GraphQLID,
        GraphQLInt,
        GraphQLList
} = require('graphql');

// ### MENDEFINISIKAN OBJECT TYPE
// #dan ini adalah book type yg memiliki beberapa fields type yg di wrap pada BookType
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {
            // type: GraphQLString
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
                // console.log(parent)
                return _.find(authors, {id: parent.authorId})
            }
        }
    })
});

// ### USE GraphQLList KARENA SAU AUTHOR MEMILIKI BEBERAPA BUKU

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
                return _.filter(books, { authorId: parent.id});
            }
        }
    }) 
});





// ### INI ROOT QUERY
// # nama route nya book berisi args/argument berupa book id yg akan di resolve pda ..

// ### WITH ARGUMENT/ARGS FINDING BY ID
// book(id:123){
//     name,
//     genre
// } 

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // #QUERY book(id:)
        book: {
            type: BookType,
            args: {
                id: {
                    // type: GraphQLString
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                // code to get data from db/other source
                // ### USING LODASH
                
                // console.log(_.find(books, { id: args.id }))
                return _.find(books, { id: args.id });
            }
        },
        
        // #QUERY books
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            }
        },
        
        // #QUERY author(id:)
        author: {
            type: AuthorType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args){
                return _.find(authors, { id: args.id });
            }
        },

        // #QUERY authors
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return  authors;
            }
        }
    }
});

// ### EXPORT NEW SCHEMA YG BERISIKAN QUERY MANA YG DAPAT DI AKSES PADA FRONT END
module.exports = new GraphQLSchema({
    query: RootQuery
});