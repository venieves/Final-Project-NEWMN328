const svg = d3.select("#chart");


d3.csv("vgsales.csv").then(function(data) {


    console.log("CSV Loaded:", data.slice(0, 5));


});});