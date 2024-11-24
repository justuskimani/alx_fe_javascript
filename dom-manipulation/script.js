// Mock API URL
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Quotes array (local)
let quotes = [];

// Fetch quotes from local storage on initialization
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  quotes = storedQuotes ? JSON.parse(storedQuotes) : [];
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Notify user of updates
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
  setTimeout(() => notification.remove(), 5000); // Remove after 5 seconds
}

// Fetch quotes from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    const serverQuotes = await response.json();

    // Map server data to expected format
    return serverQuotes.map((post) => ({
      text: post.title,
      category: "General",
    }));
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    notifyUser("Failed to fetch quotes from the server. Please try again later.");
    return [];
  }
}

// Post a quote to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quote),
    });

    if (!response.ok) throw new Error(`Failed to post: ${response.statusText}`);
    const result = await response.json();
    console.log("Quote successfully posted to the server:", result);
  } catch (error) {
    console.error("Error posting quote to the server:", error);
    notifyUser("Failed to sync quote to the server. Please try again.");
  }
}

// Sync quotes with the server
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();

    // Merge server quotes with local quotes
    const localTexts = quotes.map((quote) => quote.text);
    serverQuotes.forEach((serverQuote) => {
      if (!localTexts.includes(serverQuote.text)) {
        quotes.push(serverQuote);
      }
    });

    // Save updated quotes locally
    saveQuotes();

    // Post new local quotes to the server
    const serverTexts = serverQuotes.map((quote) => quote.text);
    for (const localQuote of quotes) {
      if (!serverTexts.includes(localQuote.text)) {
        await postQuoteToServer(localQuote);
      }
    }

    notifyUser("Quotes successfully synced with the server!");
  } catch (error) {
    console.error("Error syncing quotes:", error);
    notifyUser("Failed to sync quotes. Please try again later.");
  }
}

// Show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    notifyUser("No quotes available. Add a new quote or sync with the server.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerText = `"${quote.text}" - ${quote.category}`;
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newQuote = {
    text: textInput.value.trim(),
    category: categoryInput.value.trim() || "General",
  };

  if (!newQuote.text) {
    notifyUser("Quote text cannot be empty.");
    return;
  }

  quotes.push(newQuote);
  saveQuotes();
  notifyUser("New quote added!");
  textInput.value = "";
  categoryInput.value = "";
}

// Populate categories dynamically
function populateCategories() {
  const categories = [...new Set(quotes.map((quote) => quote.category))];
  const categoryFilter = document.getElementById("categoryFilter");

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes by category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerText = `"${quote.text}" - ${quote.category}`;
  } else {
    quoteDisplay.innerText = "No quotes found for the selected category.";
  }
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    notifyUser("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Export quotes to a JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  syncQuotes(); // Initial sync with the server

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  setInterval(syncQuotes, 30000); // Sync with the server every 30 seconds
});
	

	
