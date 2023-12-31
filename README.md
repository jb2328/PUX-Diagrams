# Interactive Data Visualization

Explore live: https://jb2328.github.io/PUX-Diagrams/

ReadMe written by ChatGPT with some minor modifications by jb2328. 

## Overview

This repository contains the code and files for an interactive data visualization project. The visualization is designed to accompany the paper "A Pattern Language for the Design of Diagrams" by Alan Blackwell.

![Screenshot of the visualisation](/docs/pux_screenshot.png)


### PUX  

PUX, or Patterns of User Experience, is a framework aimed at enhancing the interaction between users and diagrams within user interfaces. It is designed to identify and apply user experience patterns that make diagrams more comprehensible, interactive, and adaptable to various user needs and expertise levels.

![PUX Heatmap](/docs/heatmap.png)

The framework describes 36 experiences and 10 activities. The heatmap above shows how these experiences are interlinked, with heatmap values representing their correlation strength. The d3.js visualisation creates a more interactive and designer-friendly version of this.

## Usage

1. Clone this repository to your local machine.
2. Open the `index.html` file in your web browser.
3. Explore the interactive visualization to gain insights into the research paper's content.

## Directory Structure
- `PUX_data.js`: Full PUX paragraphs and ChatGPT4 generated summaries.
- `dataset.js`: Data structures and metadata for the visualization.
- `helpers.js`: A bunch of helper functions to keep the main script clean.
- `color_map.js`: D3.js colormaps to be swapped whenever needed.
- `index.html`: Main HTML file where the visualization is displayed.
- `viz_script.js`: Main visualization script.
- `heatmap.ipynb`: Heatmap plot script.


## Features

- Interactive D3 visualization.
- Provides a visual representation of concepts discussed in the research paper.
- Enhances understanding and engagement with the paper's content.

## Acknowledgments

Thanks to the Abstract Coffee Group* for their insightful discussions and valuable input during the development of this project.

---

\* *Note: not the actual group's name.

**References:**

1. Alan Blackwell, "A Pattern Language for the Design of Diagrams." [Read Paper](https://www.cl.cam.ac.uk/~afb21/publications/Richards-Diagrams-Chapter.pdf)

2. MIT License. [Read License](LICENSE)
