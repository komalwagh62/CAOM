import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {


  Airform !: FormGroup;


  selectedAirport: string[] = [];
  selectedRunway: string[] = [];
  selectedTypeofProcedure: string[] = [];
  selectedProcedureName: string[] = [];

  constructor(private formbuilder: FormBuilder,) { }


  optionsAirport: { value: any; label: any; }[] = [
    { value: 'VOBL/Bengaluru (KIA)', label: 'VOBL/Bengaluru (KIA)' },
    { value: 'VOBG/Bengaluru (HAL)', label: 'VOBG/Bengaluru (HAL)' },
  ];
  optionsBengaluruKIARunway: { value: any; label: any; }[] = [
    // { value: 'RWY 09L', label: 'RWY 09L' },
    // { value: 'RWY 09R', label: 'RWY 09R' },
    // { value: 'RWY 27L', label: 'RWY 27L' },
    // { value: 'RWY 27R', label: 'RWY 27R' },
  ];
  optionsRWY_09LTypeofProcedure: { value: any; label: any; }[] = [
    // { value: 'SID', label: 'SID' },
    // { value: 'option2', label: 'Option 2' },
  ];
  optionsProcedureName: { value: any; label: any; }[] = [
    // { value: 'AKTIM 7A', label: 'AKTIM 7A' },
    // { value: 'ANIRO 7A', label: 'ANIRO 7A' },
    // { value: 'GUNIM 7A', label: 'GUNIM 7A' },
    // { value: 'VAGPU 7A', label: 'VAGPU 7A' },
    // { value: 'GUNIM 7L', label: 'GUNIM 7L' },
    // { value: 'OPAMO 7A', label: 'OPAMO 7A' },
    // { value: 'PEXEG 7A', label: 'PEXEG 7A' },
    // { value: 'TULNA 7A', label: 'TULNA 7A' },
    // { value: 'VEMBO 7A', label: 'VEMBO 7A' },
    // { value: 'LATID 7A', label: 'LATID 7A' },
    // { value: 'SAI 7A', label: 'SAI 7A' },
  ];


  map!: L.Map;
  airportLayerGroup!: L.LayerGroup;

  ngOnInit(): void {
    this.Airform = this.formbuilder.group({

      selectedAirport: [[]],
      selectedRunway: [[]],
      selectedTypeofProcedure: [[]],
      selectedProcedureName: [[]],
    });
    this.initMap();
    this.watchAirportChanges();
  }

  initMap(): void {
    this.map = L.map('map', { zoomControl: false, attributionControl: false }).setView([19.0760, 72.8777], 13,);
    const streets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(this.map);

    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {


    });
    const stadiamaps = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {


    });
    const baseMaps = {
      'Streets': streets,
      'Satellite': satellite,
      'stadiamaps': stadiamaps
    };

    // const layerGroup1 = L.layerGroup();
    // const layerGroup2 = L.layerGroup();

    const overlayMaps = {
      // 'Layer Group 1': layerGroup1,
      // 'Layer Group 2': layerGroup2
    };

    L.control.layers(baseMaps, overlayMaps).addTo(this.map);

    streets.addTo(this.map);
    // Add scale Control
    L.control.scale({ position: 'bottomright' }).addTo(this.map);
    // Add Zoom Control
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    // Customize the position of the attribution control
    // Initialize LayerGroup for airports
    this.airportLayerGroup = L.layerGroup().addTo(this.map);

  }
  updateLayers(): void {
    // Clear existing layers
    this.airportLayerGroup.clearLayers();
    // Add GeoJSON layers based on form control selections
    // if (this.selectedProcedureName.includes('AKTIM 7A')) {
    //   // Load Point_SID GeoJSON data
    //   fetch('assets/AKTIM_7A/Point_SID.geojson')
    //     .then(response => response.json())
    //     .then(data => {
    //       const stepIcon = L.icon({
    //         iconUrl: 'assets/AKTIM_7A/Fly-over.png',
    //         iconSize: [60, 50],
    //       });
    //       const geoJsonLayer = L.geoJSON(data, {
    //         pointToLayer: (feature, latlng) => {
    //           const marker = L.marker(latlng, { icon: stepIcon });
    //           marker.bindTooltip(`<b>${feature.properties.Name}</b><br>${feature.properties.Speed}<br>${feature.properties.Altitude}`, {
    //             permanent: true, direction: 'center', className: 'labelstyle'
    //           });
    //           return marker;
    //         }
    //       });
    //       this.airportLayerGroup.addLayer(geoJsonLayer);
    //       this.map.fitBounds(geoJsonLayer.getBounds());
    //     })
    //     .catch(error => {
    //       console.error('Error loading Point_SID GeoJSON:', error);
    //     });

    //   // Load Line_SID GeoJSON data
    //   fetch('assets/AKTIM_7A/Line_SID.geojson')
    //     .then(response => response.json())
    //     .then(data => {
    //       const geoJsonLayer = L.geoJSON(data, {
    //         style: {
    //           color: 'blue', // Set line color
    //           weight: 2 // Set line weight
    //         },
    //         onEachFeature: (feature, layer) => {
    //           if (feature.properties && feature.properties.Distance) {

    //             const distance = feature.properties.Distance;
    //             // const bearing = feature.properties.Bearing;

    //             // Check the geometry type
    //             if (feature.geometry.type === 'MultiLineString') {
    //               const coordinates = feature.geometry.coordinates;
    //               coordinates.forEach(coords => {
    //                 const polyline = L.polyline(coords.map(coord => [coord[1], coord[0]])).addTo(this.airportLayerGroup);

    //                 // Bind tooltip with distance and bearing to the polyline
    //                 polyline.bindTooltip(`${distance}`, {
    //                   permanent: true,
    //                   direction: 'top',
    //                   className: 'labelstyle',
    //                   opacity: 1,
    //                 });
    //               });
    //             }
    //           }
    //         }
    //       });
    //       this.airportLayerGroup.addLayer(geoJsonLayer);
    //     })
    //     .catch(error => {
    //       console.error('Error loading Line_SID GeoJSON:', error); // Log any errors
    //     });
    // }

    if (this.selectedProcedureName.includes('AKTIM 7A')) {
      // Load Point_SID GeoJSON data
      fetch('assets/VOBL_RWY9L/SID/AKTIM7A/AKTIM7A_Point.geojson')
        .then(response => response.json())
        .then(data => {
          const stepIcon = L.icon({
            iconUrl: 'assets/AKTIM_7A/Fly-over.png',
            iconSize: [60, 50],
          });
          const geoJsonLayer = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
              const marker = L.marker(latlng, { icon: stepIcon });
              marker.bindTooltip(`<b>${feature.properties.Name}</b><br>${feature.properties.Speed}<br>${feature.properties.Altitude}`, {
                permanent: true, direction: 'center', className: 'labelstyle'
              });
              return marker;
            }
          });
          this.airportLayerGroup.addLayer(geoJsonLayer);
          this.map.fitBounds(geoJsonLayer.getBounds());
        })
        .catch(error => {
          console.error('Error loading Point_SID GeoJSON:', error);
        });

      // Load Line_SID GeoJSON data
      fetch('assets/VOBL_RWY9L/SID/AKTIM7A/AKTIM7A_line.geojson')
        .then(response => response.json())
        .then(data => {
          const geoJsonLayer = L.geoJSON(data, {
            style: {
              color: 'blue', // Set line color
              weight: 2 // Set line weight
            },
            onEachFeature: (feature, layer) => {
              if (feature.properties && feature.properties.Distance) {
                const customIcon = L.icon({
                  iconUrl: 'assets/AKTIM_7A/penta.png',
                  iconSize: [60, 60],
                  // rotationAngle: feature.properties.Bearing
                });
                // Get the coordinates of the line
                let coordinates: number[][] = [];
                if (feature.geometry.type === 'MultiLineString') {
                  coordinates = feature.geometry.coordinates[0]; // For MultiLineString, we choose the first line
                } else if (feature.geometry.type === 'LineString') {
                  coordinates = feature.geometry.coordinates;
                }

                // Calculate the center point of the line
                const center = coordinates.reduce((acc, curr) => [acc[0] + curr[0], acc[1] + curr[1]], [0, 0]);
                center[0] /= coordinates.length;
                center[1] /= coordinates.length;

                // Create a marker with custom icon at the center point
                const marker = L.marker(L.latLng(center[1], center[0]), { icon: customIcon, }).addTo(this.airportLayerGroup);
                // Rotate the marker icon using iconAngle option
                // const markerElement = marker.getElement();
                // if (markerElement) {
                //   markerElement.style.transform += ' rotate(' + feature.properties.Bearing + 'deg)';
                // }
                // Bind tooltip with distance to the marker
                marker.bindTooltip(`${feature.properties.Distance}`, {
                  permanent: true, direction: 'center', className: 'labelstyle', opacity: 1,
                });
              }
            }
          });
          this.airportLayerGroup.addLayer(geoJsonLayer);
        })
        .catch(error => {
          console.error('Error loading Line_SID GeoJSON:', error); // Log any errors
        });
    } else if (this.selectedProcedureName.includes('ANIRO 7A')) {
      // Load Point_SID GeoJSON data
      fetch('assets/VOBL_RWY9L/SID/ANIRO7A/ANIRO7A_Point.geojson')
        .then(response => response.json())
        .then(data => {
          const stepIcon = L.icon({
            iconUrl: 'assets/AKTIM_7A/Fly-over.png',
            iconSize: [60, 50],
          });
          const geoJsonLayer = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
              const marker = L.marker(latlng, { icon: stepIcon });
              marker.bindTooltip(`<b>${feature.properties.Name}</b><br>${feature.properties.Speed}<br>${feature.properties.Altitude}`, {
                permanent: true, direction: 'center', className: 'labelstyle'
              });
              return marker;
            }
          });
          this.airportLayerGroup.addLayer(geoJsonLayer);
          this.map.fitBounds(geoJsonLayer.getBounds());
        })
        .catch(error => {
          console.error('Error loading Point_SID GeoJSON:', error);
        });

      // Load Line_SID GeoJSON data
      fetch('assets/VOBL_RWY9L/SID/ANIRO7A/ANIRO7A_line.geojson')
        .then(response => response.json())
        .then(data => {
          const geoJsonLayer = L.geoJSON(data, {
            style: {
              color: 'blue', // Set line color
              weight: 2 // Set line weight
            },
            onEachFeature: (feature, layer) => {
              if (feature.properties && feature.properties.Distance) {
                const customIcon = L.icon({
                  iconUrl: 'assets/AKTIM_7A/penta.png',
                  iconSize: [60, 60],
                  // rotationAngle: feature.properties.Bearing
                });
                // Get the coordinates of the line
                let coordinates: number[][] = [];
                if (feature.geometry.type === 'MultiLineString') {
                  coordinates = feature.geometry.coordinates[0]; // For MultiLineString, we choose the first line
                } else if (feature.geometry.type === 'LineString') {
                  coordinates = feature.geometry.coordinates;
                }

                // Calculate the center point of the line
                const center = coordinates.reduce((acc, curr) => [acc[0] + curr[0], acc[1] + curr[1]], [0, 0]);
                center[0] /= coordinates.length;
                center[1] /= coordinates.length;

                // Create a marker with custom icon at the center point
                const marker = L.marker(L.latLng(center[1], center[0]), { icon: customIcon, }).addTo(this.airportLayerGroup);
                // Rotate the marker icon using iconAngle option
                // const markerElement = marker.getElement();
                // if (markerElement) {
                //   markerElement.style.transform += ' rotate(' + feature.properties.Bearing + 'deg)';
                // }
                // Bind tooltip with distance to the marker
                marker.bindTooltip(`${feature.properties.Distance}`, {
                  permanent: true, direction: 'center', className: 'labelstyle', opacity: 1,
                });
              }
            }
          });
          this.airportLayerGroup.addLayer(geoJsonLayer);
        })
        .catch(error => {
          console.error('Error loading Line_SID GeoJSON:', error); // Log any errors
        });
    }else if (this.selectedProcedureName.includes('GUNIM 7A')) {
      // Load Point_SID GeoJSON data
      fetch('assets/VOBL_RWY9L/SID/GUNIM7A/GUNIM7A_Point.geojson')
        .then(response => response.json())
        .then(data => {
          const stepIcon = L.icon({
            iconUrl: 'assets/AKTIM_7A/Fly-over.png',
            iconSize: [60, 50],
          });
          const geoJsonLayer = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
              const marker = L.marker(latlng, { icon: stepIcon });
              marker.bindTooltip(`<b>${feature.properties.Name}</b><br>${feature.properties.Speed}<br>${feature.properties.Altitude}`, {
                permanent: true, direction: 'center', className: 'labelstyle'
              });
              return marker;
            }
          });
          this.airportLayerGroup.addLayer(geoJsonLayer);
          this.map.fitBounds(geoJsonLayer.getBounds());
        })
        .catch(error => {
          console.error('Error loading Point_SID GeoJSON:', error);
        });

      // Load Line_SID GeoJSON data
      fetch('assets/VOBL_RWY9L/SID/GUNIM7A/GUNIM7A_Line.geojson')
        .then(response => response.json())
        .then(data => {
          const geoJsonLayer = L.geoJSON(data, {
            style: {
              color: 'blue', // Set line color
              weight: 2 // Set line weight
            },
            onEachFeature: (feature, layer) => {
              if (feature.properties && feature.properties.Distance) {
                const customIcon = L.icon({
                  iconUrl: 'assets/AKTIM_7A/penta.png',
                  iconSize: [60, 60],
                  // rotationAngle: feature.properties.Bearing
                });
                // Get the coordinates of the line
                let coordinates: number[][] = [];
                if (feature.geometry.type === 'MultiLineString') {
                  coordinates = feature.geometry.coordinates[0]; // For MultiLineString, we choose the first line
                } else if (feature.geometry.type === 'LineString') {
                  coordinates = feature.geometry.coordinates;
                }

                // Calculate the center point of the line
                const center = coordinates.reduce((acc, curr) => [acc[0] + curr[0], acc[1] + curr[1]], [0, 0]);
                center[0] /= coordinates.length;
                center[1] /= coordinates.length;

                // Create a marker with custom icon at the center point
                const marker = L.marker(L.latLng(center[1], center[0]), { icon: customIcon, }).addTo(this.airportLayerGroup);
                // Rotate the marker icon using iconAngle option
                // const markerElement = marker.getElement();
                // if (markerElement) {
                //   markerElement.style.transform += ' rotate(' + feature.properties.Bearing + 'deg)';
                // }
                // Bind tooltip with distance to the marker
                marker.bindTooltip(`${feature.properties.Distance}`, {
                  permanent: true, direction: 'center', className: 'labelstyle', opacity: 1,
                });
              }
            }
          });
          this.airportLayerGroup.addLayer(geoJsonLayer);
        })
        .catch(error => {
          console.error('Error loading Line_SID GeoJSON:', error); // Log any errors
        });
    }else if (this.selectedProcedureName.includes('VAGPU 7A')) {
      // Load Point_SID GeoJSON data
      fetch('assets/VOBL_RWY9L/SID/VAGPU7A/VAGPU7A_Point.geojson')
        .then(response => response.json())
        .then(data => {
          const stepIcon = L.icon({
            iconUrl: 'assets/AKTIM_7A/Fly-over.png',
            iconSize: [60, 50],
          });
          const geoJsonLayer = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
              const marker = L.marker(latlng, { icon: stepIcon });
              marker.bindTooltip(`<b>${feature.properties.Name}</b><br>${feature.properties.Speed}<br>${feature.properties.Altitude}`, {
                permanent: true, direction: 'center', className: 'labelstyle'
              });
              return marker;
            }
          });
          this.airportLayerGroup.addLayer(geoJsonLayer);
          this.map.fitBounds(geoJsonLayer.getBounds());
        })
        .catch(error => {
          console.error('Error loading Point_SID GeoJSON:', error);
        });

      // Load Line_SID GeoJSON data
      fetch('assets/VOBL_RWY9L/SID/GUNIM7A/GUNIM7A_Line.geojson')
        .then(response => response.json())
        .then(data => {
          const geoJsonLayer = L.geoJSON(data, {
            style: {
              color: 'blue', // Set line color
              weight: 2 // Set line weight
            },
            onEachFeature: (feature, layer) => {
              if (feature.properties && feature.properties.Distance) {
                const customIcon = L.icon({
                  iconUrl: 'assets/AKTIM_7A/penta.png',
                  iconSize: [60, 60],
                  // rotationAngle: feature.properties.Bearing
                });
                // Get the coordinates of the line
                let coordinates: number[][] = [];
                if (feature.geometry.type === 'MultiLineString') {
                  coordinates = feature.geometry.coordinates[0]; // For MultiLineString, we choose the first line
                } else if (feature.geometry.type === 'LineString') {
                  coordinates = feature.geometry.coordinates;
                }

                // Calculate the center point of the line
                const center = coordinates.reduce((acc, curr) => [acc[0] + curr[0], acc[1] + curr[1]], [0, 0]);
                center[0] /= coordinates.length;
                center[1] /= coordinates.length;

                // Create a marker with custom icon at the center point
                const marker = L.marker(L.latLng(center[1], center[0]), { icon: customIcon, }).addTo(this.airportLayerGroup);
                // Rotate the marker icon using iconAngle option
                // const markerElement = marker.getElement();
                // if (markerElement) {
                //   markerElement.style.transform += ' rotate(' + feature.properties.Bearing + 'deg)';
                // }
                // Bind tooltip with distance to the marker
                marker.bindTooltip(`${feature.properties.Distance}`, {
                  permanent: true, direction: 'center', className: 'labelstyle', opacity: 1,
                });
              }
            }
          });
          this.airportLayerGroup.addLayer(geoJsonLayer);
        })
        .catch(error => {
          console.error('Error loading Line_SID GeoJSON:', error); // Log any errors
        });
    }else if (this.selectedProcedureName.includes('GUNIM 7L')) {
      // Load Point_SID GeoJSON data
      fetch('assets/VOBL_RWY9L/SID/GUNIM7L/GUNIM7L_Point.geojson')
        .then(response => response.json())
        .then(data => {
          const stepIcon = L.icon({
            iconUrl: 'assets/AKTIM_7A/Fly-over.png',
            iconSize: [60, 50],
          });
          const geoJsonLayer = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
              const marker = L.marker(latlng, { icon: stepIcon });
              marker.bindTooltip(`<b>${feature.properties.Name}</b><br>${feature.properties.Speed}<br>${feature.properties.Altitude}`, {
                permanent: true, direction: 'center', className: 'labelstyle'
              });
              return marker;
            }
          });
          this.airportLayerGroup.addLayer(geoJsonLayer);
          this.map.fitBounds(geoJsonLayer.getBounds());
        })
        .catch(error => {
          console.error('Error loading Point_SID GeoJSON:', error);
        });

      // Load Line_SID GeoJSON data
      fetch('assets/VOBL_RWY9L/SID/GUNIM7L/GUNIM7L_Line.geojson')
        .then(response => response.json())
        .then(data => {
          const geoJsonLayer = L.geoJSON(data, {
            style: {
              color: 'blue', // Set line color
              weight: 2 // Set line weight
            },
            onEachFeature: (feature, layer) => {
              if (feature.properties && feature.properties.Distance) {
                const customIcon = L.icon({
                  iconUrl: 'assets/AKTIM_7A/penta.png',
                  iconSize: [60, 60],
                  // rotationAngle: feature.properties.Bearing
                });
                // Get the coordinates of the line
                let coordinates: number[][] = [];
                if (feature.geometry.type === 'MultiLineString') {
                  coordinates = feature.geometry.coordinates[0]; // For MultiLineString, we choose the first line
                } else if (feature.geometry.type === 'LineString') {
                  coordinates = feature.geometry.coordinates;
                }

                // Calculate the center point of the line
                const center = coordinates.reduce((acc, curr) => [acc[0] + curr[0], acc[1] + curr[1]], [0, 0]);
                center[0] /= coordinates.length;
                center[1] /= coordinates.length;

                // Create a marker with custom icon at the center point
                const marker = L.marker(L.latLng(center[1], center[0]), { icon: customIcon, }).addTo(this.airportLayerGroup);
                // Rotate the marker icon using iconAngle option
                // const markerElement = marker.getElement();
                // if (markerElement) {
                //   markerElement.style.transform += ' rotate(' + feature.properties.Bearing + 'deg)';
                // }
                // Bind tooltip with distance to the marker
                marker.bindTooltip(`${feature.properties.Distance}`, {
                  permanent: true, direction: 'center', className: 'labelstyle', opacity: 1,
                });
              }
            }
          });
          this.airportLayerGroup.addLayer(geoJsonLayer);
        })
        .catch(error => {
          console.error('Error loading Line_SID GeoJSON:', error); // Log any errors
        });
    }else if (this.selectedProcedureName.includes('OPAMO 7A')) {
      // Load Point_SID GeoJSON data
      fetch('assets/VOBL_RWY9L/SID/OPAMO7A/OPAMO7A_Point.geojson')
        .then(response => response.json())
        .then(data => {
          const stepIcon = L.icon({
            iconUrl: 'assets/AKTIM_7A/Fly-over.png',
            iconSize: [60, 50],
          });
          const geoJsonLayer = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
              const marker = L.marker(latlng, { icon: stepIcon });
              marker.bindTooltip(`<b>${feature.properties.Name}</b><br>${feature.properties.Speed}<br>${feature.properties.Altitude}`, {
                permanent: true, direction: 'center', className: 'labelstyle'
              });
              return marker;
            }
          });
          this.airportLayerGroup.addLayer(geoJsonLayer);
          this.map.fitBounds(geoJsonLayer.getBounds());
        })
        .catch(error => {
          console.error('Error loading Point_SID GeoJSON:', error);
        });

      // Load Line_SID GeoJSON data
      fetch('assets/VOBL_RWY9L/SID/OPAMO7A/OPAMO7A_Line.geojson')
        .then(response => response.json())
        .then(data => {
          const geoJsonLayer = L.geoJSON(data, {
            style: {
              color: 'blue', // Set line color
              weight: 2 // Set line weight
            },
            onEachFeature: (feature, layer) => {
              if (feature.properties && feature.properties.Distance) {
                const customIcon = L.icon({
                  iconUrl: 'assets/AKTIM_7A/penta.png',
                  iconSize: [60, 60],
                  // rotationAngle: feature.properties.Bearing
                });
                // Get the coordinates of the line
                let coordinates: number[][] = [];
                if (feature.geometry.type === 'MultiLineString') {
                  coordinates = feature.geometry.coordinates[0]; // For MultiLineString, we choose the first line
                } else if (feature.geometry.type === 'LineString') {
                  coordinates = feature.geometry.coordinates;
                }

                // Calculate the center point of the line
                const center = coordinates.reduce((acc, curr) => [acc[0] + curr[0], acc[1] + curr[1]], [0, 0]);
                center[0] /= coordinates.length;
                center[1] /= coordinates.length;

                // Create a marker with custom icon at the center point
                const marker = L.marker(L.latLng(center[1], center[0]), { icon: customIcon, }).addTo(this.airportLayerGroup);
                // Rotate the marker icon using iconAngle option
                // const markerElement = marker.getElement();
                // if (markerElement) {
                //   markerElement.style.transform += ' rotate(' + feature.properties.Bearing + 'deg)';
                // }
                // Bind tooltip with distance to the marker
                marker.bindTooltip(`${feature.properties.Distance}`, {
                  permanent: true, direction: 'center', className: 'labelstyle', opacity: 1,
                });
              }
            }
          });
          this.airportLayerGroup.addLayer(geoJsonLayer);
        })
        .catch(error => {
          console.error('Error loading Line_SID GeoJSON:', error); // Log any errors
        });
    }
  }


  getLiveLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Add marker for live location
        const marker = L.marker([latitude, longitude]).addTo(this.map);
        marker.bindPopup('Your Live Location').openPopup();

        // Pan the map to the live location
        this.map.panTo([latitude, longitude]);
      }, (error) => {
        console.error('Error getting live location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  watchAirportChanges(): void {
    this.Airform.get('selectedAirport')?.valueChanges.subscribe((selectedAirport: string[]) => {
      // Check if VOBL/Bengaluru (KIA) is selected
      if (selectedAirport.includes('VOBL/Bengaluru (KIA)')) {
        this.optionsBengaluruKIARunway = [
          { value: 'RWY 09L', label: 'RWY 09L' },
          { value: 'RWY 09R', label: 'RWY 09R' },
          { value: 'RWY 27L', label: 'RWY 27L' },
          { value: 'RWY 27R', label: 'RWY 27R' },
        ];
      } else {
        this.optionsBengaluruKIARunway = [];
      }
    });
    this.Airform.get('selectedRunway')?.valueChanges.subscribe((selectedRunway: string[]) => {
      // Check if RWY 09L is selected
      if (selectedRunway.includes('RWY 09L')) {
        this.optionsRWY_09LTypeofProcedure = [
          { value: 'SID', label: 'SID' },
          { value: 'STAR', label: 'STAR' },
          { value: 'APCH', label: 'APCH' },
          // Add other options here if needed
        ];
      } else {
        this.optionsRWY_09LTypeofProcedure = [];
      }
    });
    this.Airform.get('selectedTypeofProcedure')?.valueChanges.subscribe((selectedTypeofProcedure: string[]) => {
      // Check if SID is selected
      if (selectedTypeofProcedure.includes('SID')) {
        // Show optionsProcedureName
        this.optionsProcedureName = [
          { value: 'AKTIM 7A', label: 'AKTIM 7A' },
          { value: 'ANIRO 7A', label: 'ANIRO 7A' },
          { value: 'GUNIM 7A', label: 'GUNIM 7A' },
          { value: 'VAGPU 7A', label: 'VAGPU 7A' },
          { value: 'GUNIM 7L', label: 'GUNIM 7L' },
          { value: 'OPAMO 7A', label: 'OPAMO 7A' },
          { value: 'PEXEG 7A', label: 'PEXEG 7A' },
          { value: 'TULNA 7A', label: 'TULNA 7A' },
          { value: 'VEMBO 7A', label: 'VEMBO 7A' },
          { value: 'LATID 7A', label: 'LATID 7A' },
          { value: 'SAI 7A', label: 'SAI 7A' },
        ];
      } else if (selectedTypeofProcedure.includes('APCH')) {
        // Hide optionsProcedureName
        this.optionsProcedureName = [
        ];
      } else if (selectedTypeofProcedure.includes('STAR')) {
        // Show optionsProcedureName for STAR
        this.optionsProcedureName = [
          { value: 'ADKAL7E', label: 'ADKAL7E' },
          { value: 'GUNIM7E', label: 'GUNIM7E' },
          { value: 'LEKAP7E', label: 'LEKAP7E' },
          { value: 'PEXEG7E', label: 'PEXEG7E' },
          { value: 'RIKBU7E', label: 'RIKBU7E' },
          { value: 'SUSIK7E', label: 'SUSIK7E' },
          { value: 'SUSIK7J', label: 'SUSIK7J' },
          { value: 'TELUV7E', label: 'TELUV7E' },
          { value: 'UGABA7E', label: 'UGABA7E' },
          { value: 'XIVIL7E', label: 'XIVIL7E' },

          // Add other STAR options here if needed
        ];
      } else {
        // Hide optionsProcedureName if none of the types are selected
        this.optionsProcedureName = [];
      }
    });

  }

}
