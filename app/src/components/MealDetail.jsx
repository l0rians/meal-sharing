"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MealDetail = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/meals/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setMeal(data);
          } else {
            setError("Meal not found with the specified ID.");
          }
        } else {
          setError("Error fetching meal data.");
        }
      } catch (error) {
        console.error("Error fetching meal:", error);
        setError("Error fetching meal data.");
      }
    };

    fetchMeal();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!meal) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{meal.title}</h1>
      <p>{meal.description}</p>
      <p>Price: ${meal.price}</p>
      <p>Available reservations: {meal.max_reservations}</p>
    </div>
  );
};

export default MealDetail;
