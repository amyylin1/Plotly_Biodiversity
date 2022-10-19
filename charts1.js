function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}



// ---------------------------------------------------------------------------
//
//                       Dev. 1 Horizontal Bar Chart
//
// ---------------------------------------------------------------------------

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
      console.log("samples array", samples);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(sampleObj => sampleObj.id == sample);
      console.log("filteredSamples", filteredSamples);
    // Dev. 3 - 1:  
    var metadata = data.metadata;
    var metadataFiltered = metadata.filter(sampleObj => sampleObj.id == sample);

    //var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //var result = resultArray[0];
    //  5. Create a variable that holds the first sample in the array.
    var result = filteredSamples[0];
      console.log("first variable", result);


    // DEV. 3-2:  Create a varaible that holds the 1st sample in the metadata array.
    var metaresults = metadataFiltered[0];


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var metaPanel = d3.select('#sample-metadata');
      console.log(metaPanel);

    var otu_ids = result.otu_ids;
      console.log("otu_ids", otu_ids);

    var otu_labels = result.otu_labels;
      console.log("otu_labels", otu_labels);

    var sample_values = result.sample_values;
      console.log("sample_values", sample_values);


    // Dev 3 - 3: create a variable that holds the washing frequency.
    var washingFreq = metaresults.wfreq;
      console.log("Washing Frequency", washingFreq);
    

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 
    var sortedValues = sample_values.sort((a, b) => b - a);
      console.log("sample_values(descending order)", sortedValues);

    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_ids.slice(0, 10).reverse(),
        type: "bar",
        orientation: 'h',
      }
    ];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      width: 400, 
      height: 450,
      title: "Top 10 Bacteria Cultures Found",
      margin: {t: 30, l: 120},
      color: "green"
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


// ---------------------------------------------------------------------------
//
//                       Dev. 2:   Bubble Chart
//
// ---------------------------------------------------------------------------

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values, 
        text: otu_labels, 
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'area'
        }
      }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showLegend:  false,
      hovermode: 'closest',
      xaxis:  { title: 'OTU ID' } ,
      height: 600,
      width:  1100
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 



// ---------------------------------------------------------------------------
//
//                       Dev. 3:   Gauge Chart
//
// ---------------------------------------------------------------------------

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 10], y: [0, 1] },
      value:  washingFreq,
      title: { text: '<b>Belly Button Washing Frequency</b>  <br>Scrubs per Week</br>' }, 
      type: 'indicator', 
      mode: 'gauge+number', 
      gauge: { 
        axis: { range: [null, 10], tickwidth: 2, tickcolor: 'blue' },
        bar: { color: 'lightyellow' },
        steps: [
          { range: [0, 2], color: 'lightblue' },
          { range: [2, 4], color: 'dodgerblue' },
          { range: [4, 6], color: 'blue' },
          { range: [6, 8], color: 'darkblue' },
          { range: [8, 10], color: 'greenblue' }
        ],
        threshold: {
          value: washingFreq,
        }
      },

    }];

  

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width : 900, 
      height: 700, 
      margin: { t: 0, b: 0},
      font: {color: 'black'}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    console.log("washingFreq", washingFreq);
    Plotly.newPlot('gauge1', gaugeData, gaugeLayout);
  });
}
