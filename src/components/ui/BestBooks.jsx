import { books } from "../../data";
import React from "react";
import Book from "../Book";

// Renders the top-rated books (rating === 5), optionally excluding the currently viewed book.
const BestBooks = ({ id }) => {
  return (
    <div className="books">
      {books
        .filter((book) => book.rating === 5 && book.id !== +id)
        .slice(0, 4)
        .map((book) => (
          <Book book={book} key={book.id} />
        ))}
    </div>
  );
};

export default BestBooks;
