import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import * as BooksAPI from "./BooksAPI";
import "./css/App.css";
import "./css/Search.css";
import Book from "./Book";

/** @function
* @name Search
* @description - Show the books that match with the input
*
*   @param {string} query - Input string to search
*   @param {array} response - list of books that match with input
*   @param {function} adquireBook -
*   @param {function} clearQuery -
*   @param {function} updateQuery -
*/

class Search extends React.Component {
  state = {
    query: "",
    response: []
  };

  /**
  * @function
  * @name updateQuery
  * @description - Get the query and use it to seach books with the BooksAPI
  * @param {string} query - String to search
  */
  updateQuery = query => {
    this.setState({ query: query });
    BooksAPI.search(query)
      .then(books => {
        books.map(book => {
          this.props.existBookInShelf(book, "currentlyReading")
            ? (book.shelf = "currentlyReading")
            : this.props.existBookInShelf(book, "wantToRead")
              ? (book.shelf = "wantToRead")
              : this.props.existBookInShelf(book, "read")
                ? (book.shelf = "read")
                : (book.shelf = "none");
          return true;
        });
        this.setState({ response: books });
      })
      .catch(error => {
        console.log("No match!! ", error);
        this.setState({ response: [] });
      });
  };

  /**
  * @function
  * @name clearQuery
  * @description - Reset search parameters
  */
  clearQuery = () => {
    this.setState({
      query: "",
      response: []
    });
  };

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link
            to={{
              pathname: "/"
            }}
            className="close-search"
            onClick={this.clearQuery}
          />
          <div className="search-books-input-wrapper">
            <input
              type="text"
              value={this.state.query}
              onChange={e => this.updateQuery(e.target.value)}
              placeholder="Search by title or author"
            />
          </div>
          <div className="clear-search" onClick={this.clearQuery} />
        </div>
        <div className="search-books-results">
          {this.state.response && (
            <div>
              <p style={{ textAlign: "center" }}>
                {this.state.response.length} books
              </p>
              <div className="books-grid" style={{ textAlign: "center" }}>
                <div className="currentlyReading" style={{ width: "30%" }}>
                  Currently Reading
                </div>
                <div className="wantToRead" style={{ width: "30%" }}>
                  Want to Read
                </div>
                <div className="read" style={{ width: "30%" }}>
                  Read
                </div>
              </div>
              <br />
              <ol className="books-grid">
                {this.state.response.map(book => (
                  <li key={book.id} id={book.id} className={book.shelf}>
                    <Book book={book} moveTo={this.props.adquireBook} />
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  adquireBook: PropTypes.func.isRequired,
  existBookInShelf: PropTypes.func.isRequired
};

export default Search;
