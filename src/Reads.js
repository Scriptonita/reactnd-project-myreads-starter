import React from "react";
import "./App.css";
import { Link } from "react-router-dom";
import Shelf from "./Shelf";
import Book from "./Book";

const Reads = ({ current, want, read, handleChange }) => {
  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <div>
          <Shelf
            title="Currently Reading"
            books={current}
            handleChange={handleChange}
          />

          <Shelf
            title="Want to Read"
            books={want}
            handleChange={handleChange}
          />
          <Shelf title="Read" books={read} handleChange={handleChange} />
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
