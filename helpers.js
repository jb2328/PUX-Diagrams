
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

  function addText(x, y, style, text, id) {
    const textElement = svg.append("text").attr("x", x).attr("y", y).text(text);
    if (style) textElement.style(style);
    if (id) textElement.attr("id", id);
  }


 