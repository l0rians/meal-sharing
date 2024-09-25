import express from "express";
import knex from "../database_client.js";

const router = express.Router();

// router to get all the reservations

router.get("/", async (req, res, next) => {
  try {
    const reservations = await knex.select("*").from("Reservation");
    res.json(reservations);
  } catch (error) {
    next(error);
  }
});

// router to create a new reservation
router.post("/", async (req, res, next) => {
  try {
    const newReservation = req.body;
    const [reservationId] = await knex("Reservation").insert(newReservation);
    res.status(201).json({ message: "Reservation created", id: reservationId });
  } catch (error) {
    next(error);
  }
});

// router to get a specific reservation
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const reservation = await knex("Reservation").where({ id }).first();
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json(reservation);
  } catch (error) {
    next(error);
  }
});

// router to update a specific reservation
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const updatedReservation = req.body;
  try {
    const updatedRows = await knex("Reservation")
      .where({ id })
      .update(updatedReservation);
    if (!updatedRows) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json({ message: "Reservation updated", id });
  } catch (error) {
    next(error);
  }
});

// router to delete a specific reservation
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedRows = await knex("Reservation").where({ id }).del();
    if (!deletedRows) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json({ message: "Reservation deleted", id });
  } catch (error) {
    next(error);
  }
});
export default router;
