import express from "express";
import knex from "../database_client.js";
const router = express.Router();

// router to get all the reviews
router.get("/", async (req, res, next) => {
  try {
    const reviews = await knex("review");
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

// router to get a specific review
router.get("/meal/:meal_id", async (req, res, next) => {
  const { meal_id } = req.params;
  try {
    const reviews = await knex("review").where({ meal_id });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newReview = req.body;
    console.log("newReview", newReview);
    const [reviewId] = await knex("review").insert(newReview);
    console.log("reviewId", reviewId);
    res.status(201).json({ message: "Review created", id: reviewId });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log("Get review with id:", id);
  try {
    const review = await knex("review").where({ id }).first();
    console.log("Fetched review:", review);
    if (!review) {
      console.log("Review with id", id, "not found");
      return res.status(404).json({ error: `Review with id ${id} not found` });
    }
    res.json(review);
  } catch (error) {
    console.log("Error fetching review:", error);
    next(error);
  }
});
// router to update a specific review
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const updatedReview = req.body;
  console.log("Updating review with id:", id);
  console.log("Updated review:", updatedReview);
  try {
    const result = await knex("review").where({ id }).update(updatedReview);
    if (!result) {
      console.log("Review with id", id, "not found");
      return res.status(404).json({ error: `Review with id ${id} not found` });
    }
    res.json({ message: "Review updated", updatedReview });
  } catch (error) {
    console.log("Error updating review:", error);
    next(error);
  }
});

// router to delete a specific review
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log("Deleting review with id:", id);
  try {
    const deletedReview = await knex("review").where({ id }).del();
    if (!deletedReview) {
      console.log("Review with id", id, "not found");
      return res.status(404).json({ error: `Review with id ${id} not found` });
    }
    res.json({ message: "Review deleted", id });
  } catch (error) {
    console.log("Error deleting review:", error);
    next(error);
  }
});

export default router;
