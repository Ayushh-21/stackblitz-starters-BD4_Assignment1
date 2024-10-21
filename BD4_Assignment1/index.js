const express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

const app = express();
let PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './BD4_Assignment1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

// Exercise 1: Get All Restaurants
const fetchAllRestaurants = async () => {
  try {
    let query = 'SELECT * FROM restaurants ';
    let response = await db.all(query, []);
    return { restaurants: response };
  } catch (error) {
    throw new Error(error.message);
  }
};

app.get('/restaurants', async (req, res) => {
  try {
    let result = await fetchAllRestaurants();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found' });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Exercise 2: Get Restaurant by ID
const fetchAllRestaurantsById = async (id) => {
  try {
    let query = 'SELECT * FROM restaurants WHERE id = ?';
    let response = await db.get(query, [id]);
    return { restaurants: response };
  } catch (error) {
    throw new Error(error.message);
  }
};

app.get('/restaurants/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let result = await fetchAllRestaurantsById(id);
    if (result.restaurants === null) {
      return res
        .status(404)
        .json({ message: `No restaurants found of this id: ${id} ` });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Exercise 3: Get Restaurants by Cuisine
const fetchAllRestaurantsByCuisine = async (cuisine) => {
  try {
    let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
    let response = await db.all(query, [cuisine]);
    return { restaurants: response || [] };
  } catch (error) {
    throw new Error(error.message);
  }
};

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let result = await fetchAllRestaurantsByCuisine(cuisine);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: `No restaurants found of this: ${cuisine} ` });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Exercise 4: Get Restaurants by Filter
const fetchAllRestaurantsByFilter = async (
  isVeg,
  hasOutdoorSeating,
  isLuxury
) => {
  try {
    let query =
      'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
    let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
    return { restaurants: response };
  } catch (error) {
    throw new Error(error.message);
  }
};

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    let result = await fetchAllRestaurantsByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Exercise 5: Get Restaurants Sorted by Rating
const fetchAllRestaurantsByRating = async () => {
  try {
    let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
    let response = await db.all(query, []);
    return { restaurants: response };
  } catch (error) {
    throw new Error(error.message);
  }
};

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await fetchAllRestaurantsByRating();
    if (result.restaurants.length === 0) {
      return res.status(404).json({
        message: `No restaurants found `,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Exercise 6: Get All Dishes
const fetchAllDishes = async () => {
  try {
    let query = 'SELECT * FROM dishes';
    let response = await db.all(query, []);
    return { dishes: response };
  } catch (error) {
    throw new Error(error.message);
  }
};

app.get('/dishes', async (req, res) => {
  try {
    let result = await fetchAllDishes();
    if (result.dishes.length === 0) {
      return res.status(404).json({
        message: `No dishes found `,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Exercise 7: Get Dish by ID
const fetchAllDishesById = async (id) => {
  try {
    let query = 'SELECT * FROM dishes WHERE id = ?';
    let response = await db.get(query, [id]);
    return { dishes: response };
  } catch (error) {
    throw new Error(error.message);
  }
};

app.get('/dishes/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let result = await fetchAllDishesById(id);
    if (!result.dishes) {
      return res.status(404).json({
        message: `No dishes found of this ${id} `,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Exercise 8: Get Dishes by
const fetchAllDishesByFilter = async (isVeg) => {
  try {
    let query = 'SELECT * FROM dishes WHERE isVeg = ?';
    let response = await db.all(query, [isVeg]);
    return { dishes: response };
  } catch (error) {
    throw new Error(error.message);
  }
};

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let result = await fetchAllDishesByFilter(isVeg);
    if (result.dishes.length === 0) {
      return res.status(404).json({
        message: `No dishes found `,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Exercise 9: Get Dishes Sorted by Price
const fetchAllDishesByPrice = async () => {
  try {
    let query = 'SELECT * FROM dishes ORDER BY price ';
    let response = await db.all(query, []);
    return { dishes: response || [] };
  } catch (error) {
    throw new Error(error.message);
  }
};

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await fetchAllDishesByPrice();
    if (result.dishes.length === 0) {
      return res.status(404).json({
        message: `No dishes found `,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log('Express server initialized');
});
