const svg = d3.select("#chart");
const width = 800;
const height = 500;
const margin = { top: 40, right: 40, bottom: 100, left: 60 };

const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("padding", "6px 10px")
    .style("background", "white")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("font-size", "14px")
    .style("display", "none");

d3.csv("vgsales.csv").then(function(data) {

    data.forEach(d => {
        d.Global_Sales = +d.Global_Sales;
    });

    const genreTotals = d3.rollups(
        data,
        values => d3.sum(values, v => v.Global_Sales),
        d => d.Genre
    );

    const formattedData = genreTotals.map(d => ({
        genre: d[0],
        sales: d[1]
    }));

    formattedData.sort((a, b) => b.sales - a.sales);

    const xScale = d3.scaleBand()
        .domain(formattedData.map(d => d.genre))
        .range([0, chartWidth])
        .padding(0.25);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(formattedData, d => d.sales)])
        .range([chartHeight, 0]);

    chart.selectAll("rect")
        .data(formattedData)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.genre))
        .attr("y", d => yScale(d.sales))
        .attr("width", xScale.bandwidth())
        .attr("height", d => chartHeight - yScale(d.sales))
        .attr("fill", "steelblue")
        .on("mouseover", function(event, d) {
            tooltip.style("display", "block")
                .html(`<strong>${d.genre}</strong><br>Global Sales: ${d.sales.toFixed(2)}M`);
            d3.select(this).attr("fill", "#4a90e2");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
            d3.select(this).attr("fill", "steelblue");
        });

    chart.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    chart.append("g")
        .call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Global Sales by Genre");
});
