// Array to store quotes
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspiration" },
  { text: "Believe you can and you're halfway there.", category: "Belief" },
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  // Clear the current content
  quoteDisplay.innerHTML = "";

  // Pick a random quote from the array
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Create new elements for the quote and category
  const quoteTextElem = document.createElement("p");
  quoteTextElem.textContent = `Quote: "${randomQuote.text}"`;
 
  const quoteCategoryElem = document.createElement("p");
  quoteCategoryElem.textContent = `Category: ${randomQuote.category}`;

  // Append the new elements to the quoteDisplay div
  quoteDisplay.appendChild(quoteTextElem);
  quoteDisplay.appendChild(quoteCategoryElem);
}

// Function to add a new quote
function addQuote() {
  // Get the values from the input fields
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  // Validate the input
  if (!newQuoteText || !newQuoteCategory) {
    alert("Both fields are required!");
    return;
  }

  // Add the new quote to the quotes array
  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  // Clear the input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Notify the user
  alert("New quote added successfully!");
}

// Add the form dynamically to the DOM
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  // Create input for the quote text
  const quoteTextInput = document.createElement("input");
  quoteTextInput.id = "newQuoteText";
  quoteTextInput.type = "text";
  quoteTextInput.placeholder = "Enter a new quote";

  // Create input for the quote category
  const quoteCategoryInput = document.createElement("input");
  quoteCategoryInput.id = "newQuoteCategory";
  quoteCategoryInput.type = "text";
  quoteCategoryInput.placeholder = "Enter quote category";

  // Create button to add a quote
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  // Append inputs and button to the form container
  formContainer.appendChild(quoteTextInput);
  formContainer.appendChild(quoteCategoryInput);
  formContainer.appendChild(addButton);

  // Append the form container to the body
  document.body.appendChild(formContainer);
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Attach the random quote functionality to the existing button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  // Dynamically create the form for adding quotes
  createAddQuoteForm();
});
	


