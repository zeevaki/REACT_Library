import React from "react";
import { useParams } from "react-router";
import Ratings from "../components/ui/Ratings";
import Price from "../components/ui/Price";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import BestBooks from "../components/ui/BestBooks";

const BookInfo = ({ books, addItemToCart }) => {
  const { id } = useParams();
  const book = books.find((book) => book.id === +id);

  if (!book) {
    return (
      <div id="books__body">
        <main id="books__main">
          <div className="books__container">
            <div className="row row__column" style={{ paddingTop: "60px" }}>
              <h2>Book not found.</h2>
              <Link to="/books">
                <button className="btn" style={{ marginTop: "16px" }}>
                  Back to Books
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div id="books__body">
      <main id="books__main">
        <div className="books__container">
          <div className="row">
            <div className="book__selected--top">
              <Link to="/books" className="book__link">
                <FontAwesomeIcon icon="arrow-left" />
              </Link>
              <Link to="/books" className="book__link">
                <h2 className="book__selected--title--top">Books</h2>
              </Link>
            </div>

            <div className="book__selected">
              <figure className="book__selected--figure">
                <img
                  className="book__selected--img"
                  src={book.url}
                  alt={book.title}
                />
              </figure>

              <div className="book__selected--description">
                <h2 className="book__selected--title">{book.title}</h2>

                {book.author && (
                  <p style={{ color: "#7342d6", fontWeight: "500", marginBottom: "8px" }}>
                    by {book.author}
                  </p>
                )}

                {book.genre && (
                  <span
                    style={{
                      display: "inline-block",
                      background: "rgba(115,66,214,0.1)",
                      color: "#7342d6",
                      borderRadius: "4px",
                      padding: "2px 10px",
                      fontSize: "14px",
                      marginBottom: "12px",
                    }}
                  >
                    {book.genre}
                  </span>
                )}

                <Ratings rating={book.rating} />

                <div className="book__selected--price">
                  <Price
                    originalPrice={book.originalPrice}
                    salePrice={book.salePrice}
                  />
                </div>

                <div className="book__summary">
                  <h3 className="book__summary--title">Summary</h3>
                  <p className="book__summary--para">
                    {book.description}
                  </p>
                </div>

                <button className="btn" onClick={() => addItemToCart(book)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="books__container">
          <div className="row">
            <div className="book__selected--top">
              <h2 className="book__selected--title--top">Recommended Books</h2>
            </div>
            <BestBooks id={id} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookInfo;
