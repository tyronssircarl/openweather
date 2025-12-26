const searchInput = document.getElementById('openWeatherSearchInput');
const searchButton = document.getElementById('openWeatherSearchBtn');
const loadingDiv = document.getElementById('openWeatherLoading');
const errorDiv = document.getElementById('openWeatherError');
const resultsDiv = document.getElementById('openWeatherResults');
const suggestionsDiv = document.getElementById('openWeatherSuggestions');

let suggestionTimeout = null;
let currentSuggestions = [];

const cityNameEl = document.getElementById('openWeatherCityName');
const countryEl = document.getElementById('openWeatherCountry');
const temperatureEl = document.getElementById('openWeatherTemperature');
const descriptionEl = document.getElementById('openWeatherDescription');
const feelsLikeEl = document.getElementById('openWeatherFeelsLike');
const humidityEl = document.getElementById('openWeatherHumidity');
const windSpeedEl = document.getElementById('openWeatherWindSpeed');
const pressureEl = document.getElementById('openWeatherPressure');

function showLoading() {
    loadingDiv.style.display = 'flex';
    errorDiv.style.display = 'none';
    resultsDiv.style.display = 'none';
}

function hideLoading() {
    loadingDiv.style.display = 'none';
}

// ito yung error function, papakita nya lang if ano error
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    resultsDiv.style.display = 'none';
    hideLoading();
}

function hideError() {
    errorDiv.style.display = 'none';
}

function showResults() {
    resultsDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    hideLoading();
}

// etoy yung pag vavalidate lang ng input ng user
function validateInput(cityName) {
    const trimmed = cityName.trim();
    if (trimmed === '') {
        return {
            valid: false,
            message: 'Please enter a city name'
        };
    }
    
    const invalidChars = /[<>{}[\]\\\/]/;
    if (invalidChars.test(trimmed)) {
        return {
            valid: false,
            message: 'Invalid characters in city name'
        };
    }
    
    return {
        valid: true,
        value: trimmed
    };
}

function addLoadingState(button) {
    button.classList.add('loading');
    button.disabled = true;
}

function removeLoadingState(button) {
    button.classList.remove('loading');
    button.disabled = false;
}

function hideSuggestions() {
    suggestionsDiv.style.display = 'none';
    currentSuggestions = [];
}

function showSuggestions() {
    if (currentSuggestions.length > 0) {
        suggestionsDiv.style.display = 'block';
    } else {
        hideSuggestions();
    }
}

//  ito namn yung suggestions na function, pag nag type yung user mag ssugest ng city 
async function fetchCitySuggestions(query) {
    if (query.trim().length < 2) {
        hideSuggestions();
        return;
    }
    
    const apiUrl = 'https://api.openweathermap.org/geo/1.0/direct';
    const params = new URLSearchParams({
        q: query,
        limit: 5,
        appid: OPENWEATHER_API_KEY
    });
    
    const url = apiUrl + '?' + params.toString();
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            hideSuggestions();
            return;
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        hideSuggestions();
        return [];
    }
}

function displaySuggestions(suggestions) {
    currentSuggestions = suggestions;
    
    if (suggestions.length === 0) {
        hideSuggestions();
        return;
    }
    
    suggestionsDiv.innerHTML = '';
    
    suggestions.forEach(function(suggestion) {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'openWeather-suggestion-item';
        
        const cityName = document.createElement('div');
        cityName.className = 'openWeather-suggestion-city';
        cityName.textContent = suggestion.name;
        
        const countryName = document.createElement('div');
        countryName.className = 'openWeather-suggestion-country';
        let countryText = suggestion.country;
        if (suggestion.state) {
            countryText = suggestion.state + ', ' + countryText;
        }
        countryName.textContent = countryText;
        
        suggestionItem.appendChild(cityName);
        suggestionItem.appendChild(countryName);
        
        suggestionItem.addEventListener('click', function() {
            const fullCityName = suggestion.name + (suggestion.state ? ', ' + suggestion.state : '') + ', ' + suggestion.country;
            searchInput.value = fullCityName;
            hideSuggestions();
            handleSearch();
        });
        
        suggestionsDiv.appendChild(suggestionItem);
    });
    
    showSuggestions();
}

function handleInputChange() {
    const query = searchInput.value.trim();
    
    if (suggestionTimeout) {
        clearTimeout(suggestionTimeout);
    }
    
    if (query.length < 2) {
        hideSuggestions();
        return;
    }
    
    suggestionTimeout = setTimeout(async function() {
        const suggestions = await fetchCitySuggestions(query);
        displaySuggestions(suggestions);
    }, 300);
}

//dto ung sa pag fefwetch na talaga ng data o weather doon sa openweahter api based sa input ni user
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

// ito namn is yung pag didisplay na natin yung data sa page 
function displayWeatherData(data) {
    cityNameEl.textContent = data.name;
    countryEl.textContent = data.sys.country;
    temperatureEl.textContent = Math.round(data.main.temp) + '°C';
    descriptionEl.textContent = data.weather[0].description;
    feelsLikeEl.textContent = Math.round(data.main.feels_like) + '°C';
    humidityEl.textContent = data.main.humidity + '%';
    windSpeedEl.textContent = data.wind.speed + ' m/s';
    pressureEl.textContent = data.main.pressure + ' hPa';
    
    showResults();
}


async function handleSearch() {
    const cityName = searchInput.value;
    const validation = validateInput(cityName);
    
    if (!validation.valid) {
        showError(validation.message);
        return;
    }
    
    showLoading();
    addLoadingState(searchButton);
    
    try {
        const weatherData = await fetchWeatherData(validation.value);
        displayWeatherData(weatherData);
        hideError();
    } catch (error) {
        showError(error.message);
    } finally {
        removeLoadingState(searchButton);
    }
}

function handleSearchButtonClick() {
    handleSearch();
}

function handleSearchInputKeyPress(event) {
    if (event.key === 'Enter') {
        hideSuggestions();
        handleSearch();
    } else if (event.key === 'Escape') {
        hideSuggestions();
    }
}

function handleDocumentClick(event) {
    if (!searchInput.contains(event.target) && !suggestionsDiv.contains(event.target)) {
        hideSuggestions();
    }
}

searchButton.addEventListener('click', handleSearchButtonClick);
searchInput.addEventListener('keypress', handleSearchInputKeyPress);
searchInput.addEventListener('input', handleInputChange);
document.addEventListener('click', handleDocumentClick);

