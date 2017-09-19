import React from "react";
import PropTypes from "prop-types";
import Book from "./Book";
import "./css/App.css";

/** @function
* @name Shelf
* @description - Represent a shelf
* There are 3 sections:
*   Currently Reading: receive book from this.props,current
*   Want to read: receive books from this.props.want
*   Read: receive books from this.props.read
*
*   @param {string} title - title of Shelf
*   @param {array} books - book collection for each Shelf
*   @param {function} handleChange - function to change the state
*/

const Shelf = ({ title, books, handleChange }) => {
  Shelf.propTypes = {
    title: PropTypes.string.isRequired,
    books: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired
  };
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">
        {title} ({books.length})
      </h2>
      {books.length > 0 ? (
        <div className="bookshelf-books">
          <ol className="books-grid">
            {books.map(book => (
              <li key={book.id}>
                <Book book={book} moveTo={handleChange} />
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>There are not books in this shelf</p>
      )}
    </div>
  );
};

export default Shelf;
