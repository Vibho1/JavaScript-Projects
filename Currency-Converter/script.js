// Check if countryList is not already defined
if (typeof countryList === 'undefined') {
    const countryList = {
      USD: "us",
      INR: "in",
      // Add more mappings as needed
    };
  }
  
  const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
  const dropdowns = document.querySelectorAll(".dropdown select");
  const btn = document.querySelector("form button");
  const fromCurr = document.querySelector(".from select");
  const toCurr = document.querySelector(".to select");
  const msg = document.querySelector(".msg");
  
  const fetchJSON = async (url) => {
    try {
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching JSON:", error);
      return null;
    }
  };
  
  const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
      amtVal = 1;
      amount.value = "1";
    }
    
    const fromCurrency = fromCurr.value.toLowerCase();
    const toCurrency = toCurr.value.toLowerCase();
    const URL = `${BASE_URL}/${fromCurrency}.json`;
  
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate data.");
      }
      const data = await response.json();
  
      // Check if data is available for the selected currency pair
      if (!data || !data[fromCurrency] || !data[fromCurrency][toCurrency]) {
        throw new Error("Exchange rate data not available for selected currency pair.");
      }
  
      // Get the exchange rate and calculate the final amount
      const rate = data[fromCurrency][toCurrency];
      const finalAmount = amtVal * rate;
  
      // Update the message with the exchange rate information
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
      console.error("Error updating exchange rate:", error.message);
      msg.innerText = "Failed to fetch exchange rate data. Please try again later.";
    }
  };
  
  const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
  };
  
  for (let select of dropdowns) {
    for (let currCode in countryList) {
      let newOption = document.createElement("option");
      newOption.innerText = currCode;
      newOption.value = currCode;
      if (select.name === "from" && currCode === "USD") {
        newOption.selected = "selected";
      } else if (select.name === "to" && currCode === "INR") {
        newOption.selected = "selected";
      }
      select.append(newOption);
    }
  
    select.addEventListener("change", (evt) => {
      updateFlag(evt.target);
    });
  }
  
  btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
  });
  
  window.addEventListener("load", () => {
    updateExchangeRate();
  });
  
