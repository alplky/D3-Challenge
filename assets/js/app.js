// set up entire svg area
const svgHeight = 400;
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
    .attr("width", svgWidth)

// create groups to append to svg and offset
const chartG = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .classed("chart-group", true)

// read in data for scatter plot
d3.csv("assets/data/data.csv").then(data => {
    console.log(data)
})
