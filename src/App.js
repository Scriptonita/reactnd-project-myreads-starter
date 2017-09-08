import React from "react";
import * as BooksAPI from "./BooksAPI";
import { Route, Link } from "react-router-dom";
import "./App.css";
import Book from "./Book";

class BooksApp extends React.Component {
  state = {
    current: [],
    want: [],
    read: []
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
            : book.shelf === "wantToRead" ? want.push(book) : read.push(book)
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

  handleChange = (book, shelf) => {
    /**
    * Remove book from actual section in local collection
    *
    */
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
    /**
    * Update section with the book in local collection
    *
    */
    book.shelf = shelf;
    switch (shelf) {
      case "currentlyReading":
        this.setState(state => ({
          current: state.current.push(book)
        }));
        break;
      case "wantToRead":
        this.setState(state => ({
          want: state.want.push(book)
        }));
        break;
      case "read":
        this.setState(state => ({
          read: state.read.push(book)
        }));
        break;
      default:
    }
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
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Currently Reading</h2>
                    {this.state.current.length > 0 ? (
                      <div className="bookshelf-books">
                        <ol className="books-grid">
                          {this.state.current.map(
                            book =>
                              book.shelf === "currentlyReading" && (
                                <li key={book.id}>
                                  <Book
                                    book={book}
                                    moveTo={this.handleChange}
                                  />
                                </li>
                              )
                          )}
                        </ol>
                      </div>
                    ) : (
                      <p style={{ textAlign: "center" }}>
                        There are not books in this sections
                      </p>
                    )}
                  </div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Want to Read</h2>
                    {this.state.want.length > 0 ? (
                      <div className="bookshelf-books">
                        <ol className="books-grid">
                          {this.state.want.map(
                            book =>
                              book.shelf === "wantToRead" && (
                                <li key={book.id}>
                                  <Book
                                    book={book}
                                    moveTo={this.handleChange}
                                  />
                                </li>
                              )
                          )}
                        </ol>
                      </div>
                    ) : (
                      <p style={{ textAlign: "center" }}>
                        There are not books in this sections
                      </p>
                    )}
                  </div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Read</h2>
                    {this.state.read.length > 0 ? (
                      <div className="bookshelf-books">
                        <ol className="books-grid">
                          {this.state.read.map(
                            book =>
                              book.shelf === "read" && (
                                <li key={book.id}>
                                  <Book
                                    book={book}
                                    moveTo={this.handleChange}
                                  />
                                </li>
                              )
                          )}
                        </ol>
                      </div>
                    ) : (
                      <p style={{ textAlign: "center" }}>
                        There are not books in this sections
                      </p>
                    )}
                  </div>
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
