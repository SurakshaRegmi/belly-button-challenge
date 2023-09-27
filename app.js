function init() {
  let selector = d3.select("#selDataset");
  d3.json("samples.json").then((data)=> {
    console.log(data);
     let names = data.names;
     for (let i=0; i <names.length; i++) {
      selector.append("option").text(names[i]).property("value", names[i]);
     };
     
     let firstSubject = names[0];
     subtable(firstSubject);
     charts(firstSubject); 
  })
} 

function optionChanged(newsub){
  subtable(newsub);
  charts(newsub);

}

init ();



function subtable(sample) {
  d3.json("samples.json").then((data)=>{
    let metadata = data.metadata;
    let metaArray = metadata.filter(obj => obj.id == sample);
    let metaresult = metaArray[0];


    let table = d3.select("#sample-metadata");
    table.html("");

    for (key in metaresult){
      table.append("h6").text(`${key.toUpperCase()}: ${metaresult[key]}`);
    }
  }) 

}


function charts(sample) {
  d3.json("samples.json").then((data)=>{
    let metadata = data.metadata;
    let metaArray = metadata.filter(obj => obj.id == sample);
    let metaresult = metaArray[0];
    let wash = metaresult.wfreq;


    let samples = data.samples;
    let samplesArray = samples.filter(obj => obj.id == sample);
    let samplesresult = samplesArray[0];
    let sample_values = samplesresult.sample_values;
    let otu_ids = samplesresult.otu_ids;
    let otu_labels = samplesresult.otu_labels;
    let yticks = otu_ids.slice(0, 10).map(obj => `OTU ${obj}`).reverse();



    // bar

    var data = [{
      type: 'bar',
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: otu_labels.slice(0,10).reverse(),
      orientation: 'h'
    }];
    
    var layout = {
      title: "Top Ten OTUs Found In Individual.",
      xaxis: {
        title: "Bacteria Amounts"
      },
      margin: {
        t:30, b:30, l:150
      }
    }

    Plotly.newPlot('bar', data, layout);
    

    // bubble
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      text: otu_labels,
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Blues"
      }
    };
    
    var data = [trace1];
    
    var layout = {
      title: 'Total Bacteria Per Culture',
      xaxis: {
        title: "OTU IDS"
      },
      margin: {
        t:60, b:30
      }
    
    };
    
    Plotly.newPlot('bubble', data, layout);
    
    // gauge
    var data = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: wash,
        title: { text: "Belly Button Washing Frequency ", font: { size: 24 } },
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "darkblue" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "#eff3ff" },
            { range: [2, 4], color: "#bdd7e7" },
            { range: [4, 6], color: "#6baed5" },
            { range: [6, 8], color: "#3182bd" },
            { range: [8, 10], color: "#08519c" }
          ],
          
        }
      }
    ];
    
    var layout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "black", family: "Arial" }
    };
    
    Plotly.newPlot('gauge', data, layout);
    

  })
}