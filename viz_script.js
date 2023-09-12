
  // Create a set of unique children and a map of activities with children
  const uniqueChildren = Array.from(new Set(inputData.flatMap(d => d.imports)));
  const activitiesWithChildren = inputData;
  
  // Set dimensions
  const width = 960;
  const height = 700;
  
  // Create the SVG container
  const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
  

    svg.append("defs").append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 5)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "none")  // No fill to make it transparent
    .attr("stroke", "black")  // Outline color
    .attr("opacity", 0.3)  // Outline color
    .attr("stroke-width", "1");  // Outline width

let experiences="";


// Your list of elements
let list = ["IA", "SA", "CA", "VE", "SE", "ME", "TE", "IE", "PE", "CE"];

// Get the colors from d3.schemeTableau10
let colorScale = d3.scaleOrdinal(d3.schemeTableau10);

// Create a color map for your list
let colorMap = {};
list.forEach(function (element, index) {
  colorMap[element] = colorScale(index);
});

// Now, you can access the colors for each element in your list
console.log(colorMap["SE"]); // This will give you the color for "SE"


    
  // Scale for positioning children and parents
  const xScale = d3.scalePoint().domain(uniqueChildren).range([50, width - 50]).padding(0.5);
  const yScale = d3.scalePoint().domain(activitiesWithChildren.map(d => d.name)).range([50, width - 50]).padding(0.5);
  
  // Line generator for curvy lines
  const line = d3.line().curve(d3.curveBasis);
  
  // Draw lines connecting parents and children
  inputData.forEach(activity => {
    activity.imports.forEach(child => {
      const points = [
        [yScale(activity.name), 400],
        [(xScale(child) + yScale(activity.name)) / 2, (400 + 250) / 2],
        [xScale(child), 250],
      ];
      console.log("PRINTING",activity.name, child)
      svg.append("path")
        .attr("d", line(points))
        .attr("class", "activities_path")
        .attr("id",activity.name+"-"+child)
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4);
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
  .attr("marker-end", "url(#arrow)")
  .attr("class", "experiences_path")
  .attr("id", d=>d.source_id+"-"+d.target_id)
  .attr("d", d => {
    const y = 241; // Y-coordinate of the children
    const midX = (d.source + d.target) / 2;
    const path = d3.path();
    path.moveTo(d.source, y);
    // path.quadraticCurveTo(midX, y - 300+Math.ceil(Math.random()*100), d.target, y); // 100 controls the curvature
    // path.quadraticCurveTo(midX, y - (300 * Math.abs(d.strength)), d.target, y);
    // path.quadraticCurveTo(midX, y - (300 * Math.pow(Math.abs(d.strength), 2)), d.target, y);
    path.quadraticCurveTo(midX, y - (1000 * Math.pow(Math.abs(d.strength) - 0.45, 1)), d.target, y);

    // path.quadraticCurveTo(midX, y - (300 * Math.pow((d.strength - 0.5) / 0.4, 3)), d.target, y);

    return path.toString();
  })
  .attr("fill", "none")
  .attr("stroke", d => d.color) // Use 'stroke' attribute from the data
  .attr("stroke-width", d => 1) // Use 'stroke' attribute from the data
  .attr("color", d => d.color) // Use 'stroke' attribute from the data
  .attr("stroke-opacity", 0.4);
  
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
    .attr('cy', 410)
    .attr('r','10px')
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

// if (foundObject) {
//   console.log('Object found:', foundObject);
// } else {
//   console.log('Object not found');
// }


        experiences+=(foundObject.id+" ("+target+")"+", \n")

        d3.select("#"+source+"-"+target)
        .attr("stroke", colorMap[source.slice(0, 2)])
        .attr("stroke-width", 5)
        .attr("fill", "none")
        .attr("stroke-opacity", 1);
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
           .attr("dy", (d, i) => 15) // Adjust the line height as needed
           .text(d => d);

    
    })
    
    .on("mouseout", function(event, d) {
      // svg.selectAll(".experiences_txt")
      //   .style("font-weight", "normal");
      d3.select("#activity_txt").text("");
      experiences=""
      d3.select("#experience_txt").text(experiences);


      d3.selectAll(".activities_path") 
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.3);
      
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
    .each((d, i) => console.log(d,i)) // Moved console.log inside the .each() function
    .append('circle')
    .attr("id", d => "experiences_circle-" + d.name)
    .attr("class", "experience_circle")
    .attr("cx", d => xScale(d))
    .attr("cy", 250)
    .attr('r','10px')
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
          .attr("stroke", "#555")
        .attr("stroke-opacity", 0.1);


        d3.select("#"+source_id+"-"+target_id)
        .attr("stroke", d.color)
        .attr("stroke-width", 5)
        .attr("fill", "none")
        .attr("stroke-opacity", 1);
      
        // .style("font-weight", function(p) {
        //   return p.source === xScale(d) || p.target === xScale(d) ? 1 : 0.4;
        // });
    })
    .on("mouseout", function(event, d) {
      svg.selectAll(".experiences_txt")
        .style("font-weight", "normal");
  
      svg.selectAll(".experiences_path")
      .data(childLinks)
      .attr("fill", "none")
      .attr("stroke", d => d.color) // Use 'stroke' attribute from the data
      .attr("stroke-width", d => 1) // Use 'stroke' attribute from the data
      .attr("color", d => d.color) // Use 'stroke' attribute from the data
      .attr("stroke-opacity", 0.4);
      
    });



  // TEXT AT THE BOTTOM:
// EXPERIENCE
  svg.append("text")
  .attr("x", 50) // X-coordinate of the text
  .attr("y", 500) // Y-coordinate of the text
  .text("Acitivity:"); // Text content
  
  svg.append("text")
  .attr("x", 150) // X-coordinate of the text
  .attr("y", 500) // Y-coordinate of the text
  .text("Hover") // Text content
  .attr("id", "activity_txt"); // Set the id attribute

// ACTIVITIES
  svg.append("text")
  .attr("x", 50) // X-coordinate of the text
  .attr("y", 530) // Y-coordinate of the text
  .text("Experience:"); // Text content

  svg.append("text")
  .attr("x", 150) // X-coordinate of the text
  .attr("y", 530) // Y-coordinate of the text
  .text("Hover") // Text content
  .attr("id", "experience_txt"); // Set the id attribute
