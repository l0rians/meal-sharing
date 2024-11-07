import React from "react";
import MealsList from "../MealsList";
import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <>
      <div className={styles.homepageContainer}>
        <h1 className={styles.heading}>Welcome to Meal Sharing</h1>
        <h2>Find and Share Meals</h2>
        <MealsList limit={3} />
        <button onClick={() => (window.location.href = "/meals")}>
          See More Meals
        </button>
      </div>
    </>
  );
};

export default HomePage;
