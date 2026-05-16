import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookInfo from "./pages/BookInfo";
import { books } from "./data";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";

function App() {
  const [cart, setCart] = useState([]);

  // Increments quantity if the book is already in the cart; otherwise appends it as a new entry.
  function addItemToCart(book) {
    const existingItem = cart.find((item) => item.id === book.id);
    setCart((prevCart) =>
      existingItem
        ? prevCart.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prevCart, { ...book, quantity: 1 }]
    );
  }

  function updateCart(item, newQuantity) {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );
  }

  function removeItem(item) {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== item.id));
  }

  function numberOfItems() {
    return cart.reduce((total, item) => total + +item.quantity, 0);
  }

  // Computes order totals: 90% subtotal + 10% tax = original price total.
  function calcPrices() {
    const total = cart.reduce(
      (sum, item) => sum + (item.salePrice || item.originalPrice) * item.quantity,
      0
    );
    return {
      subtotal: total * 0.9,
      tax: total * 0.1,
      total,
    };
  }

  return (
    <Router>
      <div className="App">
        <Nav numberOfItems={numberOfItems()} />
        <Routes>
          <Route path="/" element={<Home books={books} />} />
          <Route path="/books" element={<Books books={books} />} />
          <Route
            path="/books/:id"
            element={<BookInfo books={books} addItemToCart={addItemToCart} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                updateCart={updateCart}
                removeItem={removeItem}
                totals={calcPrices()}
              />
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
