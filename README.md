# FoodSocket

FoodSocket is a modern web application for buying groceries and food items online, with a unique "Buy Now, Pay Later" feature. The site is designed for users in Ibadan and its environs, providing a seamless experience for browsing products, managing a cart, signing up, and checking out.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup & Usage](#setup--usage)
- [Pages Overview](#pages-overview)
- [Scripts Overview](#scripts-overview)
- [JSON Data](#json-data)
- [Styling](#styling)
- [Accessibility & Responsiveness](#accessibility--responsiveness)
- [Contact](#contact)
- [License](#license)

---

## Features

- **Browse Products:** View the cheapest product in each category on the homepage, or browse all products by category.
- **Cart Management:** Add products to cart, adjust quantity, view cart overlay, and clear cart.
- **User Authentication:** Sign up and log in with email, password strength meter, and session management.
- **Checkout:** Simulated payment flows for card and mobile transfer, with order summary and shipping details.
- **FAQs & About:** Informative pages about FoodSocket and frequently asked questions.
- **Responsive Design:** Mobile-friendly navigation, forms, and product displays.
- **Accessibility:** Keyboard navigation, ARIA roles, and focus management.

---

## Project Structure

```
foodstuff/
│
├── css/                   # Stylesheets
│   ├── main.css           # Main stylesheet
│   └── ...                 # Other CSS files
│
├── images/                # Product images
│   ├── rice.jpg          # Example image
│   └── ...                 # Other images
│
├── js/                    # JavaScript files
│   ├── homepage.js        # Homepage scripts
│   ├── product.js         # Product listing scripts
│   ├── cart.js            # Shopping cart scripts
│   ├── login.js           # Login scripts
│   ├── sign-up.js         # Sign-up scripts
│   └── checkout.js        # Checkout scripts
│
├── jsons/                 # JSON data files
│   ├── beans.json        # Example data file
│   └── ...                 # Other data files
│
├── index.html             # Homepage
├── product.html           # Product listing page
├── login.html             # Login page
├── sign-up.html           # Sign-up page
├── about.html             # About page
├── faqs.html              # FAQs page
└── checkout.html          # Checkout page
```

---

## Setup & Usage

1. **Clone or Download:**  
   Download the repository and open the `foodstuff/` folder in your IDE or a local web server.

2. **Run Locally:**  
   Open `index.html` in your browser. All pages are static and require no backend server.

3. **Data Updates:**  
   - Product data is stored in JSON files under `foodstuff/jsons/`.
   - To update products, edit the relevant JSON file. The homepage and product pages will automatically show the cheapest product per category.

4. **Images:**  
   - Place product images in the `images/` folder.
   - Reference images in JSON files using relative paths (e.g., `"image": "rice.jpg"`).

---

## Pages Overview

- **index.html:** Homepage showing the cheapest product from each category, navigation, and cart indicator.
- **product.html:** Browse all products by category, add to cart, and view details.
- **login.html:** User login form with password toggle and session management.
- **sign-up.html:** User registration with password strength meter and validation.
- **about.html:** Information about FoodSocket, its mission, and founder.
- **faqs.html:** Frequently asked questions about membership, orders, and payment.
- **checkout.html:** Cart summary, shipping form, and simulated payment options.

---

## Scripts Overview

- **homepage.js:**  
  - Handles responsive navigation (hamburger menu).
  - Enhances account dropdown (login/signup).
  - Renders cheapest products on homepage.

- **product.js:**  
  - Loads products by category from JSON.
  - Renders product cards with add-to-cart and quantity selection.
  - Manages cart indicator and overlay.

- **cart.js:**  
  - Manages cart state in localStorage.
  - Displays cart indicator and overlay.
  - Handles add/remove/clear actions.

- **login.js & sign-up.js:**  
  - Handle form validation, password toggle, and session storage.

- **checkout.js:**  
  - Renders cart items, calculates totals, and simulates payment flows.

---

## JSON Data

Each product category has a JSON file in `foodstuff/jsons/`.  
Example (`beans.json`):

```json
{
  "beans": [
    {
      "productName": "Milky Beans",
      "kongoPrice": "₦2,300/Kongo",
      "image": "beans.jpg"
    }
  ]
}
```

- The homepage and product pages automatically select and display the cheapest product from each category.


## Styling
- *homepage.css:* Main site styles, header, navigation, footer, and responsive layout.
- *product.css, login.css, sign-up.css, about.css, faqs.css, checkout.css:* Page-specific styles for forms, cards, grids, and mobile layouts.

## Accessibility & Responsiveness
- *Navigation:* Hamburger menu appears on mobile; full menu on desktop.
- *Forms:* Accessible labels, focus states, and ARIA roles.
- *Product Cards:* Responsive grid layout, images scale on mobile.
- *Footer:* Contact info and copyright always pinned to bottom.


## Contact
*Address:* https://www.linkedin.com/in/adeloye007/

*Email:* john.adeloye@yahoo.com


## License
This project is licensed by MIT and not copyright available.
All images and content © 2025 FoodSocket. All rights reserved.


## Credits
*Developed by John Adeloye and contributors.*