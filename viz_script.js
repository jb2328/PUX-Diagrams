// Your data
const inputData = 
  // ... (your data here)
  [
  {
    "id": "Search",
    "name": "IA1",
    "size": 1,
    "imports": ["VE1", "VE4", "SE3", "TE4"]
  },
  {
    "id": "Comparison",
    "name": "IA2",
    "size": 1,
    "imports": ["VE5", "SE4", "ME4", "TE2"]
  },
  {
    "id": "Sense-making",
    "name": "IA3",
    "size": 1,
    "imports": ["VE2", "VE3", "SE1", "ME1", "ME3", "TE3", "TE5"]
  },
  {
    "id": "Incrementation",
    "name": "CA1",
    "size": 1,
    "imports": ["IE1", "PE6"]
  },
  {
    "id": "Transcription",
    "name": "CA2",
    "size": 1,
    "imports": ["ME2", "IE2", "IE3", "IE5", "PE2", "PE5"]
  },
  {
    "id": "Modification",
    "name": "CA3",
    "size": 1,
    "imports": ["SE2", "ME5", "IE4", "TE1", "PE1", "CE1"]
  },
  {
    "id": "Exploratory design",
    "name": "CA4",
    "size": 1,
    "imports": ["TE5", "PE3", "PE4", "CE2", "CE3", "CE4"]
  },
  {
    "id": "Illustrate a story",
    "name": "SA1",
    "size": 1,
    "imports": ["VE2", "VE4", "IE6", "TE1", "CE3"]
  },
  {
    "id": "Organise a discussion",
    "name": "SA2",
    "size": 1,
    "imports": ["ME5", "IE2", "TE2", "PE3", "PE4", "CE4"]
  },
  {
    "id": "Persuade an audience",
    "name": "SA3",
    "size": 1,
    "imports": ["VE3", "SE4", "ME2", "ME6", "IE5", "TE3", "TE5"]
  }

];

const secondaryData=[
    {'name': 'VE2','in': ['IE5', 'CE3'],'out': ['IE2', 'VE5', 'TE4', 'ME6', 'SE1']},
    {'name': 'IE2', 'in': ['ME2', 'PE6'], 'out': ['PE2', 'SE2']},
    {'name': 'ME4', 'in': ['ME6', 'PE2', 'TE5', 'ME1', 'TE2'], 'out': ['SE4']},
    {'name': 'IE3','in': ['PE5', 'VE5', 'SE1', 'ME2', 'ME6'], 'out': ['CE4', 'CE3']},
    {'name': 'VE5', 'in': ['SE3', 'SE2', 'ME4'], 'out': ['ME3', 'IE2', 'CE4']},
    {'name': 'PE6','in': ['ME3', 'PE5'],'out': ['CE1', 'SE2', 'PE1', 'ME5', 'IE6', 'IE1']},
    {'name': 'PE3','in': ['CE3', 'VE2', 'PE2', 'ME5', 'TE1'], 'out': ['TE5', 'PE4']},
    {'name': 'SE3','in': ['ME4', 'PE1', 'ME6'],'out': ['IE5', 'PE6', 'CE2', 'IE2', 'SE1', 'VE3']},
    {'name': 'ME2','in': ['IE5', 'IE4', 'IE3', 'SE1', 'VE2'],'out': ['TE4', 'IE6']},
    {'name': 'IE1','in': ['PE1', 'IE2', 'PE3', 'IE3'],'out': ['CE4', 'ME1']},
    {'name': 'CE1','in': ['PE3', 'TE3', 'VE3', 'VE1', 'IE2', 'TE4'],'out': ['ME3']},
    {'name': 'VE4', 'in': ['IE6'], 'out': ['SE1']},
    {'name': 'SE1', 'in': ['TE2'], 'out': ['ME2']},
    {'name': 'TE2', 'in': ['ME4'], 'out': ['ME6', 'CE4']},

];




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
      svg.append("path")
        .attr("d", line(points))
        .attr("class", "activities_path")
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
    path.quadraticCurveTo(midX, y - (1150 * Math.pow(Math.abs(d.strength) - 0.5, 1)), d.target, y);

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
