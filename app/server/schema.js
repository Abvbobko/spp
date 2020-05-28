var { buildSchema } = require('graphql');

let appSchema = buildSchema(`

    type Query {        
        statuses: [Status]
        tasks(token: String): [Task]        
    },

    type Mutation {
        login(login: String!, password: String!): String
        signup(login: String!, password: String!): String               
        deleteNote(id: Int!): Boolean
    }

    type Status {
        id: Int
        name: String!        
    }

    type User {        
        login: String
        password: String
        token: String
    },

    type Task {
        id: Int
        text: String        
        status: String
        file_name: String
        name_on_server: String        
        date: String        
    }
`);
module.exports = { appSchema };