const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const Movies = require("./movies.json");
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const app = express();
const morgansetting = process.env.NODE_ENV === "production" ? "tiny" : "common";
app.use(morgan(morgansetting));
app.use(helmet());
app.use(cors());
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});

app.use(function validateBearerToken(req, res, next) {
  console.log("validate bearer token middleware");
  const authToken = req.get("Authorization"); //Note that in postman or making request with code you need Bearer in front of the code for it to work correctly
  const apiToken = process.env.API_TOKEN;
  //Checking the Authorization code from the user matches the code that is in the .env file
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  } else {
    // move to the next middleware
    next();
  }
});
app.get("/movies", (req, res) => {
  const genre = req.query.genre;
  const country = req.query.country;
  const avgVote = req.query.avg_vote;
  if (genre) {
    const response = Movies.filter((ele) => {
      const searchGenre = genre.toLowerCase();
      if (searchGenre === ele.genre.toLowerCase()) {
        return ele;
      }
    });
    if (response.length === 0) {
      res.status(304).json({ Error: "Please try again" });
    } else {
      res.json(response);
    }
  }
  if (country) {
    const searchCountry = country.toLowerCase();
    const response = Movies.filter((ele) => {
      if (searchCountry === ele.country.toLowerCase()) {
        return ele;
      }
    });
    if (response.length === 0) {
      res.status(304).json({ Error: "Please try again" });
    } else {
      res.json(response);
    }
  }
  if (avgVote) {
    const number = Number(avgVote);
    const response = Movies.filter((ele) => {
      if (ele.avg_vote >= number) {
        return ele;
      }
    });
    if (response.length === 0) {
      res.status(304).json({ Error: "Please try again" });
    } else {
      res.json(response);
    }
  }
  if (!genre && !country && !avgVote) {
    const response = Movies.map((ele) => {
      return ele;
    });
    res.json(response);
  }
});
