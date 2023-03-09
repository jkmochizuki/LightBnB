const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const queryString = `
  SELECT users.*
  FROM users
  WHERE users.email = $1;`;
  const values = [email];

  return pool
    .query(queryString, values)
    .then((res) => {
      const user = res.rows[0];
      const userEmail = user.email;
      if (userEmail.toLowerCase() === email.toLowerCase()) {
        return user;
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `
  SELECT users.*
  FROM users
  WHERE id = $1;`;
  const values = [id];

  return pool
    .query(queryString, values)
    .then((res) => {
      const user = res.rows[0];
      const userId = user.id;
      if (userId === id) {
        return user;
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const queryString = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING*;`;
  const values = [user.name, user.email, user.password];

  return pool
    .query(queryString, values)
    .then((res) => {
      const user = res.rows[0];
      return user;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM properties
  JOIN reservations ON properties.id = reservations.property_id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  AND reservations.end_date < Now()
  GROUP BY properties.id, reservations.id
  ORDER BY start_date
  LIMIT $2;
  `;
  const values = [guest_id, limit];

  return pool
    .query(queryString, values)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let whereClauses = "";
  let havingClause = "";

  const getWhereClause = (option, whereClause) => {
    if (option) {
      if (whereClause.includes('city')) {
        queryParams.push(`%${option}%`);
      } else {
        whereClause.includes('cost') ? queryParams.push(`${option * 100}`) : queryParams.push(`${option}`);
      }
      whereClauses += (queryParams.length === 1) ? `WHERE ${whereClause} $${queryParams.length}` : ` AND ${whereClause} $${queryParams.length}`;
    }
  };
  getWhereClause(options.city, 'city LIKE');
  getWhereClause(options.owner_id, 'owner_id =');
  getWhereClause(options.maximum_price_per_night, 'cost_per_night <=');
  getWhereClause(options.minimum_price_per_night, 'cost_per_night >=');

  const getHavingClause = option => {
    if (option) {
      queryParams.push(`${option}`);
      havingClause += `HAVING avg(rating) >= $${queryParams.length}`;
    }
  };
  getHavingClause(options.minimum_rating);

  queryParams.push(limit);
  const queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  ${whereClauses}
  GROUP BY properties.id
  ${havingClause}
  ORDER BY cost_per_night
  LIMIT $${queryParams.length}
  `;

  console.log(queryString, queryParams);
  
  return pool
    .query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $12, $13, $14)
  RETURNING*;`;
  const values = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night * 100, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms];

  return pool
    .query(queryString, values)
    .then((res) => {
      const property = res.rows;
      return property;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addProperty = addProperty;

/**
 * Add a reservation to the database
 * @param {{}} reservation An object containing all of the property details.
 * @return {Promise<{}>} A promise to the reservation.
 */
const addReservation = function(reservation) {
  console.log('reservation', reservation);
  const queryString = `
  INSERT INTO reservations (guest_id, property_id, start_date, end_date)
  VALUES ($1, $2, $3, $4)
  RETURNING*;`;
  const values = [reservation.guest_id, reservation.property_id, reservation.start_date, reservation.end_date];

  return pool
    .query(queryString, values)
    .then((res) => {
      const reservation = res.rows;
      return reservation;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addReservation = addReservation;
