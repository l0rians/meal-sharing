import express from "express";
import knex from "../database_client.js";

const router = express.Router();

// router to get all the meals with query parameters
router.get("/", async (req, res, next) => {
  console.log("Request to get all meals with query parameters");
  console.log("Query parameters:", req.query);
  try {
    let query = knex("meal");
    if (req.query.maxPrice) {
      const maxPrice = parseInt(req.query.maxPrice);
      if (isNaN(maxPrice) || maxPrice <= 0) {
        return res.status(400).json({ error: "Max price must be a number" });
      }
      console.log("Filtering by max price:", maxPrice);
      query = query.where("price", "<=", maxPrice);
    }

    if (req.query.availableReservations) {
      const available = req.query.availableReservations === "true";
      console.log("Filtering by available reservations:", available);
      query = query
        .leftJoin("reservation", "meal.id", "reservation.meal_id")
        .groupBy("meal.id")
        .select("meal.id", "meal.title", "meal.price", "meal.max_reservations")
        .havingRaw(
          `meal.max_reservations - COUNT(reservation.id) ${available ? ">" : "="} 0`
        );
    }
    if (req.query.title) {
      const title = req.query.title;
      if (typeof title !== "string") {
        return res.status(400).json({ error: "Title must be a string" });
      }
      query = query.where("title", "like", `%${title}%`);
    }

    if (req.query.dateAfter) {
      const dateAfter = req.query.dateAfter;
      if (isNaN(Date.parse(dateAfter))) {
        return res.status(400).json({ error: "Invalid date for dateAfter" });
      }
      query = query.where("when", ">", dateAfter);
    }

    if (req.query.dateBefore) {
      const dateBefore = req.query.dateBefore;
      if (isNaN(Date.parse(dateBefore))) {
        return res.status(400).json({ error: "Invalid date for dateBefore" });
      }
      query = query.where("when", "<", dateBefore);
    }

    if (req.query.limit) {
      const limit = parseInt(req.query.limit);
      if (isNaN(limit) || limit <= 0) {
        return res
          .status(400)
          .json({ error: "Limit must be a positive number" });
      }
      query = query.limit(limit);
    }

    if (req.query.sortKey) {
      const sortKey = req.query.sortKey;
      const sortDir =
        req.query.sortDir && req.query.sortDir.toLowerCase() === "desc"
          ? "desc"
          : "asc";
      query = query.orderBy(sortKey, sortDir);
    }

    const meals = await query;
    res.json(meals);
  } catch (error) {
    next(error);
  }
});
// router to create a new meal
router.post("/", async (req, res, next) => {
  try {
    const newMeal = req.body;
    const [mealId] = await knex("meal").insert(newMeal);
    res.status(201).json({ message: "Meal created", id: mealId });
  } catch (error) {
    next(error);
  }
});

// router to get a specific meal
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const meal = await knex("meal").where({ id }).first();
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.json(meal);
  } catch (error) {
    next(error);
  }
});

// router to update a specific meal
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const newMeal = req.body;
  try {
    const updatedMeal = await knex("meal").where({ id }).update(newMeal);
    if (!updatedMeal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.json({ message: "Meal updated", updatedMeal });
  } catch (error) {
    next(error);
  }
});

// router to delete a specific meal
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMeal = await knex("meal").where({ id }).del();
    if (!deletedMeal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.json({ message: "Meal deleted", id });
  } catch (error) {
    res.status(500).json({ error: "Error deleting meal" });
  }
});

export default router;
