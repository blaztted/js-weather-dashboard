const API_KEY = "9270b2bf465fdbbaeec9cec7447a23bd";

const lat = 38.8075622;
const lon = -9.1954432;
const city = "London";

var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`;
const futureUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

const now = dayjs();
const curDate = now.format("dddd MMM. D, YYYY");
const curDateSimplified = now.format("DD/MM/YYYY");

fetch(apiUrl)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    // $("#today").text(` ${curDate}`);
    // $("#city").text(data.city.name);
    // $("#date").text(curDate);
    // $("#temperature").text(`${parseInt(data.list[0].main.temp)} ºC`);
    // $("#humidity").text(`${data.list[0].main.humidity}%`);
    // $("#wind-speed").text(`${data.list[0].wind.speed} mph`);
    console.log(data);
  });

// function displayWeather(data) {
//   $("#today").text(` ${curDate}`);
//   $("#city").text(data.city.name);
//   $("#date").text(curDate);
//   $("#temperature").text(`${parseInt(data.list[0].main.temp)} ºC`);
//   $("#humidity").text(`${data.list[0].main.humidity}%`);
//   $("#wind-speed").text(`${data.list[0].wind.speed} mph`);
// }

currentWeather();
function currentWeather() {
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

    futureCondition(lat, lon);
  });
}

function futureCondition(lat, lon) {
  $.ajax({
    url: futureUrl,
    method: "GET",
  }).then(function (data) {
    console.log(data);
    $("#fiveDay").empty();

    for (let i = 1; i < 6; i++) {
      var cityInfo = {
        date: data.list[i].dt_txt,
        icon: data.list[i].weather[0].icon,
        temp: data.list[i].main.temp,
        humidity: data.list[i].main.humidity,
      };

      var currDate = dayjs(cityInfo.date).format("MM/DD/YYYY");

      var iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${data.list[i].weather[0].main}" />`;

      var futureCard = $(`
    <div class="pl-3">
        <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 14rem;">
            <div class="card-body">
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
