// Sync quotes with the server
async function syncQuotes() {
  try {
    // Fetch server quotes
    const response = await fetch(SERVER_URL);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    const serverQuotes = (await response.json()).map((post) => ({
      text: post.title,
      category: "General",
    }));

    // Merge server quotes with local quotes
    const localTexts = quotes.map((quote) => quote.text);
    serverQuotes.forEach((serverQuote) => {
      if (!localTexts.includes(serverQuote.text)) {
        quotes.push(serverQuote); // Add missing server quotes locally
      }
    });

    // Save merged quotes to local storage
    saveQuotes();

    // Optionally push new local quotes to the server
    const serverTexts = serverQuotes.map((quote) => quote.text);
    for (const localQuote of quotes) {
      if (!serverTexts.includes(localQuote.text)) {
        await postQuoteToServer(localQuote);
      }
    }

    // Notify user of successful sync
    notifyUser("Quotes successfully synced with the server!");
  } catch (error) {
    console.error("Error syncing quotes:", error);
    notifyUser("Failed to sync quotes. Please try again later.");
  }
}
	
