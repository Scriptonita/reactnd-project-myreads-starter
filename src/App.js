import React from "react";
import * as BooksAPI from "./BooksAPI";
import { Route, Link } from "react-router-dom";
import "./App.css";
import Section from "./Section";

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
*
*/

class BooksApp extends React.Component {
  state = {
    current: [], // Books for Currently Reading
    want: [], // Books for Want to Reading
    read: [] // Books for Read
  };

  componentDidMount() {
    let current = [],
      want = [],
      read = [];
    /**
    * Map the books collection and send each book to section
    *
    */
    BooksAPI.getAll().then(books => {
      books.map(
        book =>
          book.shelf === "currentlyReading"
            ? current.push(book)
            : book.shelf === "wantToRead" ? want.push(book) : read.push(book) // Shelf Is "Read"
      );
      /**
      * Set states with books
      *
      */
      this.setState({
        current: current,
        want: want,
        read: read
      });
    });
  }

  /**
  * Remove book from actual section in local collection
  *
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
  * Update section with the book in local collection
  *
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

  handleChange = (book, shelf) => {
    this.removeBook(book, shelf);
    book.shelf = shelf;
    this.addBook(book, shelf);

    /**
    * Update Books collection in server
    *
    */
    BooksAPI.update(book, shelf).then(console.log("Books Updated"));
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
                  <Section
                    title="Currently Reading"
                    books={this.state.current}
                    handleChange={this.handleChange}
                  />
                  <Section
                    title="Want to Read"
                    books={this.state.want}
                    handleChange={this.handleChange}
                  />
                  <Section
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
                  {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                  <input type="text" placeholder="Search by title or author" />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid" />
              </div>
            </div>
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
