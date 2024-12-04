import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./MealDetail.module.css";

const MealDetail = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [error, setError] = useState("");
  const [reservation, setReservation] = useState({
    phonenumber: "",
    name: "",
    email: "",
    numberOfGuests: 1,
  });
  const [message, setMessage] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState({ title: "", comment: "", rating: "" });

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/meals/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setMeal(data);
          } else {
            alert("Meal not found with the specified ID.");
          }
        } else {
          alert("Error fetching meal data.");
        }
      } catch (error) {
        console.error("Error fetching meal:", error);
        alert("Error fetching meal data.");
      }
    };

    fetchMeal();
  }, [id]);

  const handleInputChange = (e) => {
    setReservation({ ...reservation, [e.target.name]: e.target.value });
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meal_id: meal.id,
          contact_phonenumber: reservation.phonenumber,
          contact_name: reservation.name,
          contact_email: reservation.email,
          number_of_guests: reservation.numberOfGuests,
        }),
      });

      if (response.ok) {
        alert("Reservation successfully created!");
        setMeal((prevMeal) => ({
          ...prevMeal,
          max_reservations:
            prevMeal.max_reservations - reservation.numberOfGuests,
        }));

        setReservation({
          phonenumber: "",
          name: "",
          email: "",
          numberOfGuests: 1,
        });
      } else {
        alert("Failed to create reservation.");
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const toggleReviewForm = () => setShowReviewForm(!showReviewForm);

  const handleReviewInputChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const response = await fetch("http://localhost:3001/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meal_id: meal.id,
          title: review.title,
          description: review.comment,
          stars: review.rating,
          created_date: createdDate,
        }),
      });

      if (response.ok) {
        alert("Review successfully submitted!");
        setReview({ title: "", comment: "", rating: "" });
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!meal) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.mealDetailContainer}>
      <h1 className={styles.title}>{meal.title}</h1>
      <p className={styles.description}>{meal.description}</p>
      <p className={styles.price}>Price: ${meal.price}</p>
      <p className={styles.reservations}>
        Available reservations: {meal.max_reservations}
      </p>

      {meal.max_reservations > 0 ? (
        <form onSubmit={handleReservationSubmit} className={styles.form}>
          <input
            type="text"
            name="phonenumber"
            value={reservation.phonenumber}
            onChange={handleInputChange}
            placeholder="Phone Number"
            required
            className={styles.input}
          />
          <input
            type="text"
            name="name"
            value={reservation.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
            className={styles.input}
          />
          <input
            type="email"
            name="email"
            value={reservation.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
            className={styles.input}
          />
          <input
            type="number"
            name="numberOfGuests"
            value={reservation.numberOfGuests}
            onChange={handleInputChange}
            placeholder="Number of Guests"
            min="1"
            max={meal.max_reservations}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Book Seat
          </button>
        </form>
      ) : (
        <p className={styles.noSeats}>No seats available.</p>
      )}

      <button onClick={toggleReviewForm} className={styles.toggleReviewButton}>
        {showReviewForm ? "Hide Review Form" : "Leave a Review"}
      </button>
      {showReviewForm && (
        <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
          <input
            type="text"
            name="title"
            value={review.title}
            onChange={handleReviewInputChange}
            placeholder="Review Title"
            required
            className={styles.input}
          />
          <textarea
            name="comment"
            value={review.comment}
            onChange={handleReviewInputChange}
            placeholder="Your Review"
            required
            className={styles.textarea}
          ></textarea>
          <input
            type="number"
            name="rating"
            value={review.rating}
            onChange={handleReviewInputChange}
            placeholder="Rating (1-5)"
            min="1"
            max="5"
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Submit Review
          </button>
        </form>
      )}

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default MealDetail;
