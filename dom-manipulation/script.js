// Array to store quotes (synced with local storage and server)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspiration" },
];

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display quotes
function displayQuotes(filteredQuotes) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";
  filteredQuotes.forEach((quote) => {
    const quoteElem = document.createElement("div");
    quoteElem.innerHTML = `<p>Quote: "${quote.text}"</p><p>Category: ${quote.category}</p>`;
    quoteDisplay.appendChild(quoteElem);
  });
}

// Fetch quotes from the mock server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts"); // Mock server
    const serverQuotes = (await response.json()).map((post) => ({
      text: post.title,
      category: "General",
    }));

    // Resolve conflicts by merging data
    resolveConflicts(serverQuotes);

    console.log("Synced with server.");
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

// Resolve conflicts between local and server data
function resolveConflicts(serverQuotes) {
  const localTexts = quotes.map((quote) => quote.text);

  // Add server quotes that don't already exist locally
  serverQuotes.forEach((serverQuote) => {
    if (!localTexts.includes(serverQuote.text)) {
      quotes.push(serverQuote);
    }
  });

  // Save updated quotes to local storage
  saveQuotes();

  // Refresh the displayed quotes
  displayQuotes(quotes);
}

// Periodic sync with server
function startPeriodicSync() {
  setInterval(() => {
    console.log("Checking for server updates...");
    fetchQuotesFromServer();
  }, 60000); // Sync every 60 seconds
}

// Add a new quote locally
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Both fields are required!");
    return;
  }

  quotes.push({ text: newQuoteText, category: newQuoteCategory });
  saveQuotes();
  alert("New quote added successfully!");
  populateCategories();
  filterQuotes();
}

// Populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map((quote) => quote.category))];
  categoryFilter.innerHTML = "";

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  if (selectedCategory === "all") {
    displayQuotes(quotes);
  } else {
    displayQuotes(quotes.filter((quote) => quote.category === selectedCategory));
  }
}

// Notify users about conflicts
function notifyUser(message) {
  const notification = document.createElement("div");
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.padding = "10px";
  notification.style.backgroundColor = "#f8d7da";
  notification.style.color = "#721c24";
  notification.style.border = "1px solid #f5c6cb";
  notification.style.borderRadius = "5px";
  notification.innerText = message;

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 5000); // Remove notification after 5 seconds
}

// Notify about data updates
function handleServerUpdate() {
  notifyUser("Data synced with server!");
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  displayQuotes(quotes);
  populateCategories();
  filterQuotes();
  startPeriodicSync();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  // Initial fetch from server
  fetchQuotesFromServer();
});
	

