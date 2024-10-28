"use client";
import React from "react";
import MealsList from "../MealsList";
import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <>
      <div className={styles.homepageContainer}>
        <h1 className={styles.heading}>Welcome to Meal Sharing</h1>
        <MealsList />
      </div>
    </>
  );
};

export default HomePage;
