import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";
import mealsRouter from "./routers/meals.js";
import reservationsRouter from "./routers/reservations.js";
import reviewsRouter from "./routers/reviews.js";

const app = express();
app.use(express.json());
app.use("/api/reservations", reservationsRouter);
app.use("/api/meals", mealsRouter);
app.use("/api/reviews", reviewsRouter);
app.use(cors());
app.use(bodyParser.json());

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

app.get("/future-meals", async (req, res) => {
  try {
    const now = new Date().toISOString();
    const futureMeals = await knex("Meal").where("when", ">", now);
    response.json(futureMeals);
  } catch (error) {
    next(error);
  }
});
app.get("/past-meals", async (req, res) => {
  try {
    const now = new Date().toISOString();
    const meals = await knex("Meal").where("when", "<", now);
    res.json(meals);
  } catch (error) {
    next(error);
  }
});

app.get("/all-meals", async (req, res) => {
  try {
    const allMeals = await knex("Meal").select("*");
    res.json(allMeals);
  } catch (error) {
    next(error);
  }
});

app.get(
  "/first-meal",
  async (req, res) => {
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
  async (req, res) => {
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

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

app.use(errorHandler);
app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
