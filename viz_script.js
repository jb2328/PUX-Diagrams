// Create a set of unique children and a map of activities with children
const uniqueChildren = Array.from(new Set(inputData.flatMap((d) => d.imports)));
const activitiesWithChildren = inputData;

// Set dimensions
const width = 960;
const height = 700;

const STROKE_COLOR_ON = "green";
const STROKE_COLOR_OFF = "#555";

const STROKE_WIDTH_ON = 5;
const STROKE_WIDTH_OFF = 1;

const FORWARD_LINK_COLOR = "green";
const BACKWARD_LINK_COLOR = "red";

const OPACITY_ON = 1;
const OPACITY_OFF = 0.2;

const CIRCLE_RADIUS = "11px";

const START_POSITIVE_X = 380;
const START_NEGATIVE_X = 700;

// Create the SVG container
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

let experiences = "";
let experiences_html = "";

// Your list of elements
let list = ["IA", "SA", "CA", "VE", "SE", "ME", "TE", "IE", "PE", "CE"];

let list_definitions = {
  IA: "Interpretation Activities",
  SA: "Social Activities",
  CA: "Construction Activities",
  VE: "Visibility",
  SE: "Structure",
  ME: "Meaning",
  TE: "Thinking",
  IE: "Interaction",
  PE: "Process",
  CE: "Creativity",
};

// Function to interpolate between two numbers
function interpolate(a, b, t) {
  return a + (b - a) * t;
}

function findNameByImport(importValue) {
  let list_of_matches = [];
  // Loop through the inputData array
  for (const item of inputData) {
    // Check if the importValue exists in the "imports" property of the current object
    if (item.imports.includes(importValue)) {
      // If found, return the "name" property of the current object
      list_of_matches.push(item.name);
    }
  }
  // If not found, return null or an appropriate value
  return list_of_matches;
}

// Get the colors from d3.schemeTableau10
let colorScale = d3.scaleOrdinal(d3.schemeTableau10);

// Create a color map for your list
let colorMap = {};
list.forEach(function (element, index) {
  colorMap[element] = colorScale(index);
});

// Scale for positioning children and parents
const xScale = d3
  .scalePoint()
  .domain(uniqueChildren)
  .range([50, width - 60])
  .padding(0.5);
const yScale = d3
  .scalePoint()
  .domain(activitiesWithChildren.map((d) => d.name))
  .range([50, width - 60])
  .padding(0.5);

// Line generator for curvy lines
const line = d3.line().curve(d3.curveBasis);
const controlPointFactor = 0.9; // Adjust this factor to control the sharpness

// Draw lines connecting parents and children
inputData.forEach((activity) => {
  activity.imports.forEach((child) => {
    const points = [
      [yScale(activity.name), 400],
      [
        interpolate(yScale(activity.name), xScale(child), controlPointFactor),
        (400 + 250) / 2,
      ],
      [xScale(child), 250],
    ];

    console.log("PRINTING", activity.name, child);
    svg
      .append("path")
      .attr("d", line(points))
      .attr("class", "activities_path")
      .attr("id", activity.name + "-" + child)
      .attr("fill", "none")
      .attr("stroke", STROKE_COLOR_OFF)
      .attr("stroke-opacity", OPACITY_OFF);
  });
});

const childLinks = [];
newData.forEach((d) => {
  d.link_positive.forEach((linkObj) => {
    const targetName = Object.keys(linkObj)[0];
    const strength = linkObj[targetName];
    childLinks.push({
      source_id: d.name,
      target_id: targetName,
      source: xScale(d.name),
      target: xScale(targetName),
      color: "gray",
      strength: strength,
    });
  });
  d.link_negative.forEach((linkObj) => {
    const targetName = Object.keys(linkObj)[0];
    const strength = linkObj[targetName];
    childLinks.push({
      source_id: d.name,
      target_id: targetName,
      source: xScale(d.name),
      target: xScale(targetName),
      color: "gray",
      strength: strength,
    });
  });
});

const yChild = 241;
const yParent = 408;
const strokeWidth = 1;

// Helper function for generating path string
function getPathString(d) {
  const path = d3.path();
  const curveHeight =
    yChild -
    1000 * Math.pow(Math.abs(d.strength) - 0.45, 1) +
    Math.random() * 25;
  path.moveTo(d.source, yChild);
  path.quadraticCurveTo(d.source, curveHeight, d.target, yChild);
  return path.toString();
}

// Draw arc-shaped links
const links = svg
  .append("g")
  .selectAll("path")
  .data(childLinks)
  .enter()
  .append("path")
  .attr("class", "experiences_path")
  .attr("id", (d) => `${d.source_id}-${d.target_id}`)
  .attr("d", getPathString)
  .attr("fill", "none")
  .attr("stroke", (d) => d.color)
  .attr("stroke-width", strokeWidth)
  .attr("stroke-opacity", OPACITY_OFF);

// Draw nodes for activities (parents)
const nodes = svg
  .append("g")
  .selectAll("text.activities")
  .data(activitiesWithChildren)
  .enter()
  .append("circle")
  .attr("id", (d) => `activity_circle-${d.name}`)
  .attr("class", "activity_circle")
  .attr("cx", (d) => yScale(d.name))
  .attr("cy", yParent)
  .attr("r", CIRCLE_RADIUS)
  .attr("fill", (d) => colorMap[d.name.slice(0, 2)]);

d3.selectAll(".activity_circle")
  .on("mouseover", function (event, d) {
    d3.select("#activity_txt").text(`(${d.name}) ${d.id}`);

    svg
      .append("g")
      .attr("class", "temp-circle")
      .append("circle")
      .attr("cx", 116.5)
      .attr("cy", 497)
      .attr("r", "5px")
      .style("fill", colorMap[d.name.slice(0, 2)]);

    const source = d.name;
    const targets = d.imports;
    let experiences = "";

    targets.forEach((target) => {
      const foundObject = newData.find((item) => item.name === target);
      experiences += `(${target}) ${foundObject.id}\n`;
      d3.select(`#${source}-${target}`)
        .style("stroke", colorMap[source.slice(0, 2)])
        .style("stroke-width", STROKE_WIDTH_ON)
        .style("fill", "none")
        .style("stroke-opacity", OPACITY_ON);
    });

    const split_text = experiences.split("\n");
    split_text.pop(); // Remove the last empty string

    split_text.forEach((text, i) => {
      svg
        .append("g")
        .attr("class", "temp-circle")
        .append("circle")
        .attr("cx", 116.5)
        .attr("cy", 547 + i * 15)
        .attr("r", "5px")
        .style("fill", colorMap[text.slice(1, 3)]);
    });

    d3.select("#experience_txt")
      .attr("text-anchor", "start")
      .selectAll("tspan")
      .remove()
      .data(split_text)
      .enter()
      .append("tspan")
      .attr("x", 125)
      .attr("dy", (d, i) => (i === 0 ? 0 : 15))
      .text((d) => d);
  })
  .on("mouseout", function (event, d) {
    d3.selectAll(".temp-circle").remove();
    d3.select("#activity_txt").text("");
    d3.select("#experience_txt").text("");

    d3.selectAll(".activities_path")
      .style("fill", "none")
      .style("stroke", STROKE_COLOR_OFF)
      .style("stroke-width", STROKE_WIDTH_OFF)
      .style("stroke-opacity", OPACITY_OFF);
  });

// Draw text labels for activities
svg
  .append("g")
  .selectAll("text.activities")
  .data(activitiesWithChildren)
  .enter()
  .append("text")
  .attr("class", "activities_txt")
  .style("pointer-events", "none")
  .attr("x", (d) => yScale(d.name))
  .attr("y", 410)
  .attr("text-anchor", "middle")
  .text((d) => d.name)
  .attr("id", (d) => `activity-${d.name}`);

// Draw circles for unique children
svg
  .append("g")
  .selectAll("circle.children")
  .data(uniqueChildren)
  .enter()
  .append("circle")
  .attr("id", (d) => `experiences_circle-${d}`)
  .attr("class", "experience_circle")
  .attr("cx", (d) => xScale(d))
  .attr("cy", 248)
  .attr("r", CIRCLE_RADIUS)
  .style("fill", (d) => colorMap[d.slice(0, 2)]);

// Draw text labels for unique children
svg
  .append("g")
  .selectAll("text.children")
  .data(uniqueChildren)
  .enter()
  .append("text")
  .attr("class", "experiences_txt")
  .style("pointer-events", "none")
  .attr("x", (d) => xScale(d))
  .attr("y", 250)
  .attr("text-anchor", "middle")
  .text((d) => d)
  .attr("id", (d) => `experience-${d}`);

// Add mouseover and mouseout events to paths
d3.selectAll(".experiences_path")
  .on("mouseover", function (event, d) {
    d3.select(`#experience-${d.target_id}`).style("font-weight", "bolder");
    d3.select(`#experience-${d.source_id}`).style("font-weight", "bolder");

    svg
      .selectAll(".experiences_path")
      .style("stroke", "#555")
      .style("stroke-opacity", OPACITY_OFF);

    d3.select(`#${d.source_id}-${d.target_id}`)
      .style("stroke", d.color)
      .style("fill", "none")
      .style("stroke-opacity", OPACITY_ON);
  })
  .on("mouseout", function (event, d) {
    svg.selectAll(".experiences_txt").style("font-weight", "normal");
    svg
      .selectAll(".experiences_path")
      .style("fill", "none")
      .style("stroke", (d) => d.color)
      .style("stroke-width", STROKE_WIDTH_OFF)
      .style("stroke-opacity", OPACITY_OFF);
  });

d3.selectAll(".experiences_path")
  .on("mouseover", (event, d) => {
    d3.select(`#experience-${d.target_id}`).style("font-weight", "bolder");
    d3.select(`#experience-${d.source_id}`).style("font-weight", "bolder");

    svg
      .selectAll(".experiences_path")
      .style("stroke", STROKE_WIDTH_OFF)
      .style("stroke-opacity", OPACITY_OFF);

    d3.select(`#${d.source_id}-${d.target_id}`)
      .style("stroke", d.color)
      .style("fill", "none")
      .style("stroke-opacity", OPACITY_ON);
  })
  .on("mouseout", (event, d) => {
    svg.selectAll(".experiences_txt").style("font-weight", "normal");
    svg
      .selectAll(".experiences_path")
      .data(childLinks)
      .style("fill", "none")
      .style("stroke", (d) => d.color)
      .style("stroke-width", STROKE_COLOR_ON)
      .style("stroke-opacity", OPACITY_OFF);
  });

// Function to update text
function updateText(selector, data, startX) {
  d3.select(selector)
    .attr("text-anchor", "start")
    .selectAll("tspan")
    .remove()
    .data(data)
    .enter()
    .append("tspan")
    .attr("x", startX)
    .attr("dy", (d, i) => (i == 0 ? 0 : 15))
    .text((d) => d);
}

function appendCircles(svg, textArray, startCy, colorMap) {
  textArray.slice(0, -1).forEach((text, i) => {
    svg
      .append("g")
      .attr("class", "temp-circle")
      .append("circle")
      .attr("cx", 116.5)
      .attr("cy", startCy + i * 15)
      .attr("r", "5px")
      .style("fill", colorMap[text.slice(1, 3)]);
  });
}

d3.selectAll(".experience_circle")
  .on("mouseover", function (event, d) {
    // SHOW PARENT/ROOT CIRCLES

    let parent_list = findNameByImport(d);
    let parent_text = "";

    parent_list.forEach((entry) => {
      const found_parent = inputData.find((item) => item.name === entry);
      parent_text += `(${entry})  ${found_parent.id} \n`;
      d3.select(`#${entry}-${d}`)
        .style("stroke", colorMap[entry.slice(0, 2)])
        .style("stroke-width", STROKE_WIDTH_ON)
        .style("stroke-opacity", OPACITY_ON);
    });

    d3.select("#experience_definition").text("");
    d3.select("#experience_definition").text(list_definitions[d.slice(0, 2)]);

    d3.selectAll(".temp-circle").remove();

    let split_text = parent_text.split("\n");

    appendCircles(svg, split_text, 497, colorMap);

    d3.select("#activity_txt").text("");

    function updateText(selector, splitText) {
      d3.select(selector)
        .attr("text-anchor", "start")
        .selectAll("tspan")
        .remove()
        .data(splitText)
        .enter()
        .append("tspan")
        .attr("x", 125)
        .attr("dy", (d, i) => (i == 0 ? 0 : 15))
        .text((d) => d);
    }

    const foundObject = newData.find((item) => item.name === d);
    const newExperience = `(${d})  ${foundObject.id} \n`;
    const splitTextExp = newExperience.split("\n");

    updateText("#activity_txt", split_text);
    updateText("#experience_txt", splitTextExp);

    d3.select("#experience_txt")
      .text("")
      .text(" (" + d + ")  " + foundObject.id + " \n");

    appendCircles(svg, splitTextExp, 547, colorMap);

    //------------

    d3.selectAll(".experience_circle").style("opacity", OPACITY_OFF);

    d3.select(this).style("opacity", OPACITY_ON);

    d3.selectAll(".experiences_path")
      .style("stroke", STROKE_COLOR_OFF)
      .style("opacity", OPACITY_OFF)
      .style("stroke-width", STROKE_WIDTH_OFF);

    // Initialize two arrays to store IDs
    const firstHalfIDs = [];
    const secondHalfIDs = [];

    // Select all elements with the class "experiences_path"
    d3.selectAll(".experiences_path").each(function () {
      const idParts = this.id.split("-");
      if (idParts[0].includes(d)) {
        firstHalfIDs.push(this.id);
      } else if (idParts[1].includes(d)) {
        secondHalfIDs.push(this.id);
      }
    });

    // Calculate the total length of the path
    let pathLength;

    let positive_experience = "";
    let negative_experience = "";

    // Loop through and target elements with specificString in the first half
    firstHalfIDs.forEach((id) => {
      const target_circle = id.split("-")[1];
      const element = d3.select("#" + id);
      const pathLength = element.node().getTotalLength();

      d3.select("#experiences_circle-" + target_circle).style(
        "opacity",
        OPACITY_ON
      );

      element
        .attr("stroke-dasharray", `${pathLength} ${pathLength}`)
        .attr("stroke-dashoffset", pathLength)
        .style("stroke", FORWARD_LINK_COLOR)
        .style("stroke-width", STROKE_WIDTH_ON)
        .style("opacity", OPACITY_ON)
        .transition()
        .duration(1500)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      let foundObject =
        newData.find((item) => item.name === target_circle) ||
        inputData.find((item) => item.name === target_circle);
      if (!foundObject)
        console.error(`id: ${id}, target: ${target_circle} not found`);

      positive_experience += ` (${target_circle})   ${foundObject.id} \n`;
    });

    // Loop through and target elements with specificString in the second half
    secondHalfIDs.forEach((id) => {
      const target_circle = id.split("-")[0];
      const element = d3.select("#" + id);
      const pathLength = element.node().getTotalLength();

      let foundObject =
        newData.find((item) => item.name === target_circle) ||
        inputData.find((item) => item.name === target_circle);
      if (!foundObject)
        console.error(`id: ${id}, target: ${target_circle} not found`);

      negative_experience += ` (${target_circle}) \t ${foundObject.id} \n`;

      d3.select("#experiences_circle-" + target_circle).style(
        "opacity",
        OPACITY_ON
      );

      element
        .attr("stroke-dasharray", `${pathLength} ${pathLength}`)
        .attr("stroke-dashoffset", pathLength)
        .style("stroke", BACKWARD_LINK_COLOR)
        .style("stroke-width", STROKE_WIDTH_ON)
        .style("opacity", OPACITY_ON)
        .transition()
        .duration(1500)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    });

    console.log(parent_text);

    let split_positive = positive_experience.split("\n");
    let split_negative = negative_experience.split("\n");

    d3.select("#negative_experience").text("");
    d3.select("#positive_experience").text("");

    function updateTextAndCircles(id, data, startX, startY) {
      d3.select("#" + id)
        .attr("text-anchor", "start")
        .selectAll("tspan")
        .remove()
        .data(data)
        .enter()
        .append("tspan")
        .attr("x", startX)
        .attr("dy", (d, i) => (i === 0 ? 0 : 15))
        .text((d) => d);

      for (let i = 0; i < data.length - 1; i++) {
        const cy = startY + i * 15;
        const fill = colorMap[data[i].slice(2, 4)];

        svg
          .append("g")
          .attr("class", "temp-circle")
          .append("circle")
          .attr("cx", startX - 7)
          .attr("cy", cy)
          .attr("r", "5px")
          .style("fill", fill);
      }
    }

    const START_Y = 511.5; // Define accordingly

    updateTextAndCircles(
      "negative_experience",
      split_negative,
      START_NEGATIVE_X,
      START_Y
    );
    updateTextAndCircles(
      "positive_experience",
      split_positive,
      START_POSITIVE_X,
      START_Y
    );
  })
  .on("mouseout", function (event, d) {
    d3.select("#experience_definition").text("Hover over");

    d3.selectAll(".temp-circle").remove();

    d3.selectAll(".activities_path")
      .style("stroke", STROKE_COLOR_OFF)
      .style("stroke-width", STROKE_WIDTH_OFF)
      .style("stroke-opacity", OPACITY_OFF);

    d3.selectAll(".experiences_path")
      .style("stroke", STROKE_COLOR_OFF)
      .style("stroke-width", STROKE_WIDTH_OFF)
      .style("stroke-opacity", OPACITY_OFF);

    d3.selectAll(".experience_circle")
      .style("stroke-opacity", OPACITY_ON)
      .style("opacity", OPACITY_ON);

    d3.select("#positive_experience").text("");
    d3.select("#negative_experience").text("");
  });


  function addText(x, y, style, text, id) {
    const textElement = svg.append("text").attr("x", x).attr("y", y).text(text);
    if (style) textElement.style(style);
    if (id) textElement.attr("id", id);
  }
  
  const textData = [
    {text: "Hover over an experience", x: 910, y: 250, style: {"font-style": "italic"}, id: "experience_definition"},
    {text: "Activity:", x: 50, y: 500, style: {"font-weight": "bolder"}},
    {text: "Hover", x: 125, y: 500, id: "activity_txt"},
    {text: "Experience:", x: 50, y: 550, style: {"font-weight": "bolder"}},
    {text: "Hover", x: 125, y: 550, id: "experience_txt"},
    {text: "Positively corelated:", x: START_POSITIVE_X, y: 500, style: {"font-weight": "bolder"}},
    {text: "Select Experience", x: START_POSITIVE_X, y: 515, id: "positive_experience"},
    {text: "Negatively corelated:", x: START_NEGATIVE_X, y: 500, style: {"font-weight": "bolder"}},
    {text: "Select Experience", x: START_NEGATIVE_X, y: 515, id: "negative_experience"},
    {text: "Interpretation activities", x: 135, y: 440, style: {"font-style": "italic"}},
    {text: "Construction activities", x: 450, y: 440, style: {"font-style": "italic"}},
    {text: "Social activities", x: 750, y: 440, style: {"font-style": "italic"}}
  ];
  
  
  textData.forEach(({x, y, style, text, id}) => addText(x, y, style, text, id));
  
