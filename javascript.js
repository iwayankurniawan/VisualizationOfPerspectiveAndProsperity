var selectYear1=0;
var selectYear2=0;
var selectYear3=0;
var selectYear4=0;
var selectedCountry=[];

function trueGraph(){
var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var m = [60, 0, 10, 0],
        w = width - m[1] - m[3],
        h = height - m[0] - m[2];

    var svg = d3.select("#chart").append("svg").attr("id","graph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.ordinal().rangePoints([0, width], 1),
    y = {},
    dragging = {};

 var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground,
    highlighted;

var data;
var excluded_groups = [];
var totalData = 120;


d3.csv("Data1994.csv", function(error, cars) {

  // for (var i = 0; i < 30; i++) {
  //   $('<input>').attr('type','checkbox').attr("id",cars[i]["Country"]).appendTo('#Country');
  //   $('<label>').attr("for",cars[i]["Country"]).html(cars[i]["Country"]).appendTo('#Country');
  // }
  var selectedLineMain=[];
  data = cars.map(function(d) {
    if (d.Year == selectYear1){
      for (var j = 0; j < selectedCountry.length; j++) {
        if (d.Country==selectedCountry[j]) {
          selectedLineMain.push(d);
        }
      }
    }
    if (d.Year == selectYear2){
      for (var j = 0; j < selectedCountry.length; j++) {
        if (d.Country==selectedCountry[j]) {
          selectedLineMain.push(d);
        }
      }
    }
    if(d.Year == selectYear3){
      for (var j = 0; j < selectedCountry.length; j++) {
        if (d.Country==selectedCountry[j]) {
          selectedLineMain.push(d);
        }
      }
    }
    if(d.Year == selectYear4){
      for (var j = 0; j < selectedCountry.length; j++) {
        if (d.Country==selectedCountry[j]) {
          selectedLineMain.push(d);
        }
      }
    }
    for (var k in d) {
      if (!_.isNaN(cars[0][k] - 0) && k != 'id') {
        d[k] = parseFloat(d[k]) || 0;
      }
    };
    return d;
  });

  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
    return d != "Country"  &&  (y[d] = d3.scale.linear()
        .domain(d3.extent(cars, function(p) { return +p[d]; }))
        .range([height, 0]));
  }));


  // Add grey background lines for context.
  background = svg.append("g")
      .attr("class", "background")
      .selectAll("path")
      .data(selectedLineMain)
      .enter().append("path")
      .attr("d", path);

  // Add color foreground lines for focus.
  foreground = svg.append("g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(selectedLineMain)
      .enter().append("path")
      .attr("d", path)
      .attr("id", function(d) {return d.Country;})
      .attr("style",function(d) {return "stroke:"+d.colors+";";});

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .call(d3.behavior.drag()
        .origin(function(d) { return {x: x(d)}; })
        .on("dragstart", function(d) {
          dragging[d] = x(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function(d) {
          dragging[d] = Math.min(width, Math.max(0, d3.event.x));
          foreground.attr("d", path);
          dimensions.sort(function(a, b) { return position(a) - position(b); });
          x.domain(dimensions);
          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("dragend", function(d) {
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
          transition(foreground).attr("d", path);
          background
              .attr("d", path)
            .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);
        }));

  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .each(function(d) { if (d=="colors") {
      }else{d3.select(this).call(axis.scale(y[d]));} })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { if (d=="colors") {
      }else{return d;} });

  // Add and store a brush for each axis.
  g.append("g")
      .attr("class", "brush")
      .each(function(d) {
        d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
      })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);

      brush();
});

function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.


function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}


// Show List of country
function data_table(sample) {
  // sort by first column
  var sample = sample.sort(function(a,b) {
    var col = d3.keys(a)[0];
    return a[col] < b[col] ? -1 : 1;
  });

  var table = d3.select("#showCountry")
    .html("")
    .selectAll(".row1")
      .data(sample)
    .enter().append("div")
      .attr("id",function(d) { return d.Country; })
       .on("mouseover", highlight)
      .on("mouseout", unhighlight);

  table
    .append("span")
      .attr("class", "color-block")
      .style("background", function(d) {
        return d.colors;})

  var yearName;
  table
    .append("span")
      .text(function(d) {
        if (d.Year==1){
          yearName = "1994 - 1998";
        }
        if (d.Year==2){
          yearName = "1999 - 2004";
        }
        if (d.Year==3){
          yearName = "2005 - 2009";
        }
        if (d.Year==4){
          yearName = "2010 - 2014";
        }
        return d.Country +" "+ yearName; });
}


// Handles a brush event, toggling the display of foreground lines.
function brush() {
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });

  var selected = [];
  data
  .filter(function(d) {
    return !_.contains(excluded_groups, d.Country);
  })
  //Change year for list of country
  .map(function(d) {
  if (d.Year== selectYear1){
    for (var k = 0; k < selectedCountry.length; k++) {
    if (d.Country==selectedCountry[k]) {
      return actives.every(function(p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      }) ? selected.push(d) : null;
    }
  }
}
  if (d.Year== selectYear2){
    for (var k = 0; k < selectedCountry.length; k++) {
    if (d.Country==selectedCountry[k]) {
      return actives.every(function(p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      }) ? selected.push(d) : null;
    }
  }
  }
  if(d.Year== selectYear3){
    for (var k = 0; k < selectedCountry.length; k++) {
    if (d.Country==selectedCountry[k]) {
      return actives.every(function(p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      }) ? selected.push(d) : null;
    }
  }
  }
  if(d.Year== selectYear4){
    for (var k = 0; k < selectedCountry.length; k++) {
    if (d.Country==selectedCountry[k]) {
      return actives.every(function(p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      }) ? selected.push(d) : null;
    }
  }
  }
  });


  data_table(selected);

  foreground.style("display", function(d) {
    return actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    })
    ? null : "none";
  });
}

function highlight(d){
  var selectedLine = [];
  selectedLine.push(d.Country);
  d3.select(".foreground").style("opacity", "0.25");
  d3.selectAll(".row1").style("opacity", function(p) { return (d.Country == p) ? null : "0.3" });
   var lines = d3.svg.line();
  highlighted = svg.append("g")
      .attr("class", "highlighted")
      .selectAll("path")
      .data(selectedLine)
      .enter().append("path")
      .attr("d", lines(dimensions.map(function(p) { return [position(p), y[p](d[p])];})))
      .attr("id", d.Country)
      .attr("style","stroke:"+d.colors+";");
}

// Remove highlight
function unhighlight() {
  d3.select(".foreground").style("opacity", null);
  d3.selectAll(".row1").style("opacity", null);
  highlighted.remove();
}

function path(d) {
  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
}
}

//Controller
// trueGraph();
$("#Year").hide()
$("#Country").hide()
$("#countryList").hide()
$("#yearLabel").hide()
$("#countryLabel").hide()

var callGraph=function () {
  $("#Year").show()
  $("#Country").show()
  $("#countryList").show()
  $("#start").hide()
  $("#yearLabel").show()
  $("#countryLabel").show()
  $( "#Country" ).click(function(event){
    if (event.target.checked==true) {
      selectedCountry.push(event.target.id);
    }else{
      for (var l = 0; l < selectedCountry.length; l++) {
        if (selectedCountry[l]==event.target.id) {
          selectedCountry.splice(l, 1);
        }
      }
    }
  });
    if (document.getElementById("year1").checked){
      var x1 = document.getElementById("year1").value;
      selectYear1 = x1;
    }else {
      selectYear1 = 0;
    }
    if (document.getElementById("year2").checked){
      var x2 = document.getElementById("year2").value;
      selectYear2 = x2;
    }else {
      selectYear2 = 0;
    }
    if (document.getElementById("year3").checked){
      var x3 = document.getElementById("year3").value;
      selectYear3 = x3;
    }else {
      selectYear3 = 0;
    }
    if (document.getElementById("year4").checked){
      var x4 = document.getElementById("year4").value;
      selectYear4 = x4;
    }else {
      selectYear4 = 0;
    }
    $("#graph").remove();
    trueGraph();
  }
