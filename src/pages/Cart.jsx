import React, { useState } from "react";
import { Link } from "react-router-dom";
import EmptyCart from "../assets/empty_cart.svg";

const Cart = ({ cart, updateCart, removeItem, totals }) => {
  const [orderPlaced, setOrderPlaced] = useState(false);

  function handleCheckout() {
    setOrderPlaced(true);
  }

  if (orderPlaced) {
    return (
      <div id="books__body">
        <main id="books__main">
          <div className="books__container">
            <div className="row row__column" style={{ paddingTop: "60px", gap: "16px" }}>
              <h2>Order Confirmed!</h2>
              <p style={{ fontSize: "18px", color: "#555", textAlign: "center" }}>
                Thank you for your purchase. Your books will be delivered shortly.
              </p>
              <Link to="/books">
                <button className="btn" style={{ marginTop: "16px" }}>
                  Continue Shopping
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
              <h2 className="cart__title">Cart</h2>
            </div>
            <div className="cart">
              <div className="cart__header">
                <span className="cart__book">Book</span>
                <span className="cart__quantity">Quantity</span>
                <span className="cart__total">Price</span>
              </div>
              <div className="cart__body">
                {cart.map((item) => {
                  const itemPrice = item.salePrice || item.originalPrice;
                  return (
                    <div className="cart__item" key={item.id}>
                      <div className="cart__book">
                        <img
                          className="cart__book--img"
                          src={item.url}
                          alt={item.title}
                        />
                        <div className="cart__book--info">
                          <span className="cart__book--title">{item.title}</span>
                          <span className="cart__book--price">
                            ${itemPrice.toFixed(2)}
                          </span>
                          <button
                            className="cart__book--remove"
                            onClick={() => removeItem(item)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="cart__quantity">
                        <input
                          type="number"
                          className="cart__input"
                          min={1}
                          max={99}
                          value={item.quantity}
                          onChange={(event) =>
                            updateCart(item, event.target.value)
                          }
                        />
                      </div>
                      <div className="cart__total">
                        ${(itemPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}

                {(!cart || !cart.length) && (
                  <div className="cart__empty">
                    <img
                      className="cart__empty--img"
                      src={EmptyCart}
                      alt="Empty cart"
                    />
                    <h2>Your cart is empty</h2>
                    <Link to="/books">
                      <button className="btn">Browse Books</button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {cart && cart.length > 0 && (
              <div className="total">
                <div className="total__item total__sub-total">
                  <span>Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="total__item total__tax">
                  <span>Tax</span>
                  <span>${totals.tax.toFixed(2)}</span>
                </div>
                <div className="total__item total__price">
                  <span>Total</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
                <button className="btn btn__checkout" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
