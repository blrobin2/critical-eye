import React from "react";

export const numberToStars = num => {
  const wholes = Math.floor(num);
  const remainder = (num % 1).toString().split(".")[1];
  let rating = "★".repeat(wholes);
  if (remainder) {
    rating += "." + remainder;
  }

  return rating;
};

export const urlToImage = (url, album) => {
  return (
    <img
      className="artwork"
      src={url}
      alt={`${album.artist}: ${album.album}`}
    />
  );
};

export const humanDate = date => {
  const dateObj = new Date(date);
  // month is 0-11, for no good reason
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  return year + "/" + month + "/" + day;
};

export const getDatetimeLocal = () => new Date().toISOString().slice(0, -8);

export const getCurrentYear = () => new Date().getFullYear();
