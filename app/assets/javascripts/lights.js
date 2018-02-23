  var map;
  var allMarkers = [];
  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
  var labelIndex = 0;


  function tooClose(thisMarker) {
    var returnVal;
    Object.keys(allMarkers).forEach(function (key) { 
      var marker = allMarkers[key];

      if(getDistance(thisMarker.position, marker.position) > 6.2){
        return false;
      } else {
        returnVal = true;
      }

    })
    return returnVal;

  }


  function deleteMarkerFromServer(id) {
    
    $.ajax({
      type: 'DELETE',
      url: '/lights/' + id,
      dataType: 'json',
      success: function(_data) {
        $("#json-table").tabulator("setData", "http://localhost:3000/lights" );

        if($('#selected_id')[0].text == id){
          $('.selected_light').html('');
        }
        return true
      }
    });
    
  }

  function updateMarkersFromServer(){
    jQuery.ajax({
      url : '/lights',
      dataType : 'json',
      success : function(response) {

        // loop through places and add markers
        for (p in response) {

          //create gmap latlng obj
          tmpLatLng = new google.maps.LatLng( response[p].latitude, response[p].longitude);

          // make and place map maker.
          var marker = new google.maps.Marker({
              label: response[p].alias.toString(),
              position: tmpLatLng,
              map: map
          });
          // Refactor this with duplicate code in Redraw
          marker.addListener('rightclick', function(e) {
              deleteMarkerFromServer(this.label)
              this.setMap(null)
          });

          marker.addListener('click', function(e) {
            // updateSelectedFromServer(this.label);
          });

          allMarkers[response[p].alias.toString()] = marker
        }


      }
    })
  }

  function updateSelectedFromServer(id) {
    jQuery.ajax({
      url : '/lights/' + id,
      dataType : 'script',
      type : 'GET',

      success : function(response){
      },
      error : function(err){
        alert("something went wrong");
      }
    });
  }

  function getDistance(p1, p2) {

    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat() - p1.lat());
    var dLong = rad(p2.lng() - p1.lng());
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  }

  function rad(x) {
    return x * Math.PI / 180;
  }

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.54596389579989, lng: -122.29019165039062},
      zoom: 15
    });


    var rowSelectFormatter = function(cell, formatterParams){
      var input = $("<input type='checkbox'>");
      var row = cell.getRow();

      input.change(function(){
        if(input.is(":checked")){
          $("#teachers-list").tabulator("selectRow", row);
        }else{
          $("#teachers-list").tabulator("deselectRow", row)
        }
        var selectedRows = $('#example-table').tabulator("getSelectedRows");
        selectedRowsIndex = [];
        for (var i=0; i < selectedRows.length; i++ ) {
          selectedRowsIndex.push(selectedRows[i].getIndex());
        }
        $('.input').html(selectedRowsIndex);
      });
      return input;
    }



    $("#json-table").tabulator({
      cellEdited:function(cell){
       $.ajax({
         url: "/lights/" + cell.cell.row.data.id,
         data: cell.getRow().getData(),
         type: "patch",
         success: function(response, textStatus, xhr){
         },
         error: function(XMLHttpRequest, textStatus, error){
         }
       })

      },
      ajaxSorting:true,
      ajaxFiltering:true, headerFilter:true,
      columns:[

        {title:"ID", field:"id", sortable:true, width:200},
        {title:"Status", field:"status", sortable:true, editor:"select", headerFilter:true, editorParams:{
            "broken":"Broken",
            "in_repair":"In Repair",
            "mia":"Missing",
            "working":"Functional",
        }},
        {title:"Alias", field:"alias", sortable:true, sorter:"alphanum", headerFilter:true, editor:"input"},
        {title:"Color", field:"color", sortable:true, editor:"select", headerFilter:true, editorParams:{
            "Wood":"Wood",
            "Steel":"Steel",
            "Other":"Other",
            "Painted":"Painted",
        }},
        {title:"Longitude", field:"longitude", sortable:true, sorter: "number" },
        {title:"Latitude", field:"latitude", sortable:true, sorter: "number" },
        {title:"Created", field:"created_at", sortable:true, sorter: "datetime" }
      ],
    });

    Tabulator.extendExtension("ajax", "defaultConfig", {
        type:"POST",
        contentType : "application/json; charset=utf-8"
    });

    updateMarkersFromServer();
    $("#json-table").tabulator("setData", "http://localhost:3000/lights" );





  function placeMarkerAndPanTo(latLng, map) {
    // Make a temporary marker without a label.
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });

    if(tooClose(marker) == true){
      marker.setMap(null)
    } else { 
      if(saveMarkerToServer(latLng, map, marker) == true) {
        // updateSelectedFromServer(marker.label);
        map.panTo(latLng);
      }
    }
  }

  function redrawMarker(marker, id) {
    marker.setMap(null);

    var newMarker = new google.maps.Marker({
      label: id,
      position: marker.position,
      map: map
    });

    allMarkers[id.toString()] = newMarker
    $("#json-table").tabulator("setData", "http://localhost:3000/lights" );

    map.panTo(newMarker.position);
    
    newMarker.addListener('rightclick', function(e) {
        deleteMarkerFromServer(this.label);
        this.setMap(null)
    });

    newMarker.addListener('click', function(e) {
      // updateSelectedFromServer(this.label, 'map');
    });
    

  }

  // Save a new marker
  function saveMarkerToServer(latLng, map, marker) {
    var lat = marker.position.lat;
    var lng = marker.position.lng;

    jQuery.ajax({
      url : '/lights',
      dataType : 'script',
      type : 'POST',
      data : {
        status : "None",
        color : "None",
        alias : "None",
        latitude : lat,
        longitude : lng
      },
      success : function(response){
        var id = $("#selected_id")[0].text
        redrawMarker(marker, id)
        console.log(response);
        return true;
      },
      error : function(err){
        // do error checking
        alert("something went wrong");
        console.error(err);
        return false;
      }
    });
  
  }



  map.addListener('click', function(e) {
      placeMarkerAndPanTo(e.latLng, map);
    });
  }
  // google.maps.LatLng.prototype.distanceFrom = function(newLatLng) {
  //     var lat1 = this.lat() * Math.PI / 180.0;
  //     var lat2 = newLatLng.lat() * Math.PI / 180.0;
  //     var lngDiff = (newLatLng.lng() - this.lng()) * Math.PI / 180.0;
  //     return Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1)  * Math.cos(lat2) * Math.cos(lngDiff)) * 20902231.0029;
  // };

