import "dotenv/config";
import express from "express";
import cors from "cors";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";
import mealsRouter from "./routers/meals.js";
import reservationsRouter from "./routers/reservations.js";
import reviewsRouter from "./routers/reviews.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/reservations", reservationsRouter);
app.use("/api/meals", mealsRouter);
app.use("/api/reviews", reviewsRouter);

const handleNoData = (req, res, next) => {
  if (req.data && req.data.length === 0) {
    return res.status(404).json({ message: "No meals found" });
  }
  next();
};

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
};

const apiRouter = express.Router();

app.post("/api/reservations", async (req, res, next) => {
  try {
    const {
      meal_id,
      contact_phonenumber,
      contact_name,
      contact_email,
      number_of_guests,
    } = req.body;
    console.log("Received reservation data:", req.body);

    const newReservation = await knex("Reservations").insert({
      meal_id,
      contact_phonenumber,
      contact_name,
      contact_email,
      number_of_guests,
    });

    res
      .status(200)
      .json({ message: "Reservation created successfully", newReservation });
  } catch (error) {
    console.error("Error in reservations:", error.message);
    next(error);
  }
});

app.post("/api/reviews", async (req, res, next) => {
  try {
    const { meal_id, title, description, stars, created_date } = req.body;
    console.log("Received review data:", req.body);

    const newReview = await knex("Reviews").insert({
      meal_id,
      title,
      description,
      stars,
      created_date,
    });

    res
      .status(200)
      .json({ message: "Review submitted successfully", newReview });
  } catch (error) {
    console.error("Error in reviews:", error.message);
    next(error);
  }
});

app.get("/future-meals", async (req, res, next) => {
  try {
    const now = new Date().toISOString();
    const futureMeals = await knex("Meal").where("when", ">", now);
    response.json(futureMeals);
  } catch (error) {
    next(error);
  }
});
app.get("/past-meals", async (req, res, next) => {
  try {
    const now = new Date().toISOString();
    const meals = await knex("Meal").where("when", "<", now);
    res.json(meals);
  } catch (error) {
    next(error);
  }
});

app.get("/all-meals", async (req, res, next) => {
  try {
    const { title } = req.query;
    let query = knex("Meal").select("*");
    if (title) {
      query = query.where("title", "like", `%${title}%`);
    }
    const allMeals = await knex("Meal").select("*");
    res.json(allMeals);
  } catch (error) {
    next(error);
  }
});

app.get(
  "/first-meal",
  async (req, res, next) => {
    try {
      const firstMeal = await knex("Meal").orderBy("id", "asc").limit(1);
      if (firstMeal.length === 0) {
        return handleNoMeals(res);
      }
      res.json(firstMeal);
    } catch (error) {
      next(error);
    }
  },
  handleNoData,
  (req, res) => {
    res.json(req.data);
  }
);

app.get(
  "/last-meal",
  async (req, res, next) => {
    try {
      const lastMeal = await knex("Meal").orderBy("id", "desc").limit(1);
      if (lastMeal.length === 0) return handleNoMeals(res);
      res.json(lastMeal);
    } catch (error) {
      next(error);
    }
  },
  handleNoData,
  (req, res) => {
    res.json(req.data);
  }
);
app.get("/api/meals/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const meal = await knex("Meal").where({ id }).first();

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    const totalReservations = await knex("Reservations")
      .where({ meal_id: id })
      .sum("number_of_guests as total")
      .first();

    const availableReservations =
      meal.max_reservations - (totalReservations.total || 0);

    res.json({
      ...meal,
      availableReservations,
    });
  } catch (error) {
    next(error);
  }
});

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

app.use(errorHandler);
app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
