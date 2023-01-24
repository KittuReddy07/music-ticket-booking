const loginCheckerForm = document.querySelector("#login-checker-form");
const userNameInput = document.querySelector("#user-name");
const passwordInput = document.querySelector("#password");
const errorMessage = document.querySelector("#error-message");

/**
 * Outputs a given error message to the browser.
 */
function displayErrorMessage(errorMsg) {
  errorMessage.innerHTML = errorMsg;
}

/**
 * Checks if the given username and password contain unwanted keywords.
 * 
 * Returns true if there is a match and false if there is not.
 */
function passwordContainsIllegalKeywords(userName, password) {
  const badKeywords = [
    "<script>",
    "&lt;script&gt;",
    "eval()",
    " ",
    "SELECT",
    "INSERT",
    "UPDATE",
    "DELETE",
    "MERGE",
    "DROP",
    "ALTER",
    "CREATE",
    "TRUNCATE"
  ];

  let userNameLowercase = userName.toLowerCase();
  let userNameUppercase = userName.toUpperCase();

  let passwordLowercase = password.toLowerCase();
  let passwordUppercase = password.toUpperCase();

  for (const keyword of badKeywords) {
    if (userNameLowercase.match(keyword) || userNameUppercase.match(keyword) || passwordLowercase.match(keyword) || passwordUppercase.match(keyword)) {
      return true;
    }
  }

  return false;
}

/**
 * Validates the Log-in form.
 *
 * Returns false if the username and password are invalid or true if
 * username and password pass all validation checks.
 */
function validateLogInForm() {

  displayErrorMessage("");

  const MAX_USER_NAME_LENGTH = 25;
  const INVALID_NAME = /[^a-zA-Z.@]/g;
  const MIN_PASSWORD_LENGTH = 8;
  const LETTERS = /[a-zA-Z]/g;
  const NUMBERS = /[0-9]/g;


  let userName = userNameInput.value.trim();
  let password = passwordInput.value.trim();

  if (userName === "" || password === "") {
    displayErrorMessage("<P>Username or Password is empty</P>");
    return false;
  }

  if (userName.length > MAX_USER_NAME_LENGTH) {
    displayErrorMessage(`<p>Username must be less than ${MAX_USER_NAME_LENGTH} characters</P>`);
    return false;
  }

  if (userName.match(INVALID_NAME)) {
    displayErrorMessage("<p>Username only contain letters, full stops(.) and the at sign(@). (no spaces)</P>");
    return false;
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    displayErrorMessage(`<p>Password must be at least ${MIN_PASSWORD_LENGTH} characters</P>`);
    return false;
  }

  if (!password.match(LETTERS) || !password.match(NUMBERS)) {
    displayErrorMessage("<p>Password must contain both letters and numbers (no spaces)</P>");
    return false;
  }

  if (passwordContainsIllegalKeywords(userName, password)) {
    displayErrorMessage("<p>Username or Password contains illegal keywords</P>");
    return false;
  }
  
  return true;
}

// Validate username and password on form submission
loginCheckerForm.addEventListener("submit", function(event) {
  const logInFormIsValid = validateLogInForm();

  if (!logInFormIsValid) {
    event.preventDefault();
  }
});