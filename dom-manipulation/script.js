Justus Kimani
	
8:18 PM (5 minutes ago)
	
to me
// Array to store quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspiration" },
  { text: "Believe you can and you're halfway there.", category: "Belief" },
];

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load last viewed quote using session storage
function loadLastViewedQuote() {
  const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastViewedQuote) {
    displayQuotes([JSON.parse(lastViewedQuote)]);
  }
}

// Function to display quotes
function displayQuotes(filteredQuotes) {
  const quoteDisplay = document.getElementById("quoteDisplay");

  // Clear the current content
  quoteDisplay.innerHTML = "";

  // Display each quote in the filtered quotes array
  filteredQuotes.forEach(quote => {
    const quoteTextElem = document.createElement("p");
    quoteTextElem.textContent = `Quote: "${quote.text}"`;

    const quoteCategoryElem = document.createElement("p");
    quoteCategoryElem.textContent = `Category: ${quote.category}`;

    // Append the quote elements to the display div
    quoteDisplay.appendChild(quoteTextElem);
    quoteDisplay.appendChild(quoteCategoryElem);

    // Save the last viewed quote to session storage
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
  });
}

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  displayQuotes([randomQuote]);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Both fields are required!");
    return;
  }

  // Add the new quote to the quotes array
  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  // Save quotes to local storage
  saveQuotes();

  // Clear the input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Notify the user
  alert("New quote added successfully!");

  // Update the category filter
  populateCategories();

  // Re-filter quotes after adding a new one
  filterQuotes();
}

// Function to populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(quote => quote.category))];

  // Clear existing options in the dropdown
  categoryFilter.innerHTML = "";

  // Populate the dropdown with unique categories
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  if (selectedCategory === "all") {
    displayQuotes(quotes);
  } else {
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    displayQuotes(filteredQuotes);
  }
}

// Function to restore the last selected category from local storage
function restoreLastSelectedCategory() {
  const lastSelectedCategory = localStorage.getItem("lastSelectedCategory") || "all";
  document.getElementById("categoryFilter").value = lastSelectedCategory;
  filterQuotes();
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.click();

  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
    populateCategories();
    filterQuotes();
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to create and add the form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteTextInput = document.createElement("input");
  quoteTextInput.id = "newQuoteText";
  quoteTextInput.type = "text";
  quoteTextInput.placeholder = "Enter a new quote";

  const quoteCategoryInput = document.createElement("input");
  quoteCategoryInput.id = "newQuoteCategory";
  quoteCategoryInput.type = "text";
  quoteCategoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(quoteTextInput);
  formContainer.appendChild(quoteCategoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);

  // Add export button
  const exportButton = document.createElement("button");
  exportButton.textContent = "Export Quotes to JSON";
  exportButton.addEventListener("click", exportToJsonFile);
  formContainer.appendChild(exportButton);

  // Add import file input
  const importFileInput = document.createElement("input");
  importFileInput.type = "file";
  importFileInput.id = "importFile";
  importFileInput.accept = ".json";
  importFileInput.addEventListener("change", importFromJsonFile);
  formContainer.appendChild(importFileInput);
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Load the last viewed quote
  loadLastViewedQuote();

  // Display the initial list of all quotes
  displayQuotes(quotes);

  // Attach the random quote functionality to the existing button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  // Dynamically populate the category filter
  populateCategories();

  // Restore the last selected category filter from local storage
  restoreLastSelectedCategory();

  // Create the form for adding new quotes
  createAddQuoteForm();
});
	
