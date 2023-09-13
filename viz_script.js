
  // Create a set of unique children and a map of activities with children
  const uniqueChildren = Array.from(new Set(inputData.flatMap(d => d.imports)));
  const activitiesWithChildren = inputData;
  
  // Set dimensions
  const width = 960;
  const height = 700;

  const STROKE_COLOR_ON="green";
  const STROKE_COLOR_OFF="#555";
  
  const STROKE_WIDTH_ON=5;
  const STROKE_WIDTH_OFF=1;

  const FORWARD_LINK_COLOR="green";
  const BACKWARD_LINK_COLOR="red";
  
  const OPACITY_ON=1;
  const OPACITY_OFF=0.2;

  const CIRCLE_RADIUS="11px"

  const START_POSITIVE_X=380;
  const START_NEGATIVE_X=700;

  // Create the SVG container
  const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
  

    // svg.append("defs").append("marker")
    // .attr("id", "arrow")
    // .attr("viewBox", "0 -5 10 10")
    // .attr("refX", 5)
    // .attr("refY", 0)
    // .attr("markerWidth", 6)
    // .attr("markerHeight", 6)
    // .attr("orient", "auto")
    // .append("path")
    // .attr("d", "M0,-5L10,0L0,5")
    // .attr("fill", "none")  // No fill to make it transparent
    // .attr("stroke", "black")  // Outline color
    // .attr("opacity", 0.3)  // Outline color
    // .attr("stroke-width", STROKE_WIDTH_OFF);  // Outline width
    

let experiences="";
let experiences_html="";

// Your list of elements
let list = ["IA", "SA", "CA", "VE", "SE", "ME", "TE", "IE", "PE", "CE"];

// Function to interpolate between two numbers
function interpolate(a, b, t) {
  return a + (b - a) * t;
}
// Get the colors from d3.schemeTableau10
let colorScale = d3.scaleOrdinal(d3.schemeTableau10);

// Create a color map for your list
let colorMap = {};
list.forEach(function (element, index) {
  colorMap[element] = colorScale(index);
});

  // Scale for positioning children and parents
  const xScale = d3.scalePoint().domain(uniqueChildren).range([50, width - 50]).padding(0.5);
  const yScale = d3.scalePoint().domain(activitiesWithChildren.map(d => d.name)).range([50, width - 50]).padding(0.5);
  
  // Line generator for curvy lines
  const line = d3.line().curve(d3.curveBasis);
  

  const controlPointFactor = 0.9; // Adjust this factor to control the sharpness

  // Draw lines connecting parents and children
  inputData.forEach(activity => {
    activity.imports.forEach(child => {
      const points = [
        [yScale(activity.name), 400],
        [interpolate(yScale(activity.name), xScale(child), controlPointFactor), (400 + 250) / 2],
        [xScale(child), 250]
      ];

      console.log("PRINTING",activity.name, child)
      svg.append("path")
        .attr("d", line(points))
        .attr("class", "activities_path")
        .attr("id",activity.name+"-"+child)
        .attr("fill", "none")
        .attr("stroke", STROKE_COLOR_OFF)
        .attr("stroke-opacity", OPACITY_OFF);
    });
  });
  
  const childLinks = [];
  newData.forEach(d => {
    d.link_positive.forEach(linkObj => {
      const targetName = Object.keys(linkObj)[0];
      const strength = linkObj[targetName];
      childLinks.push({ source_id:d.name,target_id:targetName,source: xScale(d.name), target: xScale(targetName), color: "red", strength: strength });
    });
    d.link_negative.forEach(linkObj => {
      const targetName = Object.keys(linkObj)[0];
      const strength = linkObj[targetName];
      childLinks.push({ source_id:d.name,target_id:targetName,source: xScale(d.name), target: xScale(targetName), color: "blue", strength: strength });
    });
  });

// Draw arc-shaped links
svg.append("g")
  .selectAll("path")
  .data(childLinks)
  .enter().append("path")
  // .attr("marker-end", "url(#arrow)")
  .attr("class", "experiences_path")
  .attr("id", d=>d.source_id+"-"+d.target_id)
  .attr("d", d => {
    const y = 241; // Y-coordinate of the children
    // const midX = (d.source + d.target) / 2;
    const midX = d.source;

    const path = d3.path();
    path.moveTo(d.source, y);
    const curve_height=y - (1000 * Math.pow(Math.abs(d.strength) - 0.45, 1));
    const curve_offset=Math.random()*25;
    path.quadraticCurveTo(midX, curve_height+curve_offset, d.target, y);

    return path.toString();
  })
  .style("fill", "none")
  .style("stroke", d => d.color) // Use 'stroke' attribute from the data
  .style("stroke-width", d => 1) // Use 'stroke' attribute from the data
  .style("color", d => d.color) // Use 'stroke' attribute from the data
  .style("stroke-opacity", OPACITY_OFF);
  
  // Draw nodes for activities (parents)
  // LOWER NODES

  svg.append("g")
  .selectAll("text.activities")
  .data(activitiesWithChildren)
     .enter()
    // .each((d, i) => console.log(i)) // Moved console.log inside the .each() function
    .append('circle')
    .attr("id", d => "activity_circle-" + d.name)
    .attr("class", "activity_circle")
    .attr('cx',d => yScale(d.name) )
    .attr('cy', 408)
    .attr('r',CIRCLE_RADIUS)
    .style('fill',d=> colorMap[d.name.slice(0, 2)]);
    // .each((d, i) => console.log(i)); // Moved console.log inside the .each() function

    
    d3.selectAll(".activity_circle")
      .on("mouseover", function(event, d) {

        d3.select("#activity_txt").text(d.id +" ("+d.name+")");
        console.log(d);

        let source=d.name;
        let targets=d.imports;
      
        targets.forEach(function(target) {
          // Do something with each element here
          console.log(target);

        const foundObject = newData.find(item => item.name === target);

          experiences+=(foundObject.id+" ("+target+")"+", \n");
          experiences_html+=`<span style="color: ${colorMap[target]};">${target}</span> <h5>${foundObject.id}</h5><br>`;

          d3.select("#"+source+"-"+target)
          .style("stroke", colorMap[source.slice(0, 2)])
          .style("stroke-width", STROKE_WIDTH_ON)
          .style("fill", "none")
          .style("stroke-opacity", OPACITY_ON);
        });

        let split_text=experiences.split("\n")

      d3.select("#experience_txt")
           .attr("text-anchor", "start") // Adjust as needed
           .selectAll("tspan")
           .remove() // Remove any existing tspan elements
           .data(split_text) // Split the text into an array based on line breaks
           .enter()
           .append("tspan")
           .attr("x", 150) // Adjust the x-coordinate as needed
           .attr("dy", (d, i) => i==0?0:15) // Adjust the line height as needed
           .text(d => d);

      // console.log(experiences_html);
      //      d3.select("#experience_txt").html(experiences_html);

    
    })
    
    .on("mouseout", function(event, d) {
      // svg.selectAll(".experiences_txt")
      //   .style("font-weight", "normal");
      d3.select("#activity_txt").text("");
      experiences=""
      d3.select("#experience_txt").text(experiences);


      d3.selectAll(".activities_path") 
        .style("fill", "none")
        .style("stroke", STROKE_COLOR_OFF)
        .style("stroke-width", STROKE_WIDTH_OFF)
        .style("stroke-opacity", OPACITY_OFF);
      
    });

  svg.append("g")
    .selectAll("text.activities")
    .data(activitiesWithChildren)
    .enter().append("text")
    .attr("class", "activities_txt")
    .attr("x", d => yScale(d.name))
    .attr("y", 410)
    .attr("text-anchor", "middle")
    .text(d => d.name)
    .attr("id", d => "activity-" + d.name);
  
  // Draw nodes for unique children
  // UPPER NODES

  svg.append("g")
  .selectAll("text.children")
  .data(uniqueChildren)
     .enter()
    // .each((d, i) => console.log(d,i)) // Moved console.log inside the .each() function
    .append('circle')
    .attr("id", d => "experiences_circle-" + d)
    .attr("class", "experience_circle")
    .attr("cx", d => xScale(d))
    .attr("cy", 248)
    .attr('r',CIRCLE_RADIUS)
    .style('fill',d=> colorMap[d.slice(0, 2)]);

  svg.append("g")
    .selectAll("text.children")
    .data(uniqueChildren)
    .enter().append("text")
    .attr("class", "experiences_txt")
    .attr("x", d => xScale(d))
    .attr("y", 250)
    .attr("text-anchor", "middle")
    .text(d => d)
    .attr("id", d =>"experience-"+d);


  d3.selectAll(".experiences_path")
    .on("mouseover", function(event, d) {

      console.log(event, d);
      let source_id=d.source_id;
      let target_id=d.target_id;

      d3.select("#experience-"+target_id)
      .style("font-weight", "bolder");
  
      d3.select("#experience-"+source_id)
        .style("font-weight", "bolder");

        svg.selectAll(".experiences_path")
          .style("stroke", "#555")
          .style("stroke-opacity", OPACITY_OFF);

        d3.select("#"+source_id+"-"+target_id)
          .style("stroke", d.color)
          .style("stroke-width", STROKE_WIDTH_ON)
          .style("fill", "none")
          .style("stroke-opacity", OPACITY_ON);
      
        // .style("font-weight", function(p) {
        //   return p.source === xScale(d) || p.target === xScale(d) ? 1 : 0.4;
        // });
    })
    .on("mouseout", function(event, d) {
      svg.selectAll(".experiences_txt")
        .style("font-weight", "normal");
  
      svg.selectAll(".experiences_path")
      .data(childLinks)
      .style("fill", "none")
      .style("stroke", d => d.color) // Use 'stroke' attribute from the data
      .style("stroke-width", STROKE_WIDTH_OFF) // Use 'stroke' attribute from the data
      .style("color", d => d.color) // Use 'stroke' attribute from the data
      .style("stroke-opacity", OPACITY_OFF);
    });

    d3.selectAll(".experiences_path")
    .on("mouseover", function(event, d) {

      console.log(event, d);
      let source_id=d.source_id;
      let target_id=d.target_id;

      d3.select("#experience-"+target_id)
      .style("font-weight", "bolder");
  
      d3.select("#experience-"+source_id)
        .style("font-weight", "bolder");

        svg.selectAll(".experiences_path")
          .style("stroke", STROKE_WIDTH_OFF)
          .style("stroke-opacity", OPACITY_OFF);

        d3.select("#"+source_id+"-"+target_id)
        .style("stroke", d.color)
        .style("stroke-width", STROKE_WIDTH_ON)
        .style("fill", "none")
        .style("stroke-opacity", OPACITY_ON);
      
        // .style("font-weight", function(p) {
        //   return p.source === xScale(d) || p.target === xScale(d) ? 1 : 0.4;
        // });
    })
    .on("mouseout", function(event, d) {
      svg.selectAll(".experiences_txt")
        .style("font-weight", "normal");
  
      svg.selectAll(".experiences_path")
      .data(childLinks)
      .style("fill", "none")
      .style("stroke", d => d.color) // Use 'stroke' attribute from the data
      .style("stroke-width", STROKE_COLOR_ON) // Use 'stroke' attribute from the data
      .style("color", d => d.color) // Use 'stroke' attribute from the data
      .style("stroke-opacity", OPACITY_OFF);
    });



  
  d3.selectAll(".experience_circle")
  .on("mouseover", function(event, d) {

    // SHOW PARENT/ROOT CIRCLES

    let parent_list=findNameByImport(d);
    let parent_text=""
    for (let i =0; i<parent_list.length;i++){
      let entry=parent_list[i]

      const found_parent = inputData.find(item => item.name === entry);

      parent_text+=found_parent.id+" ("+entry+'), \n';

      // console.log("entry", entry,colorMap[entry.slice(0, 2)])
      d3.select("#"+entry+"-"+d)
        .style("stroke", colorMap[entry.slice(0, 2)])
        .style("stroke-width", STROKE_WIDTH_ON)
        .style("stroke-opacity", OPACITY_ON)

    }


console.log(parent_text)

let split_text=parent_text.split("\n")

d3.select("#activity_txt").text("")


d3.select("#activity_txt")
     .attr("text-anchor", "start") // Adjust as needed
     .selectAll("tspan")
     .remove() // Remove any existing tspan elements
     .data(split_text) // Split the text into an array based on line breaks
     .enter()
     .append("tspan")
     .attr("x", 150) // Adjust the x-coordinate as needed
     .attr("dy", (d, i) => i==0?0:15) // Adjust the line height as needed
     .text(d => d);


     //-------------- duplicated code
     const foundObject = newData.find(item => item.name === d);
     experiences+=(foundObject.id+" ("+d+")"+", \n");
    split_text=experiences.split("\n")

 d3.select("#experience_txt")
      .text(foundObject.id+" ("+d+")"+", \n");
//------------

    d3.selectAll(".experience_circle")
    .style("opacity", OPACITY_OFF)

    d3.select(this).style("opacity", OPACITY_ON)

    d3.selectAll(".experiences_path")
      .style("stroke", STROKE_COLOR_OFF)
      .style("opacity", OPACITY_OFF)
      .style("stroke-width", STROKE_WIDTH_OFF)

      // Initialize two arrays to store IDs
      const firstHalfIDs = [];
      const secondHalfIDs = [];
      
      // Select all elements with the class "experiences_path"
      d3.selectAll(".experiences_path").each(function() {
        const idParts = this.id.split("-");
        if (idParts[0].includes(d)) {
          firstHalfIDs.push(this.id);
        } else if (idParts[1].includes(d)) {
          secondHalfIDs.push(this.id);
        }
      });
    
    // Calculate the total length of the path
    let pathLength;

    let positive_experience="";
    let negative_experience="";



    // Loop through and target elements with specificString in the first half
    firstHalfIDs.forEach(function(id) {
      
      target_circle="";
      target_circle= id.split("-")[1];

      d3.select("#experiences_circle-"+target_circle).style("opacity", OPACITY_ON)

      pathLength = d3.select("#" + id).node().getTotalLength();

      d3.select("#" + id)
        .attr("stroke-dasharray", pathLength + " " + pathLength)
        .attr("stroke-dashoffset", pathLength)
        .style("stroke", FORWARD_LINK_COLOR)
        .style("stroke-width", STROKE_WIDTH_ON)
        .style("opacity",OPACITY_ON)
        .transition()
          .duration(1500) // Animation duration in milliseconds
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0)
          .on("end", () => {
            // Animation has completed
            d3.select("#" + id)
          });
        // Adjust stroke properties as needed


        // console.log(id, target_circle);
        // TODO: SE1 breaks and a lot of things break wtf
        let foundObject = newData.find(item => item.name === target_circle)
        if(foundObject==undefined){
          console.log("id", id,"ERROR?",foundObject, "target",target_circle)

          foundObject = inputData.find(item => item.name === target_circle)
          console.log("id", id,"ERROR?",foundObject, "target",target_circle)

        }
        positive_experience+=(foundObject.id+" ("+target_circle+")"+", \n")
  
  
    });
    
    // Loop through and target elements with specificString in the second half
    secondHalfIDs.forEach(function(id) {
      target_circle= id.split("-")[0];

      let foundObject = newData.find(item => item.name === target_circle)
        if(foundObject==undefined){
          console.log("id", id,"ERROR?",foundObject, "target",target_circle)
          foundObject = inputData.find(item => item.name === target_circle)
          console.log("id", id,"ERROR?",foundObject, "target",target_circle)
        }
        
      negative_experience+=(foundObject.id+" ("+target_circle+")"+", \n")

      // console.log(id, target_circle);
      d3.select("#experiences_circle-"+target_circle).style("opacity", OPACITY_ON)

      pathLength = d3.select("#" + id).node().getTotalLength();

      d3.select("#" + id)
        .attr("stroke-dasharray", pathLength + " " + pathLength)
        .attr("stroke-dashoffset", pathLength)
        .style("stroke", BACKWARD_LINK_COLOR)
        .style("stroke-width", STROKE_WIDTH_ON)
        .style("opacity",OPACITY_ON)
        .transition()
          .duration(1500) // Animation duration in milliseconds
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0)
          });


          console.log(parent_text)

          let split_positive=positive_experience.split("\n")
          let split_negative=negative_experience.split("\n")

          
          d3.select("#negative_experience").text("")
          d3.select("#positive_experience").text("")

          
          d3.select("#negative_experience")
               .attr("text-anchor", "start") // Adjust as needed
               .selectAll("tspan")
               .remove() // Remove any existing tspan elements
               .data(split_negative) // Split the text into an array based on line breaks
               .enter()
               .append("tspan")
               .attr("x", START_NEGATIVE_X) // Adjust the x-coordinate as needed
               .attr("dy", (d, i) => i==0?0:15) // Adjust the line height as needed
               .text(d => d);


          d3.select("#positive_experience")
          .attr("text-anchor", "start") // Adjust as needed
          .selectAll("tspan")
          .remove() // Remove any existing tspan elements
          .data(split_positive) // Split the text into an array based on line breaks
          .enter()
          .append("tspan")
          .attr("x", START_POSITIVE_X) // Adjust the x-coordinate as needed
          .attr("dy", (d, i) => i==0?0:15) // Adjust the line height as needed
          .text(d => d);


  })
  .on("mouseout", function(event, d) {

    d3.selectAll(".activities_path")
    .style("stroke", STROKE_COLOR_OFF)
    .style("stroke-width", STROKE_WIDTH_OFF)
    .style("stroke-opacity", OPACITY_OFF)

    d3.selectAll(".experiences_path")
    .style("stroke", STROKE_COLOR_OFF)
    .style("stroke-width", STROKE_WIDTH_OFF)
    .style("stroke-opacity", OPACITY_OFF)

    d3.selectAll(".experience_circle")
    .style("stroke-opacity", OPACITY_ON)
    .style("opacity", OPACITY_ON)

    d3.select("#positive_experience").text("");
    d3.select("#negative_experience").text("");

  })

  
//   d3.selectAll(".experience_circle")
//   .on("mouseover", function(event, d) {

//     console.log("experiences", d);
  

// d3.selectAll(".experiences_path")
//   .filter(function() {
//     const idParts = this.id.split("-");
//     return idParts[0].includes(d) || idParts[1].includes(d);
//   })
//   .style("stroke-width", 5)
//   .style("stroke", "green"); // Example: Change the fill color of matching elements


// // d3.selectAll(".experiences_path")
// //   .filter(function() {
// //     return this.id.includes(d);
// //   })
// //   .style("stroke-width", 5); // Example: Change the fill color of matching elements

//   // .style("stroke", "yellow"); // Example: Change the fill color of matching elements

    
     
//   })
//   .on("mouseout", function(event, d) {
   
//   });

// d3.selectAll("circle")
//   .on("mouseover", function(event, d) {

//     d3.select(this)
//     .attr("stroke", "black")
//     .attr("stroke-width", 2);
     
//   })
//   .on("mouseout", function(event, d) {
//     d3.select(this)
//     .attr("stroke", "none")
//     .attr("stroke-width", 0);
//   });

function findNameByImport(importValue) {
  let list_of_matches=[];
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



  // TEXT AT THE BOTTOM:
// ACTIVITIES
svg.append("text")
.attr("x", 50) // X-coordinate of the text
.attr("y", 500) // Y-coordinate of the text
.style("font-weight", "bolder")
.text("Acitivity:"); // Text content

svg.append("text")
.attr("x", 150) // X-coordinate of the text
.attr("y", 500) // Y-coordinate of the text
.text("Hover") // Text content
.attr("id", "activity_txt"); // Set the id attribute

// EXPERIENCE
svg.append("text")
.attr("x", 50) // X-coordinate of the text
.attr("y", 550) // Y-coordinate of the text
.style("font-weight", "bolder")
.text("Experience:"); // Text content

svg.append("text")
.attr("x", 150) // X-coordinate of the text
.attr("y", 550) // Y-coordinate of the text
.text("Hover") // Text content
.attr("id", "experience_txt"); // Set the id attribute


// POSITIVES AND NEGATIVES
svg.append("text")
.attr("x", START_POSITIVE_X) // X-coordinate of the text
.attr("y", 500) // Y-coordinate of the text
.text("Positively corelated:") // Text content
.style("font-weight", "bolder");


svg.append("text")
.attr("x", START_POSITIVE_X) // X-coordinate of the text
.attr("y", 515) // Y-coordinate of the text
.text("Select Experience") // Text content
.attr("id", "positive_experience"); // Set the id attribute


svg.append("text")
.attr("x", START_NEGATIVE_X) // X-coordinate of the text
.attr("y", 500) // Y-coordinate of the text
.text("Negatively corelated:") // Text content
.style("font-weight", "bolder");


svg.append("text")
.attr("x", START_NEGATIVE_X) // X-coordinate of the text
.attr("y", 515) // Y-coordinate of the text
.text("Select Experience") // Text content
.attr("id", "negative_experience"); // Set the id attribute