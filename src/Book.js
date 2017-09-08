import React from "react";
import "./App.css";

class Book extends React.Component {
  render() {
    const { book, moveTo } = this.props;
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
            <select onChange={e => moveTo(book, e.target.value)}>
              <option value="none" disabled>
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
        <div className="book-title">{book.title}</div>
        <div className="book-authors">{book.authors.map(author => author)}</div>
      </div>
    );
  }
}

export default Book;
