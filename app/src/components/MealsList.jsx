import React, { useEffect, useState } from "react";
import Meal from "./Meal";
import styles from "./MealsList.module.css";
const MealsList = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      console.log("Calling fetchMeals");
      try {
        const response = await fetch("http://localhost:3001/api/meals");
        const data = await response.json();

        setMeals(data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className={styles.gridContainer}>
      {meals.length ? (
        meals.map((meal) => <Meal key={meal.id} meal={meal} />)
      ) : (
        <p>No meals available.</p>
      )}
    </div>
  );
};
export default MealsList;
