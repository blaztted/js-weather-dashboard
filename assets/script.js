console.log("ding");

const API_KEY = "9270b2bf465fdbbaeec9cec7447a23bd";

const lat = 38.8075622;
const lon = -9.1954432;

const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

const now = dayjs();
const curDate = now.format("dddd MMM. D, YYYY");

fetch(apiUrl)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    $("#today").text(` ${curDate}`);
    console.log(data);
  });
