import React from "react";
import * as BooksAPI from "./BooksAPI";
import { Route } from "react-router-dom";
import Reads from "./Reads";
import Search from "./Search";
import "./css/App.css";
import "./css/Search.css";

/** @Class BooksApp
*
* @classdesc - BooksApp is the main class of application.
* @description - Route the app to home or to search
*   - In home the app list the books for each shelf
*     + Currently Reading
*     + Want to Read
*     + Read
*   - In search we can search another books
*
* @param {array} books    -   Books collection
* @method componentDidMount - receive all the books from application
* @method handleChange      - handler to change books from a shelf to another
* @method adquireBooks      - handler to add books from search
* @method updateQuery       - to search a book with BooksAPI
* @method existBookInShelf  - check if exist a book in books
*/

class BooksApp extends React.Component {
  state = {
    books: []
  };

  /**
  * @function
  * @name componentDidMount
  * @description - Use BooksAPI to get the entire collection of books in shelfs and
  * put each book in the respective virtual shelf
  */
  componentDidMount() {
    BooksAPI.getAll().then(books => {
      this.setState({ books });
    });
  }

  /**
  * @function
  * @name handleChange
  * @description - Handler to change the books from a shelf to another in local collection
  * and update the book in the server
  * @param {object} book  - A book that we want to remove from a shelf
  * @param {string} shelf - The name of shelf where is the book
  */
  handleChange = (book, shelf) => {
    if (book.shelf !== shelf) {
      BooksAPI.update(book, shelf).then(() => {
        book.shelf = shelf;
        this.setState(state => ({
          books: state.books.filter(b => b.id !== book.id).concat([book])
        }));
      });
    }
  };

  /**
  * @function
  * @name adquireBook
  * @description - Add a book from BooksAPI.search to a shelf or move to another shelf from search
  * @param {object} book  - A book to add
  * @param {string} shelf - The shelf where add the book
  */
  adquireBook = (book, shelf) => {
    console.log("Shelf to adquire book: " + shelf);
    document.getElementById(book.id).classList.remove(book.shelf);
    if (book.shelf === "none") {
      //this.addBook(book, shelf);
      book.shelf = shelf;
      this.setState(state => ({
        books: state.books.concat([book])
      }));
      BooksAPI.update(book, shelf)
        .then(result => console.log("Books Updated: ", result))
        .catch(error => console.log("There was a problem: ", error));
    } else {
      //document.getElementById(book.id).classList.remove(book.shelf);
      this.handleChange(book, shelf);
    }
    document.getElementById(book.id).classList.add(shelf);
  };

  /**
  * @function
  * @name existBookInShelf
  * @description - Check if a book is in books
  * @param {object} book  - A book to check
  */
  existBookInShelf = book => {
    let shelf = "none";
    this.state.books.map(b => {
      if (b.id === book.id) shelf = b.shelf;
    });
    return shelf;
  };

  render() {
    return (
      <div className="app">
        <Route
          key="home"
          exact
          path="/"
          render={() => (
            <Reads books={this.state.books} handleChange={this.handleChange} />
          )}
        />
        <Route
          key="search"
          path="/search"
          render={() => (
            <Search
              adquireBook={this.adquireBook}
              existBookInShelf={this.existBookInShelf}
            />
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
