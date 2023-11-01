// Create a set of unique children and a map of activities with children
// const uniqueChildren = Array.from(new Set(activities.flatMap((d) => d.imports)));
const uniqueChildren = exp_list.map(item => item.name);

const activitiesWithChildren = activities;

// Set dimensions
const width = 1150;
const height = 700;
const padding=20;

const STROKE_COLOR_ON = "green";
const STROKE_COLOR_OFF = "#555";

const STROKE_WIDTH_ON = 5;
const STROKE_WIDTH_OFF = 1;

const FORWARD_LINK_COLOR = "green";
const BACKWARD_LINK_COLOR = "red";

const OPACITY_ON = 1;
const OPACITY_OFF = 0.2;

const EXP_ID_TXT=270; // location of the experience id locs

const START_POSITIVE_X = 380; // x pos for positive experiences
const START_NEGATIVE_X = 700; // x pos for negative experiences
const START_Y = 511.5; // Y pos for negative and positive experiences

// Y pos for CIRCLE rows
const Y_EXPERIENCES=400;
const Y_ACTIVITIES=250;

// ------ICON PARAMETERS------//
const CIRCLE_RADIUS=15;
const CIRCLE_RADIUS_PX = CIRCLE_RADIUS+"px";

const SIZE_MULTIPLIER=  2; // how much larger should a circle get after hover
const ICON_MULTIPLIER=SIZE_MULTIPLIER*0.9; // how much larger should an icon get after hover

const TRANSITION_TIME = 300; // icon transition growth time 

const ICON_HEIGHT=CIRCLE_RADIUS*ICON_MULTIPLIER;
const ICON_WIDTH=CIRCLE_RADIUS*ICON_MULTIPLIER;

const VIZ_MODE=0;


const yChild = Y_ACTIVITIES-9;
const yParent = Y_EXPERIENCES+8;
const strokeWidth = 1;

const svg = d3
  .select("#svg-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

let experiences_html = "";

// Create a color map for your list
let colorMap = {};

pux_list.forEach(function (element, index) {
  colorMap[element] = colorScale(index);
});

// Scale for positioning children and parents
const xScale = d3
  .scalePoint()
  .domain(uniqueChildren)
  .range([padding, width - padding])
  .padding(0.5);

const yScale = d3
  .scalePoint()
  .domain(activitiesWithChildren.map((d) => d.name))
  .range([padding, width - padding])
  .padding(0.5);

// Line generator for curvy lines
const line = d3.line().curve(d3.curveBasis);
const controlPointFactor = 0.9; // Adjust this factor to control the sharpness



// Draw lines connecting ACTIVITIES and EXPERIENCES
activities.forEach((activity) => {
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


const experience_links = [];

// generate links between experiences
//can be expand to make use of linkType variable
exp_list.forEach((d) => {
  ['link_positive', 'link_negative'].forEach((linkType) => {
    d[linkType].forEach((linkObj) => {

      const targetName = Object.keys(linkObj)[0];
      const strength = linkObj[targetName];
      const pos_y = calculatePosY(d, width, height);

      experience_links.push({
        source_id: d.name,
        target_id: targetName,
        source: Math.round(xScale(d.name),1),
        target: Math.round(xScale(targetName),1),
        color: "darkgray",
        strength: strength,
        viz_mode: VIZ_MODE,
        yNewCoord: pos_y

      });
    });
  });
});

// Draw arc-shaped links for EXPERIENCES
svg
  .append("g")
  .selectAll("path")
  .data(experience_links)
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
svg
  .append("g")
  .selectAll("text.activities")
  .data(activitiesWithChildren)
  .enter()
  .append("circle")
  .attr("id", (d) => `activity_circle-${d.name}`)
  .attr("class", "activity_circle")
  .attr("cx", (d) => yScale(d.name))
  .attr("cy", yParent)
  .attr("r", CIRCLE_RADIUS/1.5 +"px")
  .attr("fill", "white")
  .attr("stroke", (d) => colorMap[d.name.slice(0, 2)])
  .style("stroke-width",3);



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
  .attr("y", Y_EXPERIENCES+42)
  .attr("text-anchor", "middle")
  .style("font-size", "8px") // Original font size
  .style("fill", "darkgray") // Original color
  .text((d) => d.name)
  .attr("id", (d) => `activity-${d.name}`);

  svg
  .append("g")
  .selectAll("text.activities")
  .data(activitiesWithChildren)
  .enter()
  .append("text")
  .attr("class", "activities_txt")
  .style("pointer-events", "none")
  .attr("x", (d) => yScale(d.name))
  .attr("y", Y_EXPERIENCES+33)
  .attr("text-anchor", "middle")
  .text((d) => d.id)
  .attr("id", (d) => `activity-${d.name}`);

// =========== ACTIVITY CIRCLES (BOTTOM) =========== //

d3.selectAll(".activity_circle")
  .on("mouseover", function (event, d) {

    // sets innerhtml for headers and text on the right
    set_html_text(d,'activity');

    // show lists of ACTIVITIES in bottom left
    activity_bullets(d);

    // show lists of EXPERIENCES in bottom left
    experience_bullets(d);

  })
  .on("mouseout", function (event, d) {

    clear_html_text();
    clear_bullets();

  });
// =========== ACTIVITY CIRCLES END =========== //


// =========== EXPERIENCE CIRCLES (TOP) =========== //

// Draw circles for unique children.child-group
svg
  .append("g")
  .selectAll("circle.children")
  .data(uniqueChildren)
  .enter()
  .append("circle")
  .attr("id", (d) => `experiences_circle-${d}`)
  .attr("class", "experience_circle")
  .attr("cx", (d) => xScale(d))
  .attr("cy", Y_ACTIVITIES-2)
  .attr("r", CIRCLE_RADIUS_PX)
  .style("fill", (d) => colorMap[d.slice(0, 2)]);

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
  .attr("y", 248 - ICON_HEIGHT / 2)
  .attr("width", ICON_WIDTH)
  .attr("height", ICON_HEIGHT);

// Draw text labels for unique children
svg
  .append("g")
  .attr("id", (d) => `experiences_txt-${d}`)
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

  let topLayer = d3.select("#topLayer");  // Create or select a top layer group
  if (topLayer.empty()) {
    topLayer = d3.select("svg").append("g").attr("id", "topLayer");
  }  //required so that icons do not overlap on z index

d3.selectAll(".experience_circle")
  .on("mouseover", function (event, d) {

    clear_bullets();

    set_html_text(d, 'experience');
   
    combined_bullets(d, find_experience_parents(d));  //bottom left bullets
   
    clean_experience_paths(); //set all experience paths gray

    //highlight relevant icons
    d3.selectAll(".experience_circle").style("opacity", OPACITY_OFF);
    d3.select(this).style("opacity", OPACITY_ON);

    experience_sentiments_bullets(d); // bullets for positive and negative experience correlations
  
    icon_zoom(d);

    show_tooltip(d);

  })

  .on("mouseout", function (event, d) {

    clear_bullets();

    clear_html_text();
   
    clean_experience_paths();  //targets experience paths and circles

    clean_activities_paths(); //targets activity paths only (optional)

    icon_dezoom(d);

    d3.select("#tooltip").remove();

  });

// =========== EXPERIENCE CIRCLES END =========== //

add_strength_scale();

add_text_aid();

load_animation();
