import React from "react";
import * as BooksAPI from "./BooksAPI";
import { Route, Link } from "react-router-dom";
import escapeRegExp from "escape-string-regexp";
import "./App.css";
import Shelf from "./Shelf";
import Book from "./Book";

/** @Class BooksApp
*
* @classdesc BooksApp is the main class of application.
* Route the app to home or to search
*   - In home the app list the books for each shelf
*     + Currently Reading
*     + Want to Read
*     + Read
*   - In search we can search another books
*
* @param {array} current  -   books from the Currently Reading shelf
* @param {array} want     -   books from the Want to read shelf
* @param {array} read     -   books from the Read shelf
* @param {string} query   -   Input string to search a book
* @method componentDidMount - receive all the books from application
* @method removeBook        - remove a book from a shelf
* @method addBook           - add book to a shelf
* @method handleChange      - handler to change books from a shelf to another
*/

class BooksApp extends React.Component {
  state = {
    current: [], // Books for Currently Reading
    want: [], // Books for Want to Reading
    read: [], // Books for Read,
    query: "",
    response: []
  };

  /**
  * @function
  * @name componentDidMount
  * Use BooksAPI to get the entire collection of books in shelfs and
  * put each book in the respective virtual shelf
  */
  componentDidMount() {
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

  /**
  * @function
  * @name removeBook
  * Remove book from actual section in local collection
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
  * Add a book to a section in local collection
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
  * Handler to change the books from a shelf to another in local collection
  * and update the book in the server
  * @param {object} book  - A book that we want to remove from a shelf
  * @param {string} shelf - The name of shelf where is the book
  */

  handleChange = (book, shelf) => {
    /** changes in local collection */
    this.removeBook(book, shelf);
    book.shelf = shelf;
    this.addBook(book, shelf);
    /** Update Books collection in server */
    BooksAPI.update(book, shelf).then(console.log("Books Updated"));
  };

  /**
  * @function
  * @name updateQuery
  *
  */
  updateQuery = query => {
    this.setState({ query: query.trim() });
    let showingBooks;
    if (query) {
      const match = new RegExp(escapeRegExp(query), "i");
      showingBooks = BooksAPI.search(query, 20).then(books =>
        this.setState({ response: books })
      );
    }
    console.log("showingBooks: ", showingBooks);
  };

  render() {
    return (
      <div className="app">
        <Route
          key="home"
          exact
          path="/"
          render={() => (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <Shelf
                    title="Currently Reading"
                    books={this.state.current}
                    handleChange={this.handleChange}
                  />
                  <Shelf
                    title="Want to Read"
                    books={this.state.want}
                    handleChange={this.handleChange}
                  />
                  <Shelf
                    title="Read"
                    books={this.state.read}
                    handleChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="open-search">
                <Link
                  to={{
                    pathname: "/search",
                    search: "?sort=name"
                  }}
                >
                  Add a book
                </Link>
              </div>
            </div>
          )}
        />
        <Route
          key="search"
          path="/search"
          render={() => (
            <div className="search-books">
              <div className="search-books-bar">
                <Link
                  to={{
                    pathname: "/"
                  }}
                  className="close-search"
                />
                <div className="search-books-input-wrapper">
                  <input
                    type="text"
                    value={this.state.query}
                    onChange={e => this.updateQuery(e.target.value)}
                    placeholder="Search by title or author"
                  />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">
                  {this.state.response.length > 0 ? (
                    this.state.response.map(book => (
                      <li key={book.id}>
                        <Book book={book} moveTo={this.handleChange} />
                      </li>
                    ))
                  ) : (
                    <p>There are not match</p>
                  )}
                </ol>
              </div>
            </div>
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
