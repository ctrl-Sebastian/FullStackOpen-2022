const config = require('./utils/config')
const logger = require('./utils/logger')

const mongoose = require('mongoose')
const { UserInputError } = require('apollo-server-errors');
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const jwt = require('jsonwebtoken')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })


  let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }

  input AuthorInput {
    name: String!
    born: Int 
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String
      genres: [String!]!
    ): Book!

    editAuthor (
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      if (args.author) {
        const foundAuthor = await Author.findOne({ name: args.author })

        if (foundAuthor) {
          if (args.genre) {
            return await Book.find({ author: foundAuthor.id, genres: { $in: [args.genre] } }).populate('author')
          }
          return  await Book.find({ author: foundAuthor.id }).populate('author')
        }
        return null
      }

      if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate('author')
      }

      return Book.find({}).populate('author')
    },

    allAuthors: async () => await Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author:{
    bookCount: async (root) => {
      const author = await Author.findOne({ name: root.name })
      const books = await Book.find({ author: author.id})
      return books.length
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      const foundBook = await Book.findOne({ title: args.title })
      const foundAuthor = await Author.findOne({ name: args.author })

      if (!currentUser) {
        throw new UserInputError('Not authenticated', {
          invalidArgs: args,
        })
      }

      if (foundBook) {
        throw new UserInputError('Book alreeady exists', {
          invalidArgs: args,
        })
      }

      if (!foundAuthor) {
        const author = new Author({ name: args.author, bookCount: 1 })
        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }
      let book = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: foundAuthor
      })

      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return book
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      const author = await Author.findOne({ name: args.name })
      
      if (!currentUser) {
        throw new UserInputError('Not authenticated', {
          invalidArgs: args,
        })
      }

      if (!author) {
        return null
      }
      
      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      return author
    },

    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre})
  
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })       
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, config.JWT_SECRET) }
    },
  }
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: config.PORT },
  context: async ({ req, res }) => {
  const auth = req ? req.headers.authorization : null
  if (auth && auth.startsWith('Bearer ')) {
    const decodedToken = jwt.verify(
      auth.substring(7), config.JWT_SECRET
    )
    const currentUser = await User
      .findById(decodedToken.id)
    return { currentUser }
  }
},
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})