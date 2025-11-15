// --- Configuration ---
const POINTS_TO_ADD = 20; // For dashboard test button
const POINTS_TO_REMOVE = 10; // For dashboard test button
const STORAGE_KEY = 'appPoints';
const EXERCISES_KEY = 'appExercisesDone';

// --- Your Points "Library" ---

/**
 * Gets the current points from localStorage.
 * @returns {number} The current points.
 */
function getPoints() {
  const storedPoints = localStorage.getItem(STORAGE_KEY) || '0';
  return parseInt(storedPoints, 10);
}

/**
 * Gets the current exercise count from localStorage.
 * @returns {number} The current exercise count.
 */
function getExercisesDone() {
  const storedExercises = localStorage.getItem(EXERCISES_KEY) || '0';
  return parseInt(storedExercises, 10);
}

// --- 💡 1. NEW SEPARATE FUNCTION ---
/**
 * Increments the exercise count in localStorage.
 * @returns {number} The new total exercise count.
 */
function incrementExercise() {
  let currentExercises = getExercisesDone();
  let newCount = currentExercises + 1;
  localStorage.setItem(EXERCISES_KEY, newCount);
  return newCount;
}

// --- 💡 2. UPDATED FUNCTIONS (Now accept an amount) ---

/**
 * Adds points and saves the new total to localStorage.
 * @param {number} amount The number of points to add.
 * @returns {number} The new total points.
 */
function addPoints(amount) {
  let currentPoints = getPoints();
  let newPoints = currentPoints + amount;
  localStorage.setItem(STORAGE_KEY, newPoints);
  
  // --- Exercise logic has been REMOVED from here ---
  
  return newPoints;
}

/**
 * Removes points and saves the new total to localStorage.
 * @param {number} amount The number of points to remove.
 * @returns {number} The new total points.
 */
function removePoints(amount) {
  let currentPoints = getPoints();
  let newPoints = currentPoints - amount;
  if (newPoints < 0) {
    newPoints = 0;
  }
  localStorage.setItem(STORAGE_KEY, newPoints);
  return newPoints;
}

// --- "Glue" Code to Connect Logic to HTML ---
document.addEventListener('DOMContentLoaded', () => {
  
  const pointsDisplay = document.getElementById('points-display');
  const exercisesDisplay = document.getElementById('exercises-display');
  
  const addBtn = document.getElementById('add-btn');
  const removeBtn = document.getElementById('remove-btn');

  function updateDisplay() {
    pointsDisplay.textContent = getPoints();
    if (exercisesDisplay) {
      exercisesDisplay.textContent = getExercisesDone();
    }
  }

  // --- 💡 3. Listeners updated to use amounts ---

  addBtn.addEventListener('click', () => {
    // This test button now only adds points, NOT exercises
    addPoints(POINTS_TO_ADD); 
    updateDisplay();
  });

  removeBtn.addEventListener('click', () => {
    removePoints(POINTS_TO_REMOVE);
    updateDisplay();
  });

  // Load the initial data
  updateDisplay();
});