// set up entire svg area
const svgHeight = 600;
const svgWidth = 800;

const margin = {
    top: 100, 
    right: 100, 
    bottom: 100, 
    left: 100
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

// axis data based on user selection
const xScale = (data, selection) => {

    let selectionData
    if (selection === "In Poverty (%)"){
        selectionData = data.map(d => parseFloat(d.poverty))
    } else if (selection === "Income (Median)"){
        selectionData = data.map(d => parseFloat(d.income))
    } else if (selection === "Age (Median)"){
        selectionData = data.map(d => parseFloat(d.age))
    };
    console.log(selectionData);
          
    const x = d3.scaleLinear()
        .domain([d3.min(selectionData) - d3.min(selectionData) * 0.1, d3.max(selectionData)])
        .range([0, chartWidth]);
          
        return(x);
}
      
// render x axis during transtition
const renderXAxis = (xAxisG, newXScale) => {
    xAxis = d3.axisBottom(newXScale);
    xAxisG.transition()
        .duration(1000)
        .call(xAxis);
};

// render circles based on user selection
const renderCircles = (circles, newXScale, selection) => {
          
    let selectionDataKey
          
    if (selection === "In Poverty (%)"){
        selectionDataKey = "poverty"
    } else if (selection === "Income (Median)"){
        selectionDataKey = "income"
    } else if (selection === "Age (Median)"){
        selectionDataKey = "age"
    };
          
    circles.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[selectionDataKey]));
};   

// read in data for scatter plot
d3.csv("assets/data/data.csv").then(data => {
    console.log(data);

    // establish y scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => parseFloat(d.healthcare)))])
        .range([chartHeight, 0]);

    // establish x scale
    const x = d3.scaleLinear()
        .domain([d3.min(data.map(d => parseFloat(d.poverty))) + - 1, d3.max(data.map(d => parseFloat(d.poverty)))])
        .range([0, chartWidth]);

    // create axes values
    const yAxis = d3.axisLeft(y);
    const xAxis = d3.axisBottom(x);

    // put axes on the svg
    chartG.append("g")
        .call(yAxis);

    const xAxisG = chartG.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis)

    // create label areas and add text
    // X labels ---------------------------------
    const xLabelArea = svg.append("g")
        .attr("transform", `translate(${svgWidth - 575}, ${svgHeight - margin.bottom + 45})`);

    xLabelArea.append("text")
        .attr("stroke", "#000000")
        .text("In Poverty (%)");

    xLabelArea.append("text")
        .attr("stroke", "#000000")
        .text("Income (Median)")
        .attr("dy", "20");

    xLabelArea.append("text")
        .attr("stroke", "#000000")
        .text("Age (Median)")
        .attr("dy", "40");

    // click funtion to change x axis based on user selection
    xLabelArea.selectAll("text")
        .on("click", function() {
          const selection = d3.select(this).text()
          console.log(selection)
          newXScale = xScale(data, selection)
          renderXAxis(xAxisG, newXScale)
          renderCircles(circles, newXScale, selection) 
        })

    // Y labels ---------------------------------
    const yLabelArea = svg.append("g")
        .attr("transform", `translate(${svgWidth - margin.left - 630}, ${svgHeight - 250})`);

    yLabelArea.append("text")
        .attr("transform", "rotate(-90)")
        .attr("stroke", "#000000")
        .text("Lacks Healthcare (%)");

    // // create plot area for data points
    // plotArea = chartG.append("g")
    //     .classed("plot-area", true)

    // // bind data to groups for x and y data points
    // const circleG = plotArea.selectAll("g")
    //     .data(data)
    //     .enter()
    //     .append("g")
    //     .attr("transform", d => `translate(${x(parseFloat(d.poverty))}, ${y(parseFloat(d.healthcare))})`)

    // // append circles, set radius, and fill
    // const circles = circleG.append("circle")
    //     .attr("r", 13)
    //     .attr("stroke-width", 2)
    //     .attr("fill", "rgb(89, 124, 158)")
        
    // circles.append("text")
    //     .text(d => d.abbr)
    //     .attr("stroke", "rgb(255, 255, 255)")
    //     .attr("fill", "rgb(255, 255, 255)")
    //     .attr("dy", ".3em")
    //     .attr("text-anchor", "middle")

    // // add state abbreviations on top of circles
    // circleG.append("text")
    //     .text(d => d.abbr)
    //     .attr("stroke", "rgb(255, 255, 255)")
    //     .attr("fill", "rgb(255, 255, 255)")
    //     .attr("dy", ".3em")
    //     .attr("text-anchor", "middle")

    const circles = chartG.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => parseFloat(x(d.poverty)))
        .attr("cy", d => parseFloat(y(d.healthcare)))
        .attr("r", 13)
        .attr("stroke-width", 2)
        .attr("fill", "rgb(89, 124, 158)")


    circles.append("text")
        .text(d => d.abbr)
        .attr("stroke", "rgb(255, 255, 255)")
        .attr("fill", "rgb(255, 255, 255)")
        .attr("dy", ".3em")
        .attr("text-anchor", "middle")

    });
