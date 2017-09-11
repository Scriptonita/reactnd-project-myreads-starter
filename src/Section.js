import React from "react";
import PropTypes from "prop-types";
import Book from "./Book";
import "./App.css";

/** @function
* @name Section
* Represent a Section
* There are 3 sections:
*   Currently Reading: receive book from this.props,current
*   Want to read: receive books from this.props.want
*   Read: receive books from this.props.read
*
*   @param {string} title - title of Section
*   @param {array} books - book collection for each Section
*   @param {function} handleChange - function to change the state
*/

const Section = ({ title, books, handleChange }) => {
  Section.propTypes = {
    title: PropTypes.string.isRequired,
    books: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired
  };
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">
        {title} ({books.length})
      </h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {books.map(book => (
            <li key={book.id}>
              <Book book={book} moveTo={handleChange} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Section;
