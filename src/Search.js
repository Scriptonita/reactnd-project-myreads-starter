import React from "react";
import { Link } from "react-router-dom";
import "./css/App.css";
import "./css/Search.css";
import Book from "./Book";

const Search = ({ query, response, adquireBook, clearQuery, updateQuery }) => {
  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link
          to={{
            pathname: "/"
          }}
          className="close-search"
          onClick={clearQuery}
        />
        <div className="search-books-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={e => updateQuery(e.target.value)}
            placeholder="Search by title or author"
          />
        </div>
        <div className="clear-search" onClick={clearQuery} />
      </div>
      <div className="search-books-results">
        {response && (
          <div>
            <p style={{ textAlign: "center" }}>{response.length} books</p>
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
              {response.map(book => (
                <li key={book.id} id={book.id} className={book.shelf}>
                  <Book book={book} moveTo={adquireBook} />
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
