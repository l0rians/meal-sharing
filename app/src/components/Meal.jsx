import React from "react";
import styles from "./Meal.module.css";

const Meal = ({ meal }) => {
  return (
    <div className={styles.card}>
      <h3>{meal.title}</h3>
      <p className={styles.description}>{meal.description}</p>
      <p className={styles.price}>Price: {meal.price}</p>
    </div>
  );
};

export default Meal;
