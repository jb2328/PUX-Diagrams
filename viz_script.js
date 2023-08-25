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
    // {'name': 'PE4','in': ['CE3', 'ME5', 'PE6'],'out': ['IE6',  'TE4']},
    // {'name': 'VE3', 'in': ['SE2', 'PE1', 'IE1', 'CE2', 'PE6'], 'out': ['ME4', 'TE5', 'VE1', 'VE4']},
    // {'name': 'ME6', 'in': ['VE4'], 'out': ['CE3', 'ME4', 'IE5']},
    // {'name': 'SE2','in': ['ME2', 'IE2', 'CE1', 'PE2'],'out': ['TE2', 'TE3', 'TE5', 'PE5', 'SE3', 'ME3']},
    // {'name': 'CE3','in': ['PE5', 'IE1'],'out': [ 'TE2', 'ME6', 'ME4']},
    // {'name': 'ME1','in': ['IE2', 'ME3'],'out': ['ME6', 'PE1', 'TE4', 'VE3', 'IE1']},
    // {'name': 'CE4','in': ['ME3', 'PE1'],'out': ['SE2', 'SE3', 'PE4', 'CE3', 'IE4', 'VE5']},
    // {'name': 'CE2', 'in': ['IE5', 'SE3', 'CE4', 'VE3'], 'out': ['ME1']},
    // {'name': 'IE5', 'in': ['ME1'], 'out': ['IE6', 'CE4', 'ME2', 'IE3', 'PE3']},
    // {'name': 'TE5', 'in': ['IE4'], 'out': ['TE4']},
    // {'name': 'IE4','in': ['CE2', 'CE4', 'CE3', 'IE3', 'PE3', 'ME2'], 'out': ['SE1', 'TE4', 'TE5', 'PE2', 'PE6']},
    // {'name': 'TE1', 'in': ['SE4', 'VE3', 'SE3', 'VE5'], 'out': ['TE2']},
    // {'name': 'PE5','in': ['ME6', 'PE6', ],'out': ['ME4', 'IE2', 'TE4', 'ME1', 'IE4']},
    // {'name': 'SE4','in': ['IE2', 'IE1', 'ME6'],'out': ['SE1', 'TE5', 'PE6', 'IE5', 'SE3', 'ME1']},
    // {'name': 'PE1', 'in': ['PE5'], 'out': ['SE2', 'CE2', 'VE4', 'CE4', 'IE4']},
    // {'name': 'PE2', 'in': ['PE6'], 'out': ['ME2', 'VE5', 'SE2', 'IE1']},
    // {'name': 'ME3', 'in': ['ME4', 'IE4', 'PE1'], 'out': ['ME6', 'PE6', 'PE4']},
    // {'name': 'VE1', 'in': ['PE5'], 'out': ['PE6', 'ME2', 'IE3', 'VE4']},
    // {'name': 'ME5', 'in': ['ME6'], 'out': ['PE3', 'IE1']},
    // {'name': 'TE3','in': ['PE1', 'VE2', 'TE5', 'IE3', 'PE2', 'VE5'],'out': ['TE1', 'SE2']},
    // {'name': 'IE6','in': ['ME5', 'ME1', 'IE4', 'CE1', 'SE1'],'out': ['PE6', 'CE3', 'PE1', 'TE4', 'ME2', 'ME3']},
    // {'name': 'TE4', 'in': ['IE2', 'IE3'], 'out': ['CE1', 'SE1']}
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
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4);
    });
  });
  
  // Draw nodes for activities (parents)
  svg.append("g")
    .selectAll("text.activities")
    .data(activitiesWithChildren)
    .enter().append("text")
    .attr("x", d => yScale(d.name))
    .attr("y", 400)
    .attr("text-anchor", "middle")
    .text(d => d.name);
  
  // Draw nodes for unique children
  svg.append("g")
    .selectAll("text.children")
    .data(uniqueChildren)
    .enter().append("text")
    .attr("x", d => xScale(d))
    .attr("y", 250)
    .attr("text-anchor", "middle")
    .text(d => d);
  
  // Create links between children based on the "in" and "out" connections
  const childLinks = [];
  secondaryData.forEach(d => {
    d.in.forEach(targetName => {
      childLinks.push({ source: xScale(d.name), target: xScale(targetName), color: "red" });
    });
    d.out.forEach(targetName => {
      childLinks.push({ source: xScale(d.name), target: xScale(targetName), color: "blue" });
    });
  });
  

// Draw arc-shaped links
svg.append("g")
  .selectAll("path")
  .data(childLinks)
  .enter().append("path")
  .attr("d", d => {
    const y = 241; // Y-coordinate of the children
    const midX = (d.source + d.target) / 2;
    const path = d3.path();
    path.moveTo(d.source, y);
    path.quadraticCurveTo(midX, y - 300+Math.ceil(Math.random()*100), d.target, y); // 100 controls the curvature
    return path.toString();
  })
  .attr("fill", "none")
  .attr("stroke", d => d.color) // Use 'stroke' attribute from the data
  .attr("stroke-width", d => 1) // Use 'stroke' attribute from the data
  .attr("color", d => d.color) // Use 'stroke' attribute from the data
  .attr("stroke-opacity", 0.4);