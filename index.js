// 1. Initialize the empty portfolio array (This was missing!)
const portfolio = [];

// 2. Define the StockPosition class
class StockPosition {
  constructor(ticker, shares, buyPrice) {
    this.ticker = ticker.toUpperCase();
    this.shares = shares;
    this.buyPrice = buyPrice;
  }

  getMarketValue() {
    return this.shares * this.buyPrice;
  }

  averageDown(newShares, newPrice) {
    const currentTotalCost = this.getMarketValue();
    const newTotalCost = newShares * newPrice;
    
    this.shares += newShares;
    this.buyPrice = (currentTotalCost + newTotalCost) / this.shares;
  }
}


// 3. A function to update the HTML display
function updateDisplay() {
  const container = document.getElementById("portfolioContainer");
  
  // Wipe it totally clean before drawing the stocks
  container.innerHTML = "";

  // NEW: Create a variable to track the grand total
  let grandTotal = 0;

  // Check if the portfolio is totally empty
  if (portfolio.length === 0) {
    container.innerHTML = "<p style='text-align: center;'>Your portfolio is empty. Add a stock to get started!</p>";
    document.getElementById("totalPortfolioValue").innerText = "Total: Rs. 0.00"; // Reset total
    return; 
  }

  // Loop through the array and build HTML for EACH stock
  portfolio.forEach(stock => {
    let totalValue = stock.shares * stock.buyPrice;
    
    // NEW: Add this stock's value to the grand total
    grandTotal += totalValue;

    const stockSlot = document.createElement("div");
    stockSlot.innerHTML = `
      <h3>${stock.ticker}</h3>
      <p>Shares: ${stock.shares.toLocaleString()}</p>
      <p>Avg Price: Rs. ${stock.buyPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
      <p>Total Value: Rs. ${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
    `;
    container.appendChild(stockSlot);
  });

  // NEW: Update the top bar with the formatted grand total
  document.getElementById("totalPortfolioValue").innerText = `Total: Rs. ${grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

// 4. The main function triggered by the Add/Update button
function addOrUpdateStock() {
  let tickerInput = window.prompt("Enter the stock ticker (e.g., OGDC, SYS):");
  if (!tickerInput) return; // Exit if user cancels
  
  let userTicker = tickerInput.toUpperCase().trim();
  let userShares = Number(window.prompt(`How many shares of ${userTicker} are you buying?`));
  let userPrice = Number(window.prompt(`At what price per share?`));

  if (isNaN(userShares) || isNaN(userPrice) || userShares <= 0 || userPrice <= 0) {
    window.alert("Invalid input. Please try again with valid numbers.");
    return;
  }

  const existingStock = portfolio.find(stock => stock.ticker === userTicker);

  if (existingStock) {
    // Average down if it exists
    existingStock.averageDown(userShares, userPrice);
  } else {
    // Add new stock (Fixed the stray bracket issue here)
    let newStock = new StockPosition(userTicker, userShares, userPrice);
    portfolio.push(newStock);
  }

  // UPDATE THE SCREEN
  updateDisplay();
}

// 5. Function to delete a stock from the portfolio
function deleteStock() {
  let tickerInput = window.prompt("Enter the stock ticker you want to delete (e.g., SYS):");
  
  if (!tickerInput) return; 
  
  let userTicker = tickerInput.toUpperCase().trim();
  
  // Find the index (position) of the stock in the array
  const stockIndex = portfolio.findIndex(stock => stock.ticker === userTicker);

  // If found (findIndex returns -1 if it can't find anything)
  if (stockIndex !== -1) {
    portfolio.splice(stockIndex, 1); 
    window.alert(`${userTicker} has been successfully deleted.`);
  } else {
    window.alert(`Could not find ${userTicker} in your portfolio.`);
  }

  updateDisplay();
}


function updateTime() {
    const now = new Date();
    // This automatically formats the time based on your computer's clock (e.g., 10:45:30 AM)
    document.getElementById("currentTime").innerText = now.toLocaleTimeString();
}

// 6. Connect the buttons to the functions
document.getElementById("button").onclick = addOrUpdateStock;
document.getElementById("deleteButton").onclick = deleteStock;

// Run once on load to show the "empty portfolio" message
updateDisplay();


// Update the clock every 1000 milliseconds (1 second)
setInterval(updateTime, 1000);
updateTime();