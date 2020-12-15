// set up entire svg area
const svgHeight = 600;
const svgWidth = 800;

const margin = {
    top: 50, 
    right: 50, 
    bottom: 50, 
    left: 50
};

const chartHeight = svgHeight - margin.top - margin.bottom;
const chartWidth = svgHeight - margin.left - margin.right;

// create svg to append to body of html
const svg = d3.select("#scatter").append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// create groups to append to svg and offset
const chartG = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .classed("chart-group", true);

// read in data for scatter plot
d3.csv("assets/data/data.csv").then(data => {
    console.log(data);

    // establish y value
    const y = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => parseFloat(d.healthcare)))])
        .range([chartHeight, 0]);

    // establish x value
    const x = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => parseFloat(d.poverty)))])
        .range([0, chartWidth]);

    // create axes values
    const yAxis = d3.axisLeft(y);
    const xAxis = d3.axisBottom(x);

    // put axes on the svg
    chartG.append("g")
        .call(yAxis);

    chartG.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    // create label areas and add text
    const xLabelArea = svg.append("g")
        .attr("transform", `translate(${svgWidth - 525}, ${svgHeight - margin.bottom + 45})`);

    xLabelArea.append("text")
        .attr("stroke", "#000000")
        .text("In Poverty (%)")

    const yLabelArea = svg.append("g")
        .attr("transform", `translate(${svgWidth - margin.left - 730}, ${svgHeight - 250})`, "rotate(-90)");

    yLabelArea.append("text")
        .attr("transform", "rotate(-90)")
        .attr("stroke", "#000000")
        .text("Lacks Healthcare (%)");

    // bind data points to circles for scatter plot
    const circles = chartG.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => parseFloat(x(d.poverty)))
        .attr("cy", d => parseFloat(y(d.healthcare)))
        .attr("r", 10)


    });
