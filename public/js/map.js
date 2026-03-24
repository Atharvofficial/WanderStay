  // sets the access token, associating the map with your Mapbox account and its permissions
  mapboxgl.accessToken = mapToken;
  //   const finalCoords = coordinates || defaultCoords;

  // creates the map, setting the container to the id of the div you added in step 2, and setting the initial center and zoom level of the map
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      center: coordinates.length != 0 ? coordinates : [78.9629, 20.5937], // starting position [lng, lat]. Note that lat must be set between -90 and 90
      zoom: coordinates.length != 0 ? 9 : 3, // starting zoom
      show3dObjects: true,
      show3dBuildings: true,


  });

  new mapboxgl.Marker({color: "rgb(248, 67, 6)"})
      .setLngLat(coordinates.length != 0 ? coordinates : [78.9629, 20.5937])
      .setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h5>${listingLocation}</h5><p>Exact Location will be provided after booking</p>`))
      .addTo(map);

