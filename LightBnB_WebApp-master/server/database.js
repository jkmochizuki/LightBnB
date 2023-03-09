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
    .then((result) => {
      const user = result.rows[0];
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
    .then((result) => {
      const user = result.rows[0];
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
    .then((result) => {
      const user = result.rows[0];
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
    .then((reservations) => {
      return reservations.rows;
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
        if (whereClause.includes('cost')) {
          queryParams.push(`${option * 100}`);
        } else {
          queryParams.push(`${option}`);
        }
      }
      if (!queryParams.length) {
        whereClauses += `WHERE ${whereClause} $${queryParams.length}`;
      }
      whereClauses += ` AND ${whereClause} $${queryParams.length}`;
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

  let queryString = `
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
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
