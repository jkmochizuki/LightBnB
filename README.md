# LightBnB

## Project Structure

```
├── db
├── erd
├── public
│   ├── index.html
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── index.js
│   │   ├── libraries
│   │   ├── network.js
│   │   └── views_manager.js
│   └── styles
├── sass
└── server
  ├── database
  │   └── index.js
  ├── routes
  │   ├── api.js
  │   └── user.js
  └── server.js
```

* `db` contains the database schema and seeds.
* `erd` contains the er diagram.
* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `sass` contains all of the sass files. 
* `server` contains all of the server side and database code.
  * `database`
    * `index.js` is responsible for all queries to the database.
  * `routes`
    * `api.js` and `user.js` are responsible for any HTTP requests to `/users/something` or `/api/something`. 
  * `server.js` is the entry point to the application. This connects the routes to the database.