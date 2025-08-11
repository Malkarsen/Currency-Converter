const FORM_SELECT = document.querySelectorAll(".form_select");
const CURRENCY_IMG = document.querySelectorAll(".currency_img");
const CURRENCY_LABEL = document.querySelectorAll(".currency_label");

const FROM_SELECT = document.querySelector("#from_select");
const FROM_CURRENCY_IMG = document.querySelector("#from_currency_img");
const FROM_CURRENCY_LABEL = document.querySelector("#from_currency_label");

const TO_SELECT = document.querySelector("#to_select");
const TO_CURRENCY_IMG = document.querySelector("#to_currency_img");
const TO_CURRENCY_LABEL = document.querySelector("#to_currency_label");

const SWITCH_CURRENCY_BUTTON = document.querySelector(
  ".switch_currency_button"
);

const RATES_LABEL = document.querySelector("#rates_label");
const AMOUNT_INPUT = document.querySelector("#amount_input");

const CONVERTER_FORM = document.querySelector(".converter_form");

const RESULT = document.querySelector(".result");

const SPINNER = document.querySelector("#spinner");

let currencies = {};

//-------------------------------------------------------------------------

const formatCurrency = (amount, code) => {
  const locale = navigator.language || 'en-GB'; 
  // const locale = "de-DE"; 
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code
  }).format(amount);
};

//-------------------------------------------------------------------------

const updateCurrencyImage = (SELECT, CURRENCY_IMG) => {
  const start_img_URL = "https://hatscripts.github.io/circle-flags/flags/";
  const end_img_URL = ".svg";

  const currencyNameForImg = SELECT.value.toLowerCase().substring(0, 2);

  CURRENCY_IMG.src = `${start_img_URL}${currencyNameForImg}${end_img_URL}`;
};

const updateCurrencyLabel = (SELECT, CURRENCY_LABEL) => {
  const currencyName = SELECT.value;
  const currencyFullName = currencies[currencyName];

  CURRENCY_LABEL.textContent = currencyFullName;
};

const updateRatesLabel = async () => {
  const currencyFromName = FROM_SELECT.value;
  const currencyToName = TO_SELECT.value;
  RATES_LABEL.textContent = await getConvertedAmountAsString(
    currencyFromName,
    currencyToName,
    1
  );
};

const updateAmountPlaceholder = (amount) => {
  const currency = FROM_SELECT.value;
  AMOUNT_INPUT.placeholder = formatCurrency(amount, currency);
}

//-------------------------------------------------------------------------

const convert = async (from, to, amount) => {
  const URL = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;

  const response = await fetch(URL, { method: "GET" });
  const result = await response.json();

  if (response.ok) {
    return result.rates[to].toFixed(2);
  } else {
    alert(`Error: ${response.status}. Please try again later`);
    return null;
  }
};

const getConvertedAmountAsString = async (from, to, amount) => {
  const convertedAmount = await convert(from, to, amount);
  return convertedAmount !== null
    ? `${amount} ${from} = ${convertedAmount} ${to}`
    : null;
};

//-------------------------------------------------------------------------

const setValueForFormSelect = async () => {
  const URL = "https://api.frankfurter.dev/v1/currencies";
  const response = await fetch(URL, { method: "GET" });
  const result = await response.json();

  if (response.ok) {
    currencies = result;
    const currencyNames = Object.keys(result);

    FORM_SELECT.forEach((form_select, formIndex) => {
      currencyNames.forEach((currencyName) => {
        const OPTION = document.createElement("option");
        OPTION.value = currencyName;
        OPTION.textContent = currencyName;
        if (formIndex === 0 && currencyName === "USD") {
          OPTION.selected = true;
        }
        if (formIndex === 1 && currencyName === "EUR") {
          OPTION.selected = true;
        }

        form_select.append(OPTION);
      });
      updateCurrencyImage(form_select, CURRENCY_IMG[formIndex]);
      updateCurrencyLabel(form_select, CURRENCY_LABEL[formIndex]);
    });
    updateRatesLabel();
    updateAmountPlaceholder(100);
  } else {
    alert(`Error: ${response.status}. Please try again later`);
  }
};
setValueForFormSelect();

const handleCurrencyChange = (select, img, label) => {
  updateCurrencyImage(select, img);
  updateCurrencyLabel(select, label);
  updateRatesLabel();
  updateAmountPlaceholder(100);
  RESULT.textContent = "";
};

FROM_SELECT.addEventListener("change", () =>
  handleCurrencyChange(FROM_SELECT, FROM_CURRENCY_IMG, FROM_CURRENCY_LABEL)
);
TO_SELECT.addEventListener("change", () =>
  handleCurrencyChange(TO_SELECT, TO_CURRENCY_IMG, TO_CURRENCY_LABEL)
);

//-------------------------------------------------------------------------

SWITCH_CURRENCY_BUTTON.addEventListener("click", () => {
  const currencyFromName = FROM_SELECT.value;
  const currencyToName = TO_SELECT.value;

  FROM_SELECT.value = currencyToName;
  TO_SELECT.value = currencyFromName;

  updateCurrencyImage(FROM_SELECT, FROM_CURRENCY_IMG);
  updateCurrencyLabel(FROM_SELECT, FROM_CURRENCY_LABEL);
  updateCurrencyImage(TO_SELECT, TO_CURRENCY_IMG);
  updateCurrencyLabel(TO_SELECT, TO_CURRENCY_LABEL);
  updateRatesLabel();
});

//-------------------------------------------------------------------------

const showSpinner = () => {
  SPINNER.classList.remove("hidden");
};

const hideSpinner = () => {
  SPINNER.classList.add("hidden");
};

CONVERTER_FORM.addEventListener("submit", async (event) => {
  event.preventDefault();
  showSpinner();

  const amount = event.target.amount.value;

  if (amount !== "") {
    const normalizedAmount = Number(amount);

    if (normalizedAmount > 0) {
      const converted = await getConvertedAmountAsString(
        FROM_SELECT.value,
        TO_SELECT.value,
        normalizedAmount
      );
      if (converted !== null) {
        RESULT.textContent = converted;
      }
    } else {
      alert("Please, enter a positive value!");
    }
  } else {
    alert("Please, enter an amount!");
  }

  hideSpinner();
});
