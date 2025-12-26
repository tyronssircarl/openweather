# Weather App

A simple and functional web-based weather application that fetches real-time weather data using the OpenWeather API. The application allows users to search for weather information by city name and displays comprehensive weather details in a clean and responsive interface.

## Project Description

This weather application provides users with current weather information for any city worldwide. Users can search for weather data by entering a city name, and the application will display temperature, humidity, wind speed, pressure, and other relevant weather details. The interface features a simple design with loading animations, error handling, and responsive layout that works seamlessly across all device sizes.

## How to Run the Project

1. Navigate to the openweather folder in your file system
2. Open the config.js file and replace YOUR_API_KEY_HERE with your actual OpenWeather API key
3. Double-click on the index.html file
4. The weather app will open in your default web browser

## File Structure

The project consists of exactly four files as required:

1. index.html - Contains the HTML structure and layout of the weather application
2. style.css - Contains all styling rules, responsive design, and animations
3. script.js - Contains all JavaScript functions for API calls and DOM manipulation
4. config.js - Contains the API key configuration

All files are located in the openweather directory. No inline CSS or JavaScript is used in the HTML file.

## API Documentation

### Base URL

https://api.openweathermap.org/data/2.5/weather

### Endpoints

Current Weather Data
This endpoint provides current weather data for any city.

Endpoint: GET /weather

Query Parameters:
- q: City name (required)
- appid: API key (required)
- units: Unit of measurement (optional, default: kelvin, used: metric)

Example Request:
https://api.openweathermap.org/data/2.5/weather?q=Manila&appid=YOUR_API_KEY&units=metric

### Required Parameters

Query Parameters:
- q: The city name to search for (string, required)
- appid: Your OpenWeather API key (string, required)
- units: Measurement units, set to metric for Celsius (string, optional)

### Authentication

API Key
This API requires an API key for authentication. The API key must be included in every request as a query parameter named appid.

How to get an API key:
1. Visit https://openweathermap.org/api
2. Sign up for a free account
3. Navigate to API keys section
4. Generate a new API key
5. Copy the API key and paste it in the config.js file

### Sample JSON Response

{
    "coord": {
        "lon": 120.9822,
        "lat": 14.6042
    },
    "weather": [
        {
            "id": 801,
            "main": "Clouds",
            "description": "few clouds",
            "icon": "02d"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 32.5,
        "feels_like": 38.2,
        "temp_min": 30.1,
        "temp_max": 34.8,
        "pressure": 1010,
        "humidity": 65
    },
    "visibility": 10000,
    "wind": {
        "speed": 3.5,
        "deg": 180
    },
    "clouds": {
        "all": 20
    },
    "dt": 1699123456,
    "sys": {
        "type": 1,
        "id": 8166,
        "country": "PH",
        "sunrise": 1699091234,
        "sunset": 1699134567
    },
    "timezone": 28800,
    "id": 1701668,
    "name": "Manila",
    "cod": 200
}

### Fetch the Data (JavaScript)

The application uses fetch() with async/await to retrieve weather data from the OpenWeather API.

async function fetchWeatherData(cityName) {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const params = new URLSearchParams({
        q: cityName,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
    });
    
    const url = apiUrl + '?' + params.toString();
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the city name and try again.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your configuration.');
            } else {
                throw new Error('Failed to fetch weather data. Please try again later.');
            }
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        if (error.message) {
            throw error;
        } else {
            throw new Error('Network error. Please check your connection and try again.');
        }
    }
}

### Display in HTML (DOM)

The weather data is displayed using a card layout:

Card Layout
The main weather information is displayed in a card container with the following elements:
- City name and country
- Current temperature in large font
- Weather description
- Detailed information grid showing feels like temperature, humidity, wind speed, and pressure

The card uses CSS Grid for the details section and Flexbox for overall layout, ensuring proper display across all devices.

### Error Handling

The application includes comprehensive error handling for various scenarios:

No Results Found
When a city is not found, the application displays: "City not found. Please check the city name and try again."

Invalid Input
The application validates user input and displays appropriate error messages:
- Empty field: "Please enter a city name"
- Invalid characters: "Invalid characters in city name"

Failed API Call
When the API call fails, the application displays: "Failed to fetch weather data. Please try again later."

Loading Message
A loading spinner and "Loading..." text are displayed while fetching data from the API.

### Input Validation

The application includes comprehensive input validation:

Check Empty Fields
The search input is validated to ensure it is not empty before making an API request.

Check Invalid Characters
The input is checked for invalid characters such as angle brackets, curly braces, and square brackets.

Disable Button While Loading
The search button is disabled and shows a loading animation while processing the request to prevent multiple submissions.

Auto-Trim Whitespace
The input value is automatically trimmed of leading and trailing whitespace before validation and API call.

### Loading State

The application displays a loading state while fetching data:

Loading Spinner
A circular spinner animation is displayed in the center of the loading area.

Loading Text
"Loading..." text is displayed below the spinner to inform users that data is being fetched.

The loading state is automatically hidden when data is received or when an error occurs.

### Responsive Design

The application is fully responsive and works on all screen sizes:

Website
The application is optimized for desktop, tablet, and mobile devices with appropriate media queries and flexible layouts.

Mobile Devices
On mobile devices, the search container stacks vertically, the details grid becomes a single column, and font sizes are adjusted for better readability.

### Comments in Code

The JavaScript code includes comments explaining key functions:

Function Explanations
Comments are provided for the main functions including fetchWeatherData, displayWeatherData, and handleSearch.

API Call Explanations
The fetchWeatherData function includes comments explaining the API call process and error handling.

DOM Manipulation Comments
Comments explain how weather data is displayed in the HTML elements.

### File Requirements

The project includes exactly 4 files:

1. index.html - HTML structure and layout
2. style.css - All styling and responsive design
3. script.js - JavaScript functions and API calls
4. config.js - API key configuration

No inline CSS or JavaScript is used in the HTML file.

### Code Organization

The code is organized using functions only:

Use Functions
All code uses functions, no classes or constructors are used.

Separate API Functions
The fetchWeatherData function handles all API communication.

DOM Functions
Functions like displayWeatherData handle DOM manipulation.

Utility Functions
Functions like validateInput, showLoading, and showError handle utility operations.

No Duplicated Code
All functions are reusable and there is no code duplication.

### UI Requirements

The interface includes all required elements:

Search Bar
A text input field where users can enter city names.

Buttons
A search button to trigger the weather data fetch.

Results Container
A card container that displays the weather information when data is successfully retrieved.

Error Container
A dedicated error message area that displays error messages when something goes wrong.

Footer with Credits
A footer section that credits OpenWeather API as the data source.

### API Key Security

The API key is stored in a separate config.js file:

Must Store in config.js
The API key is stored in the config.js file, not hardcoded in the main script.

File Must Be Imported
The config.js file is imported in the HTML file before script.js.

Key Must NOT Be Committed
The config.js file contains a placeholder "YOUR_API_KEY_HERE" that should be replaced with the actual API key. This placeholder should not be committed to GitHub with a real API key.

### CSS Requirements

The stylesheet includes the following features:

Card Layout
The weather information is displayed in a card container with hover effects.

Grid Gallery
The weather details are displayed in a responsive grid layout.

Responsive Image
The layout adapts to different screen sizes using media queries.

Hover Effect
The weather card has a hover effect that adds a shadow for better user interaction.

Custom Color Theme
The application uses a custom color scheme with blue as the primary color for buttons and temperature display.

## Features

Weather Search
Users can search for weather information by entering any city name in the search field.

Real-Time Data
The application fetches current weather data from OpenWeather API in real-time.

Comprehensive Information
Displays temperature, feels like temperature, humidity, wind speed, and atmospheric pressure.

Error Handling
Comprehensive error handling for invalid inputs, network errors, and API errors.

Loading States
Visual loading indicators during API requests to improve user experience.

Responsive Design
Fully responsive layout that works on desktop, tablet, and mobile devices.

Input Validation
Validates user input to prevent invalid API requests.

## Technologies Used

HTML5 - For the structure and semantic markup
CSS3 - For styling, layout, responsive design, and animations
JavaScript (Vanilla) - For API calls, DOM manipulation, and interactivity
OpenWeather API - For weather data

## Usage Instructions

1. Enter a city name in the search input field
2. Click the Search button or press Enter
3. Wait for the weather data to load
4. View the weather information displayed in the card
5. Search for another city by entering a new city name

Example Usage:
1. Type "Manila" in the search field
2. Click Search
3. View weather information for Manila

## Code Organization

The JavaScript code is organized using functions only. No classes, constructors, or initialization functions are used. The code structure includes:

Main Functions:
- fetchWeatherData() - Fetches weather data from OpenWeather API using async/await
- displayWeatherData() - Displays the fetched weather data in the HTML elements
- handleSearch() - Main function that orchestrates the search process
- validateInput() - Validates user input before making API calls
- showLoading() - Displays loading state
- hideLoading() - Hides loading state
- showError() - Displays error messages
- hideError() - Hides error messages
- showResults() - Displays the results container
- addLoadingState() - Adds loading animation to button
- removeLoadingState() - Removes loading animation from button

Event Listeners:
- Search button click event
- Search input Enter key press event

## Responsive Design

The application is fully responsive and includes media queries for different screen sizes:

Mobile Devices (max-width: 480px)
- Stacked search container
- Single column details grid
- Reduced font sizes
- Adjusted padding and spacing

Small Mobile Devices (max-width: 360px)
- Further reduced dimensions
- Optimized spacing for very small screens

Tablet and Desktop (min-width: 768px)
- Two-column grid for weather details
- Larger font sizes
- Enhanced spacing for better usability

The application uses CSS Grid for the details layout and Flexbox for container alignment, ensuring proper display across all devices.

## Browser Compatibility

This weather application works on all modern web browsers including:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari
- Opera

## Project Requirements Compliance

The project follows all specified requirements:
- Uses functions only in JavaScript, no constructors or init functions
- No document.onload or similar initialization events
- Separate CSS and JavaScript files, no inline code
- Responsive design for all screen sizes including mobile
- Loading animations on buttons to prevent double clicks
- Unique classnames prefixed with openWeather-
- Proper code indentation and formatting
- Simple and functional UI without fancy elements
- No emojis or icons used
- No gradient colors, only solid colors
- Five Tagalog comments in JavaScript for main functions
- API key stored in config.js file
- Comprehensive error handling
- Input validation
- Loading states
- Footer with API credits

## License

This project is created for educational purposes.

## Author

Created as part of a web development project.

## Version

Version 1.0.0

