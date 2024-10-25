"use client";

import React, { useEffect, useState } from "react";
import styles from "./MealsList.module.css";
const MealsList = () => {
  const [meals, setMeals] = useState([]);
  console.log("MealList called");
  console.log(`meals state is ${meals}`);

  useEffect(() => {
    const fetchMeals = async () => {
      console.log("Calling fetchMeals");
      try {
        const response = await fetch("http://localhost:3001/api/meals");

        console.log("Response received:", response);
        const data = await response.json();
        console.log("Data received:", data);
        setMeals(data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className={styles.container}>
      {meals.length ? (
        meals.map((meal) => {
          console.log("Rendering meal:", meal);
          return (
            <div className={styles.meal} key={meal.id}>
              <h3>{meal.title}</h3>
              <p className={styles.description}>{meal.description}</p>
              <p className={styles.price}>Price: {meal.price}</p>
            </div>
          );
        })
      ) : (
        <p>No meals available.</p>
      )}
    </div>
  );
};
export default MealsList;
