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
*   @param {function} clearQuery - Reset query and response
*   @param {function} updateQuery - Provide functionallity to search books
*/

class Search extends React.Component {
  state = {
    query: "",
    response: []
  };

  /**
  * @function
  * @name componentWillUnmount
  * @description - Call clearQuery to reset search parameters
  */
  componentWillUnmount = () => {
    this.clearQuery();
  };

  /**
  * @function
  * @name updateQuery
  * @description - Get the query and use it to seach books with the BooksAPI.
  * Check if the books are in shelf, in this case fill the background with
  * the color of the shelf.
  * @param {string} query - String to search
  */
  updateQuery = query => {
    this.setState({ query: query });
    BooksAPI.search(query)
      .then(books => {
        books.map(book => {
          book.shelf = this.props.existBookInShelf(book);
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
              <div className="books-grid">
                <div className="currentlyReading legend">Currently Reading</div>
                <div className="wantToRead legend">Want to Read</div>
                <div className="read legend">Read</div>
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
