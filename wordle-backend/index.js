import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import words from "./words.json" assert { type: "json" };

const typeDefs = `
  type Query {
    getWord: String!
    wordExists(word: String!): Boolean!
  }
`;

const wordSet = new Set(words);

const resolvers = {
  Query: {
    getWord: () => {
      const word = words[Math.floor(Math.random() * words.length)];
      return word;
    },
    wordExists: (root, args) => {
      if (wordSet.has(args.word)) {
        return true;
      }

      return false;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
