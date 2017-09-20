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
* @param {array} current  -   books from the Currently Reading shelf
* @param {array} want     -   books from the Want to read shelf
* @param {array} read     -   books from the Read shelf
* @param {array} books    -   Books collection
* @method componentDidMount - receive all the books from application
* @method removeBook        - remove a book from a shelf
* @method addBook           - add book to a shelf
* @method handleChange      - handler to change books from a shelf to another
* @method updateQuery       - to search a book with BooksAPI
* @method clearQuery        - clear search parameters
*/

class BooksApp extends React.Component {
  state = {
    current: [], // Books for Currently Reading
    want: [], // Books for Want to Reading
    read: [], // Books for Read
    books: []
  };

  /**
  * @function
  * @name componentDidMount
  * @description - Use BooksAPI to get the entire collection of books in shelfs and
  * put each book in the respective virtual shelf
  */
  componentDidMount22() {
    let current = [],
      want = [],
      read = [];
    /** Map the books collection and send each book to section */
    BooksAPI.getAll().then(books => {
      books.map(
        book =>
          book.shelf === "currentlyReading"
            ? current.push(book)
            : book.shelf === "wantToRead" ? want.push(book) : read.push(book) // Shelf Is "Read"
      );
      /** Set states with books */
      this.setState({
        current: current,
        want: want,
        read: read
      });
    });
  }

  componentDidMount() {
    BooksAPI.getAll().then(books => {
      this.setState({ books });
    });
  }

  /**
  * @function
  * @name removeBook
  * @description - Remove book from actual section in local collection
  * @param {object} book  - A book that we want to remove from a shelf
  * @param {string} shelf - The name of shelf where is the book
  */
  removeBook(book, shelf) {
    switch (book.shelf) {
      case "currentlyReading":
        this.setState(state => ({
          current: state.current.filter(b => b.id !== book.id)
        }));
        break;
      case "wantToRead":
        this.setState({
          want: this.state.want.filter(b => b.id !== book.id)
        });
        break;
      case "read":
        this.setState(state => ({
          read: state.read.filter(b => b.id !== book.id)
        }));
        break;
      default:
        console.log("Por Default");
        break;
    }
  }

  /**
  * @function
  * @name addBook
  * @description - Add a book to a section in local collection
  * @param {object} book  - A book that we want to add to a shelf
  * @param {string} shelf - The name of shelf where add the book
  */
  addBook(book, shelf) {
    switch (shelf) {
      case "currentlyReading":
        this.setState(state => ({
          current: state.current.concat([book])
        }));
        break;
      case "wantToRead":
        this.setState(state => ({
          want: state.want.concat([book])
        }));
        break;
      case "read":
        this.setState(state => ({
          read: state.read.concat([book])
        }));
        break;
      default:
    }
  }

  /**
  * @function
  * @name handleChange
  * @description - Handler to change the books from a shelf to another in local collection
  * and update the book in the server
  * @param {object} book  - A book that we want to remove from a shelf
  * @param {string} shelf - The name of shelf where is the book
  */
  handleChangess = (book, shelf) => {
    /** changes in local collection */
    this.removeBook(book, shelf);
    book.shelf = shelf;
    this.addBook(book, shelf);
    /** Update Books collection in server */
    BooksAPI.update(book, shelf)
      .then(result => console.log("Books Updated: ", result))
      .catch(error => console.log("There was a problem: ", error));
  };

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
      this.addBook(book, shelf);
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
  * @description - Check if a book is in a shelf
  * @param {object} book  - A book to check
  * @param {string} shelf - The shelf where check
  */
  existBookInShelf = (book, shelf) => {
    let found = false;
    switch (shelf) {
      case "currentlyReading":
        for (let b of this.state.current) if (b.id === book.id) found = true;
        break;
      case "wantToRead":
        for (let b of this.state.want) if (b.id === book.id) found = true;
        break;
      case "read":
        for (let b of this.state.read) if (b.id === book.id) found = true;
        break;
      default:
    }
    return found;
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
