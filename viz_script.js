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

const CIRCLE_RADIUS=11;
const CIRCLE_RADIUS_PX = CIRCLE_RADIUS+"px";

const START_POSITIVE_X = 380;
const START_NEGATIVE_X = 700;


const Y_EXPERIENCES=400;
const Y_ACTIVITIES=250;

const VIZ_MODE=0;

// location of the experience id locs
const EXP_ID_TXT=270;

// Create the SVG container
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

let experiences = "";
let experiences_html = "";

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
// let colorScale = d3.scaleOrdinal(d3.schemeTableau10);
let colorScale = d3.scaleOrdinal([
  '#BAB0AC',  // Grey
  '#EDC948', // Yellow
  '#F28E2B', // Orange
  // '#76B7B2', // Cyan
  // '#59A14F', // Green
  // '#E15759', // Red
  // '#B07AA1', // Purple
  // '#FF9DA7', // Pink
  // '#9C755F', // Brown
  // '#4E79A7', // Blue

  '#5E948F', // Cyan
'#487D3E', // Green
'#B94644', // Red
'#8E6280', // Purple
'#D67E8A', // Pink
'#7A5E4A', // Brown
'#3D6386' // Blue

]);

// Create a color map for your list
let colorMap = {};
pux_list.forEach(function (element, index) {
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
      [yScale(activity.name), Y_EXPERIENCES],
      [
        interpolate(yScale(activity.name), xScale(child), controlPointFactor),
        (Y_EXPERIENCES + Y_ACTIVITIES) / 2,
      ],
      [xScale(child), Y_ACTIVITIES],
    ];

    // console.log("PRINTING", activity.name, child);
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

const yChild = Y_ACTIVITIES-9;
const yParent = Y_EXPERIENCES+8;
const strokeWidth = 1;

// Function to calculate posY based on VIZ_MODE
function calculatePosY(d, width, height) {
  let pos_y;
  switch(VIZ_MODE) {
    case 0:
      pos_y = Y_ACTIVITIES - 2;
      break;
    case 1:
      pos_y = -0.001 * Math.pow(xScale(d) - width / 2, 2) + height / 2.4;
      break;
    case 2:
      pos_y = height - Math.sqrt(350 * 350 + Math.pow(xScale(d) - width / 2, 2));
      break;
    case 3:
      pos_y = 700 - (7 * Math.cosh(0.01 * (xScale(d) - width / 2)) + 400);
      break;
    default:
      pos_y = Y_ACTIVITIES - 2;
      break;
  }
  return pos_y;
}

// Modify getPathString
function getPathString(d) {
  const path = d3.path();
  let curveHeight;

  
  switch(d.viz_mode) {
    case 0:
   curveHeight =
    yChild -
    1000 * Math.pow(Math.abs(d.strength) - 0.45, 1) +
    Math.random() * 25;    
      break;
    case 1:
      curveHeight = -0.001 * Math.pow(d.source - width/2, 2) + height/2.4;
      break;
    case 2:
      curveHeight = height - Math.sqrt(350 * 350 + Math.pow(d.source - width/2, 2));
      break;
    case 3:
      curveHeight = 700 - (7 * Math.cosh(0.01 * (d.source - width/2)) + 400);
      break;
    default:
      curveHeight = yChild - 1000 * Math.pow(Math.abs(d.strength) - 0.45, 1) + Math.random() * 25;   
      
      break;
  }

  path.moveTo(d.source, d.yNewCoord);
  path.quadraticCurveTo(d.source, curveHeight, d.target, d.yNewCoord);
  return path.toString();
}

// // Helper function for generating path string
// function getPathString(d) {
//   const path = d3.path();
//   const curveHeight =
//     yChild -
//     1000 * Math.pow(Math.abs(d.strength) - 0.45, 1) +
//     Math.random() * 25;
//   path.moveTo(d.source, yChild);
//   path.quadraticCurveTo(d.source, curveHeight, d.target, yChild);
//   return path.toString();
// }

const childLinks = [];

newData.forEach((d) => {
  ['link_positive', 'link_negative'].forEach((linkType) => {
    d[linkType].forEach((linkObj) => {
      const targetName = Object.keys(linkObj)[0];
      const strength = linkObj[targetName];
      const pos_y = calculatePosY(d, width, height);
      childLinks.push({
        source_id: d.name,
        target_id: targetName,
        source: xScale(d.name),
        target: xScale(targetName),
        color: "gray",
        strength: strength,
        viz_mode: VIZ_MODE,
        yNewCoord: pos_y
      });
    });
  });
});

// newData.forEach((d) => {
//   d.link_positive.forEach((linkObj) => {
//     const targetName = Object.keys(linkObj)[0];
//     const strength = linkObj[targetName];
//     childLinks.push({
//       source_id: d.name,
//       target_id: targetName,
//       source: xScale(d.name),
//       target: xScale(targetName),
//       color: "gray",
//       strength: strength,
//     });
//   });
//   d.link_negative.forEach((linkObj) => {
//     const targetName = Object.keys(linkObj)[0];
//     const strength = linkObj[targetName];
//     childLinks.push({
//       source_id: d.name,
//       target_id: targetName,
//       source: xScale(d.name),
//       target: xScale(targetName),
//       color: "gray",
//       strength: strength,
//     });
//   });
// });

// Draw arc-shaped links for EXPERIENCES
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
  .attr("r", CIRCLE_RADIUS_PX)
  .attr("fill", (d) => colorMap[d.name.slice(0, 2)]);

d3.selectAll(".activity_circle")
  .on("mouseover", function (event, d) {

    document.getElementById("pux_header").innerHTML=PUX_COMPLETE[d.name].id +": "+PUX_COMPLETE[d.name].name;

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
    document.getElementById("pux_header").innerHTML="";

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
  .attr("y", Y_EXPERIENCES+10)
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
    // .attr("cy", Y_ACTIVITIES-2)
  .attr("cy", (d) => {
    let pos_y;

    switch(VIZ_MODE) {
      case 0:
    pos_y=Y_ACTIVITIES-2;
    break;
      case 1:
    pos_y=   -0.001 * Math.pow(xScale(d) - width/2, 2) + height/2.4;
        break;
      case 2:
    pos_y=height - Math.sqrt(350 * 350 + Math.pow(xScale(d) - width/2, 2))
    break;
      case 3:
    pos_y = 700 - (7 * Math.cosh(0.01 * (xScale(d) - width/2)) +  400);  
    break;
      default:
    pos_y=Y_ACTIVITIES-2;
    break;
    }
  
    return pos_y
  
  })


  .attr("r", CIRCLE_RADIUS_PX)
  .style("fill", (d) => colorMap[d.slice(0, 2)]);

  const ICON_HEIGHT=CIRCLE_RADIUS*2;
  const ICON_WIDTH=CIRCLE_RADIUS*2;

  svg
  .append("g")
  .selectAll("image.children")
  .data(uniqueChildren)
  .enter()
  .append("image")
  .attr("pointer-events", "none")
  .attr("id", (d) => `experiences_icon-${d}`)
  .attr("class", "experience_icon")
  // .attr("xlink:href", (d) => "./icons/" + d.slice(0, 2) + "/" + d + ".png") //OR SVG
  .attr("xlink:href", (d) => "./icons/vector/" + d + ".svg") //OR SVG
  .attr("x", (d) => parseInt(xScale(d)) - ICON_WIDTH / 2)
  // .attr("y", 248 - ICON_HEIGHT / 2)
  .attr("y",(d) => {
   
    let pos_y;

    switch(VIZ_MODE) {
      case 0:
        pos_y = Y_ACTIVITIES - 13;
        break;
      case 1:
        pos_y = -0.001 * Math.pow(xScale(d) - width / 2, 2) + height / 2.4 -13;
        break;
      case 2:
        pos_y = height - Math.sqrt(350 * 350 + Math.pow(xScale(d) - width / 2, 2));
        break;
      case 3:
        pos_y = 700 - (7 * Math.cosh(0.01 * (xScale(d) - width / 2)) + 400);
        break;
      default:
        pos_y = Y_ACTIVITIES - 13;
        break;
    }
  
    return pos_y
  
  }
  
  
  )

  .attr("width", ICON_WIDTH)
  .attr("height", ICON_HEIGHT);


// Draw text labels for unique children
svg
  .append("g")
  .selectAll("text.children")
  .data(uniqueChildren)
  .enter()
  .append("text")
  .attr("class", "experiences_txt")
  .style("pointer-events", "none")
  .style("font-size", "8px") // Original font size
  .style("fill", "darkgray") // Original color
  .attr("x", (d) => xScale(d))
  .attr("y", EXP_ID_TXT)
  .attr("text-anchor", "middle")
  .text((d) => d)
  .attr("id", (d) => `experience-${d}`);

// Add mouseover and mouseout events to paths
// d3.selectAll(".experiences_path")
//   .on("mouseover", function (event, d) {
//     d3.select(`#experience-${d.target_id}`).style("font-weight", "bolder");
//     d3.select(`#experience-${d.source_id}`).style("font-weight", "bolder");

//     svg
//       .selectAll(".experiences_path")
//       .style("stroke", "#555")
//       .style("stroke-opacity", OPACITY_OFF);

//     d3.select(`#${d.source_id}-${d.target_id}`)
//       .style("stroke", d.color)
//       .style("fill", "none")
//       .style("stroke-opacity", OPACITY_ON);
//   })
//   .on("mouseout", function (event, d) {
//     svg.selectAll(".experiences_txt").style("font-weight", "normal");
//     svg
//       .selectAll(".experiences_path")
//       .style("fill", "none")
//       .style("stroke", (d) => d.color)
//       .style("stroke-width", STROKE_WIDTH_OFF)
//       .style("stroke-opacity", OPACITY_OFF);
//   });

// d3.selectAll(".experiences_path")
//   .on("mouseover", (event, d) => {
//     d3.select(`#experience-${d.target_id}`).style("font-weight", "bolder");
//     d3.select(`#experience-${d.source_id}`).style("font-weight", "bolder");

//     svg
//       .selectAll(".experiences_path")
//       .style("stroke", STROKE_WIDTH_OFF)
//       .style("stroke-opacity", OPACITY_OFF);

//     d3.select(`#${d.source_id}-${d.target_id}`)
//       .style("stroke", d.color)
//       .style("fill", "none")
//       .style("stroke-opacity", OPACITY_ON);
//   })
//   .on("mouseout", (event, d) => {
//     svg.selectAll(".experiences_txt").style("font-weight", "normal");
//     svg
//       .selectAll(".experiences_path")
//       .data(childLinks)
//       .style("fill", "none")
//       .style("stroke", (d) => d.color)
//       .style("stroke-width", STROKE_COLOR_ON)
//       .style("stroke-opacity", OPACITY_OFF);
//   });

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

    document.getElementById("pux_header").innerHTML=PUX_COMPLETE[d].id +": "+PUX_COMPLETE[d].name;

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
    d3.select("#experience_definition").text(pux_list_definitions[d.slice(0, 2)]);

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

    document.getElementById("pux_header").innerHTML="";

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




  
  const TRANSITION_TIME = 300;  // milliseconds
  const SIZE_MULTIPLIER = 2.5;
  
  // Code ...
  
  // Append a group for each unique child
  const groups = svg.selectAll(".child-group")
    .data(uniqueChildren)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${xScale(d)}, ${Y_ACTIVITIES-2})`)
    .on("mouseover", function() {
      
      d3.select(this).selectAll(".experience_circle")
        .transition()
        .duration(TRANSITION_TIME)
        .style("stroke", "gray")
        .style("stroke-width", "1.75")
        .attr("r", CIRCLE_RADIUS * SIZE_MULTIPLIER);

      d3.select(this).selectAll(".experience_icon")
        .transition()
        .duration(TRANSITION_TIME)
        .attr("width", ICON_WIDTH * SIZE_MULTIPLIER)
        .attr("height", ICON_HEIGHT * SIZE_MULTIPLIER)
        .attr("x", -ICON_WIDTH * SIZE_MULTIPLIER / 2)
        .attr("y", -ICON_HEIGHT * SIZE_MULTIPLIER / 2);

// Bring to front
this.parentElement.appendChild(this);

// Append 'aura' circle
  // Prepend 'aura' circle
  const auraCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  auraCircle.setAttribute("class", "aura_circle");
  auraCircle.setAttribute("r", 0);
  auraCircle.style.fill = "white";
  auraCircle.style.opacity = 0.5;
  this.insertBefore(auraCircle, this.firstChild);

  // Animate 'aura' circle
  d3.select(auraCircle)
    .transition()
    .duration(TRANSITION_TIME)
    .attr("r", CIRCLE_RADIUS * SIZE_MULTIPLIER * 1.25);

    

    })
    .on("mouseout", function() {
      d3.select(this).selectAll(".experience_circle")
        .transition()
        .duration(TRANSITION_TIME)
        .style("stroke", "none")
        .attr("r", CIRCLE_RADIUS);
      d3.select(this).selectAll(".experience_icon")
        .transition()
        .duration(TRANSITION_TIME)
        .attr("width", ICON_WIDTH)
        .attr("height", ICON_HEIGHT)
        .attr("x", -ICON_WIDTH / 2)
        .attr("y", -ICON_HEIGHT / 2);

         // Remove 'aura' circle
  d3.select(this).select(".aura_circle")
  .transition()
  .duration(TRANSITION_TIME)
  .attr("r", 0)
  .remove();


    });
  
  // Append circles to groups
  groups.append("circle")
    .attr("class", "experience_circle")
    .attr("r", CIRCLE_RADIUS)
    .style("fill", d => colorMap[d.slice(0, 2)]);
  
  // Append icons to groups
  groups.append("image")
    .attr("class", "experience_icon")
    .attr("xlink:href", d => `./icons/vector/${d}.svg`)
    .attr("x", -ICON_WIDTH / 2)
    .attr("y", -ICON_HEIGHT / 2)
    .attr("width", ICON_WIDTH)
    .attr("height", ICON_HEIGHT);
  