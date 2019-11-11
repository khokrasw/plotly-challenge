
var ucounter=0;
var MData=null;
var SampData=null;

function buildMetadata(sample) {
  // console.log("Now I am @ buildMetadata");
  // console.log("Sample:", sample);
  url="/metadata/"+sample;
 
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then( function(mdata) {
    MData=mdata;
    console.log(MData);
   // Use d3 to select the panel with id of `#sample-metadata`  
   // Use `Object.entries` to add each key and value pair to the panel
   // Hint: Inside the loop, you will need to use d3 to append new
   // tags for each key-value in the metadata.

   var dpanl = d3.select("#sample-metadata");
   dpanl
    .html("");
    var CreateType="H4"
   var panl=document.getElementById("sample-metadata");
   var anitem = document.createElement(CreateType);
   anitem.innerText = "Age: "+MData.AGE;
   panl.appendChild(anitem);
   var anitem = document.createElement(CreateType);
   anitem.innerText = "Ethnicity: "+MData.ETHNICITY;
   panl.appendChild(anitem);
   var anitem = document.createElement(CreateType);
   anitem.innerText = "Gender: "+MData.GENDER;
   panl.appendChild(anitem);
   var anitem = document.createElement(CreateType);
   anitem.innerText = "Location: "+MData.LOCATION;
   panl.appendChild(anitem);
   var anitem = document.createElement(CreateType);
   anitem.innerText = "SampleID: "+MData.sample;
   panl.appendChild(anitem);
   var anitem = document.createElement(CreateType);
   anitem.innerText = "Wash Freq: "+MData.WFREQ;
   panl.appendChild(anitem);

   buildGauge(MData.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  url="/samples/"+sample;
  d3.json(url).then( function(sampledata) {
    SampData=sampledata;
    //console.log(SampData);
    var otuids=SampData.otu_ids.slice(0, 10);
    var otulabels=SampData.otu_labels.slice(0, 10);
    var samplevalues=SampData.sample_values.slice(0, 10);
    // console.log(otuids);
    // console.log(otulabels);
    // console.log(samplevalues);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // // Part 5 - Working Pie Chart

    var trace1 = 
    {
      labels: otuids,
      values: samplevalues,
      type: 'pie'
    };

    var data = [trace1];
    var layout = 
    {
      title: "For Sample: "+sample ,
      hovertext: otulabels, 
      hoverinfo: 'text'                    //'label+percent+name',
    };

    Plotly.newPlot("pie", data, layout);

    // @TODO: Build a Bubble Chart using the sample data
    var bubbleColors = 
    ['rgb(56, 75, 126)', 'rgb(18, 36, 37)', 'rgb(34, 53, 101)', 'rgb(36, 55, 57)', 
     'rgb(6, 4, 4)', 'rgb(177, 127, 38)', 'rgb(205, 152, 36)', 'rgb(99, 79, 37)', 
     'rgb(12, 180, 179)', 'rgb(124, 10, 37)'
    ];
    
    var trace1 = 
    {
      x: otuids,
      y: samplevalues,
      text: otulabels,
      mode: 'markers',
      marker: {size: samplevalues,
               color: bubbleColors,
               sizemode: 'area',
               sizeref: 0.04
              }
    };
    
   
    var data = [trace1];
    
    var layout = 
    {
      showlegend: false,
      title: 
      {
        text:'Sample Values vs Otu IDs',
        font: {family: 'Courier New, monospace, bold', size: 24},
        xref: 'paper',
        x: 0.5,
      },
      xaxis: 
      {
        title: 
        {
          text: 'OTU ID',font: {family: 'Courier New, monospace',size: 18, color: '#7f7f7f'}
        }
      },
    };
    
    Plotly.newPlot('bubble', data, layout);
    
  });

    
}

function buildGauge(washfreq) {
    console.log(washfreq);

    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washfreq,
        title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs Per week" },
        type: "indicator",
        mode: "gauge+number",
        delta: { reference: 10 },
        gauge: { axis: { range: [null, 10] } }
      }
    ];
    
    var layout = { width: 600, height: 400 };
      
    Plotly.newPlot("gauge", data, layout);
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  ucounter=ucounter+1;
  console.log("This Sample is: "+newSample+"  Counter: "+ucounter);

  // Fetch new data each time a new sample is selected
  //document.write(newSample);
  buildCharts(newSample);
  buildMetadata(newSample);
}


// Initialize the dashboard
init();
