import React from "react";
import styles from "./Meal.module.css";
import { useNavigate } from "react-router-dom";

const Meal = ({ meal }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.card}>
      <h3>{meal.title}</h3>
      <p className={styles.description}>{meal.description}</p>
      <p className={styles.price}>Price: {meal.price}</p>
      <button
        onClick={() => navigate(`/meals/${meal.id}`)}
        className={styles.detailsButton}
      >
        View Details
      </button>
    </div>
  );
};

export default Meal;
