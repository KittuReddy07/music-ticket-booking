// Booking page

const ticketOrderForm = document.querySelector("#ticket-order-form");
const ticketOrderBasket = document.querySelector("#ticket-order-basket");
const currentTicketTable = document.querySelector("#current-ticket-table");

const userFullNameInput = document.querySelector("#user-fullname");
const userEmailInput = document.querySelector("#user-email");
const userCreditCardInput = document.querySelector("#user-credit-number");
const errorMessage = document.querySelector("#error-message");

/**
 * Populate the table of current ticket
 */ 
populateCurrentTicketTable();

/**
 * Output details of each ticket.
 * 
 * Each ticket gets a button to get an event handler
 * that user add them to a basket.  
 */
function populateCurrentTicketTable() {
  let HTMLToWrite = `
    <tr>
      <th>Artist</th>
      <th>Location</th>
      <th>Capacity</th>
      <th>Concert Date</th>
      <th>Ticket Price</th>
      <th>Quantity</th>
    </tr>
  `;

  for (const ticket of tickets) {
    HTMLToWrite += `
      <tr>
        <td>${ticket.artist}</td>
        <td>${ticket.venue.location}</td>
        <td>${ticket.venue.capacity}</td>
        <td>${ticket.concertdate}</td>
        <td>£${ticket.ticketprice.toFixed(2)}</td>
        <td>
          <button class="ticket-book-btn" id="${ticket.id}">Book</button>
        </td>
      </tr>
    `;
  }
  
  currentTicketTable.innerHTML = HTMLToWrite;
  addBookButtonEventHandlers();
}

/**
 * Attach event handlers to the buttons in the current ticket table 
 * that allow user to add ticket to the basket.
 */
function addBookButtonEventHandlers() {
  const ticketBookBtns = document.querySelectorAll(".ticket-book-btn");
  
  for (const btn of ticketBookBtns) {
    btn.addEventListener("click", function(event) {     
      addTicketToBasket(String(event.target.id));
    });
  }
}

// Stores tickets to be booked
let ticketToBasket = [];

function resetAppState() {
  ticketToBasket = [];
  populateTicketToBasketTable();

  userFullNameInput.value = "";
  userEmailInput.value = "";
  userCreditCardInput.value = "";

}

function displayErrorMessage(errorMsg) {
  errorMessage.innerHTML = errorMsg;
  
}

/**
 * Adds the associated ticket to the basket so as long as  
 * it isn't already on the basket.
 */
function addTicketToBasket(ticketID) {
  let alreadyContainsTicket = false;
  
  if (ticketToBasket.length > 0) {
    for (const ticket of ticketToBasket) {
      if (ticket.id === ticketID) {
        alreadyContainsTicket = true;
      }
    }
    
    if (alreadyContainsTicket) {
      return;
    }
  }
  
  let ticketToAdd = {};
  
  for (const ticket of tickets) {
    if (ticket.id === ticketID) {
      ticketToAdd = ticket;
    }
  }
  
  ticketToAdd.quantity = 1;
  
  ticketToBasket.push(ticketToAdd);
  populateTicketToBasketTable();
}

/**
 * Display the contents of the user’s basket. 
 * Including the following information for each ticket: 
 * Artist, Venue, Date, Number of tickets ordered and Ticket price.
 */
function populateTicketToBasketTable() {
  let HTMLToWrite = "";
  
  if (ticketToBasket.length > 0) {
    HTMLToWrite = `
      <tr>
        <th>Artist</th>
        <th>Venue</th>
        <th>Date</th>
        <th>Number of tickets ordered</th>
        <th>Ticket price</th>
      </tr>
    `;
  }
  
  for (const ticket of ticketToBasket) {
    HTMLToWrite += `
      <tr>
        <td>${ticket.artist}</td>
        <td>${ticket.venue.location} / ${ticket.venue.capacity}</td>
        <td>${ticket.concertdate}</td>
        <td>
          <input 
            class="quantity-inputs" 
            type="number" 
            min="0" 
            max="6" 
            id="${ticket.id}" 
            value="${ticket.quantity}"
          >
          <button type="button" id="${ticket.id}" class="remove-btn">Remove</button>
        </td>
        <td>£${ticket.ticketprice * ticket.quantity}</td>
      </tr>
    `;
  }
  ticketOrderBasket.innerHTML = HTMLToWrite;
  addChangeQuantityEventHandlers();
  addRemoveButtonEventHandlers();
}

/**
 * Attach event handlers to the inputs in the ticket to basket 
 * that allow user to update the quantity of tickets to order.
 * 
 * The ticket ID and new quantity value are passed to the update 
 * function.
 */
function addChangeQuantityEventHandlers() {
  const quantityInputs = document.querySelectorAll(".quantity-inputs");
  
  for (const input of quantityInputs) {
    input.addEventListener("change", function(event) {
      const id = String(event.target.id);
      const newQuantity = Number(event.target.value);

      updateTicketToOrderQuantity(id, newQuantity);
    });
  }
}

/**
 * Update quantity of a ticket in the basket.
 */
function updateTicketToOrderQuantity(ticketID, newQuantity) {

  if (newQuantity === 0) {
    removeTicketFromBasket(ticketID);
    
    populateTicketToBasketTable();    
    return;
  }

  if (newQuantity === 6) {
    alert("Sorry! You can only order the same ticket for up to 6.");
    return;
  }
  
  for (const ticket of ticketToBasket) {
    if (ticket.id === ticketID) {
      ticket.quantity = newQuantity;
    }
  }
  populateTicketToBasketTable();
}

/**
 * Attach event handlers to the buttons in the basket 
 * that allow user to remove that ticket from the basket.
 */
function addRemoveButtonEventHandlers() {
  const ticketRemoveBtns = document.querySelectorAll(".remove-btn");
  
  for (const btn of ticketRemoveBtns) {
    btn.addEventListener("click", function(event) { 
      const id = String(event.target.id);
      removeTicketFromBasket(id);
      populateTicketToBasketTable();
    });
  }
}

/**
 * Overwrites the basket with a new one containing all 
 * tickets except for the one specified.
 */
function removeTicketFromBasket(ticketID) {
  let newTicketToBasket = [];

  for (const ticket of ticketToBasket) {
    if (ticket.id !== ticketID) {
      newTicketToBasket.push(ticket);
    }
  }
  ticketToBasket = newTicketToBasket;
}

/**
 * Handle submission of the stock order form
 */
 ticketOrderForm.addEventListener("submit", function(event) {
  event.preventDefault();

  submitTicketOrderRequest();
});

/**
 * Gets the Full name, Email and Credit card number of the users
 * making the order request and outputs this information 
 * alongside the total order price using an alert().
 * 
 * Users may order multiple of the same ticket 
 * to a maximum of 6 times.
 * 
 * Users will have to pay an additional £12 fee 
 * if they order 4 or more tickets.
 */
function submitTicketOrderRequest() {
  const formIsValid = validateForm();

  if (!formIsValid) {
    return;
  }

  let additionalCharge = 0;

  const totalTicketNumber = calculateTotalTicketNumber();
  const totalOrderPrice = calculateTotalOrderPrice();


  if (totalTicketNumber >= 4) {
    additionalCharge = 12;
  }

  const message = `
    Order requested by
      Fullname: ${userFullNameInput.value.trim()} 
      Email: ${userEmailInput.value.trim()}
      Credit Card number: ${userCreditCardInput.value.trim()}

    Cost of order: £${totalOrderPrice.toFixed(2)}
    Additional charge: £${additionalCharge}
    Combined total: £${(totalOrderPrice + additionalCharge).toFixed(2)}
  `;

  alert(message);
  resetAppState();

}

/**
 * Validate form.
 * Allow users to submit their order so long as they have 
 * also provided the following details:
 * Full name, Email address and Credit card number
 */
 function validateForm() {

  const invalidFullName = /[^a-zA-Z '.-]/g;
  const invalidEmail = /[^a-zA-Z0-9.@]/g;
  const invalidCreditCard = /[^0-9]/g;
  const CREDIT_CARD_LENGTH = 16;

  displayErrorMessage("");

  if (ticketToBasket.length === 0) {
    displayErrorMessage("<p>Basket is empty</P>");
    return false;
  }

  let userFullName = userFullNameInput.value.trim();
  let userEmail = userEmailInput.value.trim();
  let userCreditCard = userCreditCardInput.value.trim();

  if (userFullName === "" || userEmail === "" || userCreditCard === "") {
    displayErrorMessage("<p>Full name, Email address and Credit Card number are required</p>");
    return false;
  }

  if (userFullName.match(invalidFullName) || userEmail.match(invalidEmail) || userCreditCard.match(invalidCreditCard)) {
    displayErrorMessage("<p>Full name, Email address or Credit Card number contain invalid characters</p>");
    return false;
  }

  if (userCreditCard.length < CREDIT_CARD_LENGTH || userCreditCard.length > CREDIT_CARD_LENGTH) {
    displayErrorMessage(`<p>Not a valid credit card number! Credit Card number must be ${CREDIT_CARD_LENGTH} digits</P>`);
    return false;
  }

  return true;
}

/**
 * Returns the total number of ticket to be booked.
 */
function calculateTotalTicketNumber() {
  let totalTicket = 0;

  for (const ticket of ticketToBasket) {
    totalTicket += ticket.quantity;
  }

  return totalTicket;
}

/**
 * Returns the total price of ticket to be booked.
 */
function calculateTotalOrderPrice() {
  let totalPrice = 0;

  for (const ticket of ticketToBasket) {
    totalPrice += ticket.ticketprice * ticket.quantity;
  }

  return totalPrice;
}

  





