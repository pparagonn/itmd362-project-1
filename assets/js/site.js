'use strict';

var html = document.querySelector('html');
html.classList.add('js');

// Post-Creation form logic
// Shipping-Delivery Form
if(html.id === 'shipping-delivery-page') {
  var shippingDelivery = document.querySelector('form[name="shipping-delivery"]');
  restoreFormDataFromLocalStorage(shippingDelivery.name);
  shippingDelivery.addEventListener('input', debounce(handleFormInputActivity, 300));
  shippingDelivery.addEventListener('change', handleFormInputActivity);
  shippingDelivery.addEventListener('submit', handleFormSubmission);
}

/* Callback Functions */

function handleFormInputActivity(event) {
  var errorClass = targetElement.name + '-error';
  var errorEl = document.querySelector('.' + errorClass);

  if (!inputElements.includes(targetElement.tagName) || targetElement.name === 'address-2' || targetElement.name === 'city') {
    return; // this is not an element we care about
  }

  // Implicit 'else', care of the `return;` statement above...
  if(targetType === 'text' && targetElement.tagName === 'INPUT') {
    if (targetElement.value.length < 3) {
      // Don't add duplicate errors
      if (!errorEl) {
        errorText += ' must be at least 3 characters';
        errorEl = document.createElement('p');
        errorEl.className = errorClass;
        errorEl.innerText = errorText;
        targetElement.before(errorEl);
      }
    } else {
      if (errorEl) {
        errorEl.remove();
      }
    }
  }

  writeFormDataToLocalStorage(targetElement.form.name, targetElement);
}

function writeFormDataToLocalStorage(formName, inputElement) {
var formData = findOrCreateLocalStorageObject(formName);
var formElements;
// Set just a single input value
if (inputElement) {
  formData[inputElement.name] = inputElement.value;
} else {
  // Set all form input values, e.g., on a submit event
  formElements = document.forms[formName].elements;
  for (var i = 0; i < formElements.length; i++) {
    // Don't store empty elements, like the submit button
    if (formElements[i].value !== "") {
      formData[formElements[i].name] = formElements[i].value;
    }
  }
}


  // Write the formData JS object to localStorage as JSON
  writeJsonToLocalStorage(formName, formData);
}

function findOrCreateLocalStorageObject(keyName) {
  var jsObject = readJsonFromLocalStorage(keyName);

  if (Object.keys(jsObject).length === 0) {
    writeJsonToLocalStorage(keyName, jsObject);
  }

  return jsObject;
}

function readJsonFromLocalStorage(keyName) {
  var jsonObject = localStorage.getItem(keyName);
  var jsObject = {};

  if (jsonObject) {
    try {
      jsObject = JSON.parse(jsonObject);
    } catch(e) {
      console.error(e);
      jsObject = {};
    }
  }

  return jsObject;
}

function writeJsonToLocalStorage(keyName, jsObject) {
  localStorage.setItem(keyName, JSON.stringify(jsObject));
}

// function destroyFormDataInLocalStorage(formName) {
//   localStorage.removeItem(formName);
// }

function restoreFormDataFromLocalStorage(formName) {
  var jsObject = readJsonFromLocalStorage(formName);
  var formValues = Object.entries(jsObject);

  if (formValues.length === 0) {
    return; // nothing to restore
  }
  var formElements = document.forms[formName].elements;
  for (var i = 0; i < formValues.length; i++) {
    console.log('Form input key:', formValues[i][0], 'Form input value:', formValues[i][1]);
    formElements[formValues[i][0]].value = formValues[i][1];
  }
}

/* Utility Functions */

function capitalizeFirstLetter(string) {
  var firstLetter = string[0].toUpperCase();
  return firstLetter + string.substring(1);
}

/**
* UTILITY FUNCTIONS
*/
function handleFormSubmission(event) {
  var targetElement = event.target;
  event.preventDefault(); // STOP the default browser behavior
  writeFormDataToLocalStorage(targetElement.name); // STORE all the form data
  window.location.href = targetElement.action; // PROCEED to the URL referenced by the form action
}

// debounce to not execute until after an action has stopped (delay)
function debounce(callback, delay) {
var timer; // function-scope timer to debounce()
return function() {
  var context = this; // track function-calling context
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
  var args = arguments; // hold onto arguments object
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments

  // Reset the timer
  clearTimeout(timer);

  // Set the new timer
  timer = setTimeout(function() {
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
    callback.apply(context, args);
  }, delay);
}
}
