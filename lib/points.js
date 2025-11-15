// --- Configuration ---
const POINTS_TO_ADD = 20;
const POINTS_TO_REMOVE = 10;
const STORAGE_KEY = 'appPoints';
const EXERCISES_KEY = 'appExercisesDone';

// 💡 --- NEW MAINTENANCE CONSTANTS ---
const MAINTENANCE_COST = 10;
const MAINTENANCE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour in milliseconds
const LAST_MAINTENANCE_KEY = 'appLastMaintenance';


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

/**
 * Adds points and saves the new total to localStorage.
 * @param {number} amount The number of points to add.
 * @returns {number} The new total points.
 */
function addPoints(amount) {
  let currentPoints = getPoints();
  let newPoints = currentPoints + amount;
  localStorage.setItem(STORAGE_KEY, newPoints);
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

// --- 💡 NEW MAINTENANCE FUNCTION ---
/**
 * Checks if maintenance is due and deducts points if necessary.
 * This handles time passed both online and offline.
 */
function runMaintenanceCheck() {
    const currentTime = Date.now();
    const lastCheckString = localStorage.getItem(LAST_MAINTENANCE_KEY);

    // If it's the very first run, just set the time and exit.
    if (!lastCheckString) {
        localStorage.setItem(LAST_MAINTENANCE_KEY, currentTime.toString());
        return;
    }

    const lastCheckTime = parseInt(lastCheckString, 10);
    const timePassed = currentTime - lastCheckTime;

    // Check if at least one full maintenance interval has passed
    if (timePassed >= MAINTENANCE_INTERVAL_MS) {
        
        // Calculate how many intervals (hours) have passed
        const intervalsPassed = Math.floor(timePassed / MAINTENANCE_INTERVAL_MS);
        
        // Calculate total points to deduct
        const pointsToDeduct = intervalsPassed * MAINTENANCE_COST;

        if (pointsToDeduct > 0) {
            console.log(`Maintenance: Deducting ${pointsToDeduct} points for ${intervalsPassed} hour(s).`);
            // Use the existing removePoints function
            removePoints(pointsToDeduct);
        }

        // IMPORTANT: Update the last check time based on the *last* interval,
        // not the current time. This prevents "time drift".
        const newLastCheckTime = lastCheckTime + (intervalsPassed * MAINTENANCE_INTERVAL_MS);
        localStorage.setItem(LAST_MAINTENANCE_KEY, newLastCheckTime.toString());
    }
}