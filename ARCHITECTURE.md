# Library — React Books E-Commerce: Architecture & Flow

## Overview

Library is a single-page React e-commerce application for purchasing books online. It is built with Create React App, uses React Router v6 for client-side navigation, and manages all shared state (cart) at the top-level `App` component via React's built-in `useState` hook — no external state library is required given the application's scope.

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| UI Framework | React 17 | Component-based view rendering |
| Routing | React Router DOM v6 | Client-side navigation between pages |
| Styling | CSS (single global stylesheet) | Responsive layout and theming |
| Icons | FontAwesome (React) | UI iconography (cart, stars, nav) |
| Fonts | Google Fonts — Roboto | Typography |
| Build Tool | Create React App (react-scripts) | Development server, bundling, optimisation |

---

## Project Structure

```
src/
├── App.js                    # Root component: routing tree + cart state
├── index.js                  # Entry point: ReactDOM render + FontAwesome library setup
├── index.css                 # Global styles, design tokens, responsive breakpoints
├── data.js                   # Static book catalogue (id, title, author, genre, price, rating, description)
│
├── pages/
│   ├── Home.jsx              # Landing page — composes all home sections
│   ├── Books.jsx             # Browse page — full catalogue with sort filter
│   ├── BookInfo.jsx          # Individual book detail page
│   └── Cart.jsx              # Shopping cart with quantity management and order confirmation
│
├── components/
│   ├── Nav.jsx               # Top navigation bar — logo, links, cart badge, mobile menu
│   ├── Footer.jsx            # Site footer — logo, navigation links, copyright
│   ├── Landing.jsx           # Hero section — headline, CTA, illustration
│   ├── Highlights.jsx        # Value proposition section — three feature cards
│   ├── Featured.jsx          # Featured books section — top-rated books grid
│   ├── CheapestBooks.jsx     # Discounted books section — sale-price filtered grid
│   ├── Explore.jsx           # Mid-page CTA — prompts user to browse the full catalogue
│   ├── Book.jsx              # Reusable book card — image preloader, skeleton loader, price, rating
│   │
│   └── ui/
│       ├── BestBooks.jsx     # Filtered book grid — rating === 5, excludes current book on detail page
│       ├── Ratings.jsx       # Star rating display — full and half-star icons
│       ├── Price.jsx         # Price display — crossed-out original price + sale price
│       └── Highlight.jsx     # Single value-proposition card — icon, title, description
│
└── assets/
    ├── Library.svg           # Brand logo
    ├── Undraw_Books.svg      # Hero illustration
    ├── empty_cart.svg        # Empty cart illustration
    ├── wave.svg              # Decorative wave divider used in the Highlights section
    └── book-*.jpeg/.jpg/.png # Supplementary book cover images
```

---

## Routing

React Router v6 manages four routes, all rendered inside a persistent `<Nav>` and `<Footer>`:

| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Landing page with hero, highlights, featured books, and CTA |
| `/books` | `Books` | Full catalogue page with sort-by filter |
| `/books/:id` | `BookInfo` | Individual book detail — description, add to cart, recommendations |
| `/cart` | `Cart` | Cart contents, quantity editor, order totals, checkout confirmation |

---

## State Management

All application state lives in `App.js` and is passed down as props. There is intentionally no Context or Redux — the cart is the only shared state and it flows through a flat, predictable prop chain.

```
App (cart state)
├── Nav          ← numberOfItems (derived from cart)
├── BookInfo     ← addItemToCart
└── Cart         ← cart, updateCart, removeItem, totals
```

### Cart Operations

| Function | Behaviour |
|---|---|
| `addItemToCart(book)` | Appends a new entry with `quantity: 1`, or increments `quantity` if the book already exists in the cart |
| `updateCart(item, qty)` | Replaces the quantity for a specific cart item |
| `removeItem(item)` | Filters the item out of the cart array |
| `numberOfItems()` | Sums all quantities for the cart badge in the nav |
| `calcPrices()` | Computes subtotal (90%), tax (10%), and total from active prices (salePrice takes priority over originalPrice) |

---

## Data Model

Each book in `data.js` conforms to this shape:

```js
{
  id: Number,           // Unique identifier — used for routing (/books/:id) and cart deduplication
  title: String,
  author: String,
  genre: String,        // e.g. "Self-Help", "Finance", "Technology"
  url: String,          // External cover image URL (Amazon CDN)
  originalPrice: Number,
  salePrice: Number | null,  // null means full price; non-null triggers sale display
  rating: Number,       // 0–5, supports half-star increments (e.g. 4.5)
  description: String,  // Editorial synopsis shown on the BookInfo page
}
```

---

## Page & Component Flow

### Home Page (`/`)

```
Home
├── Landing          → Hero headline + CTA → links to #features (anchor)
├── Highlights       → Three value-proposition cards (Quick, 10,000+ Books, Affordable)
├── Featured         → BestBooks (rating === 5, first 4) inside a purple-tinted section
├── CheapestBooks    → Books with salePrice > 0, first 8 — displayed in a responsive 4-column grid
└── Explore          → Full-width CTA linking to /books
```

### Books Page (`/books`)

```
Books
└── Sort dropdown (Low→High / High→Low / Rating)
    └── Book[] — grid of all books, re-sorted on filter change
        └── Book → image preloader → skeleton → cover image → title → Ratings → Price
```

### Book Detail Page (`/books/:id`)

```
BookInfo
├── Back link → /books
├── Book cover image
├── Title, Author (purple), Genre badge
├── Ratings + Price
├── Description paragraph
├── Add to Cart button → App.addItemToCart()
└── BestBooks (recommended — rating === 5, excluding current book)
```

### Cart Page (`/cart`)

```
Cart
├── [Empty state] → empty_cart.svg + Browse Books link
├── [Populated]
│   ├── CartHeader (Book | Quantity | Price columns)
│   ├── CartItem[] → cover image, title, unit price, Remove button, quantity input
│   └── Order Summary
│       ├── Subtotal (90% of item totals)
│       ├── Tax (10%)
│       ├── Total
│       └── Proceed to Checkout → order confirmation screen
└── [Confirmed] → success message + Continue Shopping link
```

---

## Styling Architecture

All styles are defined in a single `index.css` file using semantic class names. The design system is built around one accent colour:

- **Primary accent**: `#7342d6` (purple) — used for headings, CTAs, links, borders, and tinted backgrounds
- **Dark text**: `#242424`
- **Muted text / strikethrough prices**: `#bfbfbf`
- **Rating stars**: `#fabf2a` (gold)
- **Footer background**: `#242424`

### Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| `≤ 768px` | Book grid switches from 4-column to 2-column; book detail stacks vertically |
| `≤ 550px` | Hamburger menu replaces nav links; Highlight cards stack vertically; cart hides book cover image |

---

## Image Loading Strategy

`Book.jsx` implements a client-side image preloader: a native `Image` object is instantiated, its `src` is set to the book's cover URL, and a state update triggers only after the `onload` event fires. A ref guard (`mountedRef`) prevents state mutation if the component unmounts before the image resolves. While loading, a CSS skeleton placeholder fills the card's dimensions to prevent layout shift.

---

## Key Design Decisions

1. **Prop drilling over Context** — The cart's scope is narrow (three consumer components), making Context overhead unjustified. Prop drilling keeps the data flow explicit and debuggable.

2. **Static data file over API** — The catalogue is a local JS export, eliminating network latency, loading states, and error handling in the core browsing experience.

3. **Single CSS file** — Scoping is achieved through BEM-style class naming rather than CSS Modules or styled-components, keeping the styling layer simple and free of build tooling dependencies.

4. **External cover images** — Book covers are fetched from the Amazon media CDN, avoiding the need to bundle or host binary assets locally.
