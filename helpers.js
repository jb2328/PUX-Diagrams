
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

//------------------------------------------//
//------------BOTTOM LEFT BULLETS-----------//
//-----------------------------------------//

//bottom left ACTIVITIES
  function activity_bullets(d){

    // write the ACTIVITY name and id
    d3.select("#activity_txt").text(`(${d.name}) ${d.id}`);

     // draw ACTIVITY temp-circles for the list
     svg
     .append("g")
     .attr("class", "temp-circle")
     .append("circle")
     .attr("cx", 116.5)
     .attr("cy", 497)
     .attr("r", "5px")
     .style("fill", colorMap[d.name.slice(0, 2)]);
  }

  //bottom left EXPERIENCES
 function experience_bullets(d){

    const source = d.name;
    const targets = d.imports;

    let experiences = "";

    // draw paths from ACTIVITY to EXPERIENCE
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

    // draw EXPERIENCE temp-circles for the list
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

    // write down entries in the EXPERIENCE list
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
}

//both activites and experiences (bottom left)
function combined_bullets(d,parent_list){
    const foundObject = newData.find((item) => item.name === d);
    const newExperience = `(${d})  ${foundObject.id} \n`;
    const split_experiences = newExperience.split("\n");

    let split_activities = parent_list.split("\n");

    updateText("#activity_txt", split_activities,125);
    updateText("#experience_txt", split_experiences,125);
    appendCircles(svg, split_activities, 497, colorMap);
    appendCircles(svg, split_experiences, 547, colorMap);

    d3.select("#experience_txt")
      .text(" (" + d + ")  " + foundObject.id + " \n");

}
//------------------------------------------//
//----------BOTTOM LEFT BULLETS END---------//
//------------------------------------------//

function set_html_text(d, mode='experience'){

    //account for different data formatting for activities
    d=mode=='activity'?d.name:d;

    document.getElementById("pux_header_id").innerHTML=pux_list_definitions[d.slice(0, 2)]+" "+ PUX_COMPLETE[d].id[2];
    document.getElementById("pux_header_id").style.color = colorMap[d.slice(0, 2)];

    document.getElementById("pux_header_name").innerHTML=": "+PUX_COMPLETE[d].name;

    document.getElementById("short_paragraph").innerHTML=PUX_COMPLETE[d].short_description;
    document.getElementById("long_paragraph").innerHTML=PUX_COMPLETE[d].long_description;


}

function clear_html_text(){
    document.getElementById("pux_header_id").innerHTML="";
    document.getElementById("pux_header_name").innerHTML="";

    document.getElementById("short_paragraph").innerHTML="";
    document.getElementById("long_paragraph").innerHTML="";
}

// clear d3 text and icons after mouseout on ACTIVITY circles
function clear_bullets(){
    d3.selectAll(".temp-circle").remove();
    d3.select("#activity_txt").text("");
    d3.select("#experience_txt").text("");

    d3.selectAll(".activities_path")
      .style("fill", "none")
      .style("stroke", STROKE_COLOR_OFF)
      .style("stroke-width", STROKE_WIDTH_OFF)
      .style("stroke-opacity", OPACITY_OFF);

      d3.select("#positive_experience").text("");
      d3.select("#negative_experience").text("");
}

function find_experience_parents(d){

    let parent_text = "";
    let parents_all = findNameByImport(d);

    // console.log("PARENT LIST", parents_all,"FROM",d)
    parents_all.forEach((entry) => {
      const found_parent = inputData.find((item) => item.name === entry);
    //   console.log("FOUND PARENT", found_parent)
      parent_text += `(${entry})  ${found_parent.id} \n`;
      d3.select(`#${entry}-${d}`)
        .style("stroke", colorMap[entry.slice(0, 2)])
        .style("stroke-width", STROKE_WIDTH_ON)
        .style("stroke-opacity", OPACITY_ON);
    });

    return parent_text
}


function experience_sentiments_bullets(d){

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

    let positive_experience = "";
    let negative_experience = "";

    // Loop through and target elements with specificString in the first half
    firstHalfIDs.forEach((id) => {
      const target_circle = id.split("-")[1];
      const element = d3.select("#" + id);
      const pathLength = element.node().getTotalLength();

      d3.select("#experiences_circle-" + target_circle)
        .style("opacity",OPACITY_ON);

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

      d3.select("#experiences_circle-" + target_circle)
        .style("opacity",OPACITY_ON);

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


    let split_positive = positive_experience.split("\n");
    let split_negative = negative_experience.split("\n");

    d3.select("#negative_experience").text("");
    d3.select("#positive_experience").text("");

    updateTextAndCircles("negative_experience",split_negative,START_NEGATIVE_X,START_Y);
    updateTextAndCircles("positive_experience",split_positive,START_POSITIVE_X, START_Y);
}

function clean_experience_paths(){
    d3.selectAll(".experiences_path")
    .style("stroke", STROKE_COLOR_OFF)
    .style("opacity", OPACITY_OFF)
    .style("stroke-width", STROKE_WIDTH_OFF);

    d3.selectAll(".experiences_path")
      .style("stroke", STROKE_COLOR_OFF)
      .style("stroke-width", STROKE_WIDTH_OFF)
      .style("stroke-opacity", OPACITY_OFF);

    d3.selectAll(".experience_circle")
      .style("stroke-opacity", OPACITY_ON)
      .style("opacity", OPACITY_ON);

}

function clean_activities_paths(){
    d3.selectAll(".activities_path")
    .style("stroke", STROKE_COLOR_OFF)
    .style("stroke-width", STROKE_WIDTH_OFF)
    .style("stroke-opacity", OPACITY_OFF);

}
