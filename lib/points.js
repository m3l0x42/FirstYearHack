// --- Configuration ---
const POINTS_TO_ADD = 20;
const POINTS_TO_REMOVE = 10;
const STORAGE_KEY = 'appPoints'; // The key used in localStorage

// --- Your Points "Library" ---

/**
 * Gets the current points from localStorage.
 * @returns {number} The current points.
 */
function getPoints() {
  // Get the value from storage. If it doesn't exist, default to '0'.
  const storedPoints = localStorage.getItem(STORAGE_KEY) || '0';
  // Convert the string to a number and return it
  return parseInt(storedPoints, 10);
}

/**
 * Adds points and saves the new total to localStorage.
 * @returns {number} The new total points.
 */
function addPoints() {
  let currentPoints = getPoints();
  let newPoints = currentPoints + POINTS_TO_ADD;
  // Save the new value back to localStorage
  localStorage.setItem(STORAGE_KEY, newPoints);
  return newPoints;
}

/**
 * Removes points and saves the new total to localStorage.
 * @returns {number} The new total points.
 */
function removePoints() {
  let currentPoints = getPoints();
  let newPoints = currentPoints - POINTS_TO_REMOVE;
  // Optional: prevent points from going below zero
  if (newPoints < 0) {
    newPoints = 0;
  }
  localStorage.setItem(STORAGE_KEY, newPoints);
  return newPoints;
}

// --- "Glue" Code to Connect Logic to HTML ---

// Wait for the HTML content to be fully loaded before running script
document.addEventListener('DOMContentLoaded', () => {
  
  // Find the HTML elements we need to interact with
  const pointsDisplay = document.getElementById('points-display');
  const addBtn = document.getElementById('add-btn');
  const removeBtn = document.getElementById('remove-btn');

  /**
   * A helper function to get the points and update the text on the page.
   */
  function updateDisplay() {
    pointsDisplay.textContent = getPoints();
  }

  // --- Set up Event Listeners ---

  addBtn.addEventListener('click', () => {
    addPoints();      // Run the logic
    updateDisplay();  // Update the HTML
  });

  removeBtn.addEventListener('click', () => {
    removePoints();   // Run the logic
    updateDisplay();  // Update the HTML
  });

  // Load the initial points when the page first opens
  updateDisplay();
});