import express from "express";
import knex from "../database_client.js";

const router = express.Router();

// router to get all the meals
router.get("/", async (req, res, next) => {
  try {
    const meals = await knex.from("meal");
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
