const form = document.querySelector('form');

const dayFieldset = document.querySelector('.day-fields');
const monthFieldset = document.querySelector('.month-fields');
const yearFieldset = document.querySelector('.year-fields');
const allFieldsets = document.querySelectorAll('fieldset');

const dayMessage = document.querySelector('.day-message');
const monthMessage = document.querySelector('.month-message');
const yearMessage = document.querySelector('.year-message');
const allErrors = document.querySelectorAll('.error');

const allAgeElements = document.querySelectorAll('.age-result span');

function handleFormSubmit(e) {
  e.preventDefault();
  const day = form.querySelector('#day').value;
  const month = form.querySelector('#month').value;
  const year = form.querySelector('#year').value;
  const dateString = `${year}-${month}-${day}`;

  let errorCount = 0;

  // check day
  if (day === '') {
    dayFieldset.classList.add('has-error');
    displayErrorMessage(dayMessage, 'This field is required');
    errorCount ++;
  } else if ( (day < 1 || day > 31) || isNaN(day) ) {
    dayFieldset.classList.add('has-error');
    displayErrorMessage(dayMessage, 'Must be a valid day');
    errorCount ++;
  } else {
    dayFieldset.classList.remove('has-error');
    displayErrorMessage(dayMessage, ''); // clear error messages if valid
  }

  // check month
  if (month === '') {
    monthFieldset.classList.add('has-error');
    displayErrorMessage(monthMessage, 'This field is required');
    errorCount ++;
  } else if ( (month < 1 || month > 12) || isNaN(month) ) {
    monthFieldset.classList.add('has-error');
    displayErrorMessage(monthMessage, 'Must be a valid month');
    errorCount ++;
  } else {
    monthFieldset.classList.remove('has-error');
    displayErrorMessage(monthMessage, '');
  }

  // check year
  if (year === '') {
    yearFieldset.classList.add('has-error');
    displayErrorMessage(yearMessage, 'This field is required');
    errorCount ++;
  } else if (year > new Date().getFullYear()) {
    yearFieldset.classList.add('has-error');
    displayErrorMessage(yearMessage, 'Must be in the past');
    errorCount ++;
  } else if (isNaN(year)) {
    yearFieldset.classList.add('has-error');
    displayErrorMessage(yearMessage, 'Must be a valid year');
    errorCount ++;
  } else {
    yearFieldset.classList.remove('has-error');
    displayErrorMessage(yearMessage, '');
  }

  // if we have any errors, return out of function
  if (errorCount > 0) {
    resetAgeDisplay();
    return;
  }

  // if no errors, continue with other checks
  if (!isValidDate(dateString)) {
    displayErrorMessage(dayMessage, 'Must be a valid date');
    displayErrorMessage(monthMessage, '');
    displayErrorMessage(yearMessage, '');
    displayErrorAllFields();
    resetAgeDisplay();
  } else if (!isDateInPast(dateString)) {
    displayErrorMessage(dayMessage, 'Date must be in past');
    displayErrorMessage(monthMessage, '');
    displayErrorMessage(yearMessage, '');
    displayErrorAllFields();
    resetAgeDisplay();
  } else {
    const age = calculateAge(dateString);
    handleAgeDisplay(age);
    clearAllErrors();
    return;
  }

}

function displayErrorAllFields() {
  allFieldsets.forEach(fieldset => {
    fieldset.classList.add('has-error');
  });
}
 
function displayErrorMessage(element, message) {
  element.textContent = message;
}

function clearAllErrors() {
  allErrors.forEach(error => {
    error.textContent = '';
  });
};

function resetAgeDisplay () {
  allAgeElements.forEach(element => {
    element.textContent = '--';
  });
}

function isValidDate(dateString) {
  const [year, month, day] = dateString.split('-');
  const parsedMonth = parseInt(month, 10);
  const parsedDay = parseInt(day, 10);

  // check date is valid i.e. 31/04/1991 (there are 30 days in April)
  if (parsedDay > new Date(year, parsedMonth, 0).getDate()) {
    return false
  }

  return true;
}

function isDateInPast(dateString) {
  if (new Date(dateString) >= new Date()) {
    return false;
  }

  return true;
}

function handleAgeDisplay(age) {
  const {days, months, years} = age; // destructure age object
  const ageYears = document.querySelector('.age-years span');
  ageYears.textContent = years;
  const ageMonths = document.querySelector('.age-months span');
  ageMonths.textContent = months;
  const ageDays = document.querySelector('.age-days span');
  ageDays.textContent = days;
}

function calculateAge(birthdate) {
  // Parse the birthdate string to a Date object
  const birthDate = new Date(birthdate);
  
  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in years, months, and days
  let yearsDiff = currentDate.getFullYear() - birthDate.getFullYear();
  let monthsDiff = currentDate.getMonth() - birthDate.getMonth();
  let daysDiff = currentDate.getDate() - birthDate.getDate();

  // Adjust for negative months or days difference
  if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)) {
    yearsDiff--;
    if (monthsDiff < 0) {
      monthsDiff += 12;
    }
  }

  if (daysDiff < 0) {
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, birthDate.getDate());
    const daysInLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    daysDiff = daysInLastMonth - lastMonth.getDate() + birthDate.getDate();
    monthsDiff--;
  }

  return {
    years: yearsDiff,
    months: monthsDiff,
    days: daysDiff
  };
}

form.addEventListener('submit', handleFormSubmit);