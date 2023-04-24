import { gql  } from '@apollo/client'

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const USER = gql`
  query {
    me {
      favoriteGenre
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title 
      published
      genres
      author {
        name
      }
    }
  }
`

export const ALL_BOOKS_WITH_GENRE = gql`
query getallBooks($genre: String!) {
  allBooks(genre: $genre) {
    title
    published
    genres
    author {
      name
    }
  }
}
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors { 
      name
      born
      bookCount
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author{
        name
      }
    }
  }
`

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title 
    published
    genres
    author {
      name
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
${BOOK_DETAILS}
`