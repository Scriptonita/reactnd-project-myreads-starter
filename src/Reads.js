import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Shelf from "./Shelf";
import "./css/App.css";

/** @function
* @name Reads
* @description - Show the books in each shelf
*
*   @param {array} current - Books in the Currently Reading Shelf
*   @param {array} want - Books in the Want to Read Shelf
*   @param {array} read - Books in the Read Shelf
*   @param {function} handleChange - function to change a book from a shelf to another
*/

const Reads = ({ books, handleChange }) => {
  Reads.propTypes = {
    books: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired
  };

  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <div>
          <Shelf
            title="Currently Reading"
            books={books.filter(b => b.shelf === "currentlyReading")}
            handleChange={handleChange}
          />

          <Shelf
            title="Want to Read"
            books={books.filter(b => b.shelf === "wantToRead")}
            handleChange={handleChange}
          />
          <Shelf
            title="Read"
            books={books.filter(b => b.shelf === "read")}
            handleChange={handleChange}
          />
        </div>
      </div>
      <div className="open-search">
        <Link
          to={{
            pathname: "/search"
          }}
        >
          Add a book
        </Link>
      </div>
    </div>
  );
};

export default Reads;
