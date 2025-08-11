# Currency Converter

A simple and responsive currency converter web app built with HTML, CSS, and JavaScript. It fetches live exchange rates from the [Frankfurter API](https://www.frankfurter.app/) to convert between different currencies.

## Features

- Convert currency amounts between multiple currencies.
- Displays currency flags for better user experience.
- Switch between “From” and “To” currencies with a single click.
- Responsive design for use on desktop and mobile devices.
- Loading spinner while fetching conversion rates.
- Validation for positive amounts.

## Technologies Used

- HTML5
- CSS3 (Flexbox)
- JavaScript (ES6+)
- [Frankfurter API](https://www.frankfurter.app/) for currency exchange rates

## How to Use

1. Select the currency you want to convert from and to using the dropdown menus.
2. Enter the amount to convert.
3. Click the “Convert” button to see the converted amount.
4. Use the switch button to swap the “From” and “To” currencies easily.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/currency-converter.git
   ```

2. Open `index.html` in your browser.

## Folder Structure

/
├── index.html         # Main HTML file
├── styles.css         # Stylesheet
├── index.js           # JavaScript logic
└── assets/            # Images


## Notes

- The app requires internet access to fetch live currency data.
- Currently uses the Frankfurter API which does not require an API key.

## License

This project is licensed under the MIT License.