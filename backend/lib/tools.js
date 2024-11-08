const { z } = require('zod');
const { generateText, tool } = require('ai');
const { llama } = require('./model');
const {
  checkBorrowedBooks,
  searchBookByTitle,
  searchBookByAuthor,
  searchBookByGenre,
  checkPendingFines,
  getAvailableBooks,
  getBookLocation,
  getGeneralKnowledge
} = require('./helpers');  // Import from helpers.js

const callTools = async (prompt, authData = { id: "123" }) => {
  const result = await generateText({
    model: llama,
    system: `
      You are a highly intelligent library management system designed to assist users with various book-related queries.
      Users may ask about book availability, search for books by title, author, or genre, check their borrowed books, or inquire about pending fines.
      Your goal is to understand the user's intent and provide accurate and helpful responses based on the available tools.
      Ensure that your responses are clear, concise, and directly address the user's query.
    `,
    tools: {
      invalidRequest: tool({
        description: 'Handle invalid or unavailable requests',
        parameters: z.object({}),
        execute: async () => {
          return { error: 'Invalid request' };
        },
      }),
      searchBook: tool({
        description: 'Search for a book by its title. The query should include the book name.',
        parameters: z.object({
          name: z.string().describe('The title of the book to search for'),
        }),
        execute: async ({ name }) => {
          return searchBookByTitle(name);  // Uses updated helper function
        },
      }),
      searchBookByAuthor: tool({
        description: 'Search for books by a specific author. Example: "Find books by J.K. Rowling".',
        parameters: z.object({
          author: z.string().describe('The name of the author to search for'),
        }),
        execute: async ({ author }) => {
          return searchBookByAuthor(author);  // Uses updated helper function
        },
      }),
      searchBookByGenre: tool({
        description: 'Search for books within a specific genre. The genre need not be case sensitive, so ignore the alphabet case in the database and the query when the genre is mentioned by the user. Example: "Find romance novels".',
        parameters: z.object({
          genre: z.enum([
            "horror", "romance", "comedy", "drama", "mystery", "thriller", "science fiction", "fantasy", "non-fiction", "history", "biography", "fiction", "self-help", "poetry", "dystopian"
          ]).describe('The genre of the books to search for'),
        }),
        execute: async ({ genre }) => {
          return searchBookByGenre(genre);  // Uses updated helper function
        },
      }),
      borrowedBooks: tool({
        description: 'Retrieve a list of books currently borrowed by the user, including due dates and overdue status.',
        parameters: z.object({}),
        execute: async () => {
          // Uses the updated checkBorrowedBooks function to get the borrowed books along with due dates and overdue info
          return checkBorrowedBooks(authData.id);  // Uses helper function
        },
      }),
      pendingFines: tool({
        description: 'Fetch the current pending fines for the user, based on overdue borrowed books.',
        parameters: z.object({}),
        execute: async () => {
          // Uses the updated checkPendingFines function to calculate fines for overdue books
          return checkPendingFines(authData.id);  // Uses helper function
        },
      }),
      getLocationOfBook: tool({
        description: 'Provide the location of a particular book or books by a particular author or genre in the library, including section and column.',
        parameters: z.object({
          title: z.string().optional().describe('The title of the book to search for'),
          author: z.string().optional().describe('The author of the books to search for'),
          genre: z.string().optional().describe('The genre of the books to search for')
        }),
        execute: async ({ title, author, genre }) => {
          return getBookLocation({ title, author, genre });  // Uses helper function
        },
      }),

      availableBooks: tool({
        description: 'Retrieve a list of all books in the library that are currently available (i.e., books with available_copies greater than 0).',
        parameters: z.object({}),
        execute: async () => {
          return getAvailableBooks();  // Uses helper function
        },
      }),
    //   getInfoAbout: tool({
    //     description: 'If user asks for information such as abstract, introduction, reviews, ratings, or summaries of a book, provide a generic response',
    //     parameters: z.object({
    //       userPrompt: z.string().describe('The user query or prompt'),
    //       author: z.string().optional().describe('The author of the book'),
    //       title: z.string().optional().describe('The title of the book'),
    //     }),
    //     execute: async ({userPrompt, author, title}) => {
          
    //       const resource = y()
          
    //       const x = await generateText({
    //         model: llama,
    //         system: `You are a book lover, and you need to repond to queries such as abstract, introduction, reviews, ratings, or summaries of a book, provide a generic response`,
    //         prompt: `Data: ${resource.data}\nUser Prompt: ${userPrompt}\nResponse:`
    //       })
          
    //       console.log(userPrompt, x.text);
          
    //       return {
    //         isFromDB: resource.db,
    //         response: x.text
    //       }
    //       // return getAvailableBooks();  // Uses helper function
    //     },
    //   }),
    },
    prompt: prompt,
    toolChoice: "required",
  });

  // console.log(JSON.stringify(result, null, 2));
  
  return result;
};

module.exports = { callTools };

// const y =  await getGeneralKnowledge({author: "", title: "the lord of the rings"})
// console.log(y)

// const x = await callTools("Give summary of the 2nd harry potter book by J.K. Rowling")
// console.log(x)
