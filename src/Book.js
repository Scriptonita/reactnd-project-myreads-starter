import React from "react";
import PropTypes from "prop-types";
import "./css/App.css";
import "./css/Book.css";

/** @function
* @name Book
* @description - Represent a Book
* @param {object} book - book description
* @param {function} moveTo - function to change the section
*/

const Book = ({ book, moveTo }) => {
  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width: 128,
            height: 193,
            backgroundImage: "url(" + book.imageLinks.thumbnail + ")"
          }}
        />
        <div className="book-shelf-changer">
          <select
            value={book.shelf}
            onChange={e =>
              e.target.value !== "none" && moveTo(book, e.target.value)}
          >
            <option value="none" disabled style={{ color: "green" }}>
              Move to...
            </option>
            <option
              disabled={book.shelf === "currentlyReading" ? true : false}
              value="currentlyReading"
            >
              Currently Reading
            </option>
            <option
              disabled={book.shelf === "wantToRead" ? true : false}
              value="wantToRead"
            >
              Want to Read
            </option>
            <option
              disabled={book.shelf === "read" ? true : false}
              value="read"
            >
              Read
            </option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
      <div className="book-box">
        <div className="book-title">{book.title}</div>
        <div className="book-authors">
          {book.authors && book.authors.map(author => author)}
        </div>
      </div>
    </div>
  );
};

Book.propTypes = {
  book: PropTypes.object.isRequired,
  moveTo: PropTypes.func.isRequired
};

export default Book;
