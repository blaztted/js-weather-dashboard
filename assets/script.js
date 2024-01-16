var API_KEY = "9270b2bf465fdbbaeec9cec7447a23bd";

var now = dayjs();
var curDate = now.format("dddd MMM. D, YYYY");
var curDateSimplified = now.format("DD/MM/YYYY");
var searchList = [];

function currentWeather(city) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`;

  $.ajax({
    url: apiUrl,
    method: "GET",
  }).then(function (data) {
    console.log(data);
    $("#weatherContent").css("display", "block");
    $("#cityDetail").empty();

    var iconCode = data.weather[0].icon;
    var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

    var currentCity = $(`
          <h2 id="currentCity">
              ${data.name} <img src="${iconURL}" alt="${data.weather[0].description}" />
          </h2>
          <p>Date: ${curDateSimplified}
          <p>Temperature: ${data.main.temp} °F</p>
          <p>Humidity: ${data.main.humidity}\%</p>
          <p>Wind Speed: ${data.wind.speed} MPH</p>
      `);

    $("#cityDetail").append(currentCity);

    var lat = data.coord.lat;
    var lon = data.coord.lon;

    futureWeather(lat, lon);
  });
}

function futureWeather(lat, lon) {
  var futureUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  $.ajax({
    url: futureUrl,
    method: "GET",
  }).then(function (data) {
    console.log(data);
    $("#fiveDay").empty();

    for (let i = 0; i < data.list.length; i += 8) {
      var cityInfo = {
        date: data.list[i].dt_txt,
        icon: data.list[i].weather[0].icon,
        temp: data.list[i].main.temp,
        humidity: data.list[i].main.humidity,
      };

      var currDate = dayjs(cityInfo.date).format("DD/MM/YYYY");

      var iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${data.list[i].weather[0].main}" />`;

      var futureCard = $(`
    <div class="pl-3">
        <div class="card pl-3 pt-3 mb-3 text-light" style="width: 12rem ;">
            <div class="card-body ">
                <h5>${currDate}</h5>
                <p>${iconURL}</p>
                <p>Temp: ${cityInfo.temp} °F</p>
                <p>Humidity: ${cityInfo.humidity}\%</p>
            </div>
        </div>
    </div>
`);

      $("#fiveDay").append(futureCard);
    }
  });
}

$("#searchBtn").on("click", function (e) {
  e.preventDefault();

  var city = $("#enterCity").val().trim();
  if (city) {
    currentWeather(city);

    if (!searchList.includes(city)) {
      searchList.push(city);
      var searchedCity = $(`
              <li class="list-group-item">${city}</li>
              `);
      $("#searchHistory").append(searchedCity);
    }
    localStorage.setItem("city", JSON.stringify(searchList));
    console.log(searchList);

    $("#enterCity").val(""); // clear the input field after
  } else {
    $("#enterCity").val("");
  }
});

$(document).on("click", ".list-group-item", function () {
  var listCity = $(this).text();
  currentWeather(listCity);
});

//last searched city forecast
$(document).ready(function () {
  var searchHistoryArr = JSON.parse(localStorage.getItem("city"));

  if (searchHistoryArr !== null) {
    var lastSearchedIndex = searchHistoryArr.length - 1;
    var lastSearchedCity = searchHistoryArr[lastSearchedIndex];
    currentWeather(lastSearchedCity);
    console.log(`Last searched city: ${lastSearchedCity}`);
  }
});
