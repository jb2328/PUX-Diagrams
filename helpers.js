
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

    document.getElementById("action_name").innerHTML=PUX_COMPLETE[d].name;
    document.getElementById("action_name").style.color = colorMap[d.slice(0, 2)];
}

function clear_html_text(){
    document.getElementById("pux_header_id").innerHTML="";
    document.getElementById("pux_header_name").innerHTML="";

    document.getElementById("short_paragraph").innerHTML="";
    document.getElementById("long_paragraph").innerHTML="";

    document.getElementById("action_name").innerHTML="";

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
    // .interrupt()
    // .transition()
    // .duration(250)
    .style("stroke", STROKE_COLOR_OFF)
    .style("opacity", OPACITY_OFF)
    .style("stroke-width", STROKE_WIDTH_OFF);

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


function icon_zoom(d){
    let circle_id = '#experiences_circle-' + d;
    let icon_id = '#experiences_icon-' + d;

    d3.select(circle_id)
      .transition()
      .duration(TRANSITION_TIME)
      .style("stroke", "white")
      .style("stroke-width", "2")
      .attr("r", CIRCLE_RADIUS * SIZE_MULTIPLIER + "px");

    d3.select(icon_id)
      .transition()
      .duration(TRANSITION_TIME)
      .attr("width", ICON_WIDTH * SIZE_MULTIPLIER)
      .attr("height", ICON_HEIGHT * SIZE_MULTIPLIER)
      .attr("x", d3.select(circle_id).attr("cx") - ICON_WIDTH)
      .attr("y", d3.select(circle_id).attr("cy") - ICON_HEIGHT);

    // Move circle to top layer
    let circleNode = d3.select(circle_id).node();
    topLayer.node().appendChild(circleNode);

    // Move icon to top layer
    let iconNode = d3.select(icon_id).node();
    topLayer.node().appendChild(iconNode);
}

function icon_dezoom(d){
    let circle_id='#experiences_circle-'+d;
    let icon_id='#experiences_icon-'+d;

    d3.select(circle_id)
      .transition()
      .duration(TRANSITION_TIME)
      .style("stroke", "none")
      .attr("r", CIRCLE_RADIUS_PX);

    d3.select(icon_id)
      .transition()
      .duration(TRANSITION_TIME)
      .attr("width", ICON_WIDTH)
      .attr("height", ICON_HEIGHT)
      .attr("x", d3.select(circle_id).attr("cx")-ICON_WIDTH/2)
      .attr("y", d3.select(circle_id).attr("cy")-ICON_HEIGHT/2);
}


function add_strength_scale(){
    const yAxisXPos = 19; // X position for the Y-axis
    const yAxisY1Pos = Y_ACTIVITIES - 230; // Starting Y position for the Y-axis
    const yAxisY2Pos = Y_ACTIVITIES - 20; // Ending Y position for the Y-axis
    
    // Create Y-axis group
    const yAxisGroup = svg.append("g")
      .attr("id", "scales")
      .attr("transform", `translate(${yAxisXPos},0)`);
    
    // Draw Y-axis line
    yAxisGroup.append("line")
      .attr("x1", 0)
      .attr("y1", yAxisY1Pos)
      .attr("x2", 0)
      .attr("y2", yAxisY2Pos)
      .attr("stroke", "darkgray");
    
    // Draw arrow at the end
    yAxisGroup.append("path")
      .attr("d", `M 0 ${yAxisY1Pos} L -5 ${yAxisY1Pos + 5} L 5 ${yAxisY1Pos + 5} Z`)
      .attr("fill", "darkgray");
    
    // Draw ticks and labels
    for (let i = 0; i <= 5; i++) {
    
      // if (i==0){continue}
      const yTickPos = yAxisY2Pos - i * 40; // 20 pixels between each tick
      const tickValue = (i * 0.2).toFixed(1);
      
      yAxisGroup.append("line")
        .attr("x1", -2)
        .attr("y1", yTickPos)
        .attr("x2", 2)
        .attr("y2", yTickPos);
        // .attr("stroke", "darkgray");
    
    yAxisGroup.append("text")
      .attr("x", 2)
      .attr("y", yTickPos - 0)
      .attr("text-anchor", "end")
      .attr("transform", `rotate(-90, -5, ${yTickPos + 2})`)
      // .attr("stroke", "darkgray")
      .text(tickValue);
    
    }
    
    // Add label
    yAxisGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", yAxisXPos + 10)
      .attr("x", -(yAxisY1Pos + yAxisY2Pos) / 2)
      .attr("dy", "-2em")
      .style("text-anchor", "middle")
      .style("opacity", 0.75)
      .text("correlation strength");
    
      d3.select('#scales').style("opacity", 0.4);
}

function add_text_aid(){
    const text_data = [
        // {text: "Hover over an experience", x: 910, y: 250, style: {"font-style": "italic"}, id: "experience_definition"},
        {text: "Activity:",   x: 50,  y: 500, style: {"font-weight": "bolder"}},
        {text: "Hover",       x: 125, y: 500, id: "activity_txt"},
    
        {text: "Experience:", x: 50, y: 550, style: {"font-weight": "bolder"}},
        {text: "Hover",       x: 125, y: 550, id: "experience_txt"},
    
        {text: "Positively correlated:", x: START_POSITIVE_X, y: 500, style: {"font-weight": "bolder"}},
        {text: "Select Experience",      x: START_POSITIVE_X, y: 515, id: "positive_experience"},
        {text: "Negatively correlated:", x: START_NEGATIVE_X, y: 500, style: {"font-weight": "bolder"}},
        {text: "Select Experience",      x: START_NEGATIVE_X, y: 515, id: "negative_experience"},
      ];
      
      text_data.forEach(({x, y, style, text, id}) => addText(x, y, style, text, id));

      const activity_data=[
        {text: "Interpretation activities", x: 135, y: 460, style: {"font-style": "italic"}, underlineColor: colorMap["IA"], identifier_start: "IA1", identifier_end: "IA3"},
        {text: "Construction activities",   x: 530, y: 460, style: {"font-style": "italic"}, underlineColor: colorMap["CA"],identifier_start: "CA1", identifier_end: "CA4"},
        {text: "Social activities",         x: 920, y: 460, style: {"font-style": "italic"}, underlineColor: colorMap["SA"],identifier_start: "SA1", identifier_end: "SA3"}
    ];
      

      function underlined_text(x, y, style, text, id, underlineColor, identifier_start, identifier_end) {
        // Existing code for appending text
        svg.append("text")
          .attr("x", x)
          .attr("y", y)
          .attr("style", style)
          .text(text);
      
        let x_start = parseFloat(d3.select("#activity_circle-" + identifier_start).attr("cx"));
        let x_end = parseFloat(d3.select("#activity_circle-" + identifier_end).attr("cx"));
      
        svg.append("line")
          .attr("x1", x_start)
          .attr("y1", y + 5)
          .attr("x2", x_end)
          .attr("y2", y + 5)
          .attr("stroke", underlineColor);
      }
      
      activity_data.forEach(({x, y, style, text, id, underlineColor, identifier_start, identifier_end}) => 
      underlined_text(x, y, style, text, id, underlineColor, identifier_start, identifier_end)
    );
    
      
}

function load_animation(){
    let delay = 250;
const delayIncrement = 50;  // milliseconds

d3.selectAll(".experience_circle").each(function (d, i) {
  const circle_id = '#experiences_circle-' + d;
  const icon_id = '#experiences_icon-' + d;
  const cy_incr=20;

  let cy=parseInt(d3.select(circle_id).attr("cy"));
  console.log("cy",cy)

  const SIZE_MULTIPLIER=1.25;
  d3.select(this)
    .transition()
    .delay(delay)
    .duration(TRANSITION_TIME/2)
    .attr("r", CIRCLE_RADIUS * SIZE_MULTIPLIER + "px")
    .attr("cy",cy-cy_incr)
    .transition()
    .duration(TRANSITION_TIME/2)
    .attr("cy",cy)
    .attr("r", CIRCLE_RADIUS_PX);


  d3.select(icon_id)
    .transition()
    .delay(delay)
    .duration(TRANSITION_TIME/2)
    .attr("width", ICON_WIDTH * SIZE_MULTIPLIER*0.9)
    .attr("height", ICON_HEIGHT * SIZE_MULTIPLIER*0.9)
    .attr("x", d3.select(circle_id).attr("cx") - (ICON_WIDTH* SIZE_MULTIPLIER*0.9)/2)
    .attr("y", d3.select(circle_id).attr("cy") - (ICON_HEIGHT* SIZE_MULTIPLIER*0.9)/2 -cy_incr)
    .transition()
    .duration(TRANSITION_TIME/2)
    .attr("width", ICON_WIDTH)
    .attr("height", ICON_HEIGHT)
    .attr("x", d3.select(circle_id).attr("cx") - ICON_WIDTH / 2)
    .attr("y", d3.select(circle_id).attr("cy") - ICON_HEIGHT / 2);

  delay += delayIncrement;
});

}


function show_tooltip(d){

    // Create tooltip
    const tooltip = d3.select("body").append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      // .style("border", "1px solid black")
      .style("padding", "5px")
      .style("opacity", 0.6);
    
      const svgWidth = width;
      const svgHeight=height;
    
    
      // Set tooltip content initially to measure size
      tooltip.html(pux_list_definitions[d.slice(0, 2)] + " " + PUX_COMPLETE[d].id[2] + ":<br>" + PUX_COMPLETE[d].name);
    
      // Dynamically calculate tooltip dimensions
      const tooltipDimensions = tooltip.node().getBoundingClientRect();
      const tooltipWidth = tooltipDimensions.width;
      const tooltipHeight = tooltipDimensions.height;
      
      // Mouse position
      const [x, y] = d3.pointer(event);
    
    // Calculate left and top position
    const leftPosition = (x + tooltipWidth > svgWidth) ? (x - tooltipWidth) : x;
    let topPosition = (y + tooltipHeight + 10 > svgHeight) ? (y - tooltipHeight) : (y + 10);
    topPosition=+338;
    // Update tooltip position
    tooltip
      .style("left", `${leftPosition}px`)
      .style("top", `${topPosition}px`);
    
    
    }
    
    