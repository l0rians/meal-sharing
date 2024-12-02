import React, { useEffect, useState } from "react";
import Meal from "./Meal";
import styles from "./MealsList.module.css";
import { useLocation } from "react-router-dom";
const MealsList = ({ limit }) => {
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMeals, setFilteredMeals] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchMeals = async () => {
      console.log("Calling fetchMeals");
      try {
        const response = await fetch("http://localhost:3001/api/meals");
        const data = await response.json();

        setMeals(data);
        setFilteredMeals(data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, []);

  const handleSearch = () => {
    const filtered = meals.filter((meal) =>
      meal.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMeals(filtered);
  };

  const displayMeals = limit ? filteredMeals.slice(0, limit) : filteredMeals;
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (location.pathname !== "/meals") {
    return (
      <div className={styles.gridContainer}>
        {displayMeals.length ? (
          displayMeals.map((meal) => <Meal key={meal.id} meal={meal} />)
        ) : (
          <p>No meals available.</p>
        )}
      </div>
    );
  }
  return (
    <>
      <div>
        <div className={styles.searchBox}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by title"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div className={styles.gridContainer}>
        {displayMeals.length ? (
          displayMeals.map((meal) => <Meal key={meal.id} meal={meal} />)
        ) : (
          <p>No meals available.</p>
        )}
      </div>
    </>
  );
};
export default MealsList;
