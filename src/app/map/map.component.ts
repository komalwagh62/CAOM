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
    { value: 'VIJP/JAIPUR', label: 'VIJP/JAIPUR' },
    // { value: 'VOBG/Bengaluru (HAL)', label: 'VOBG/Bengaluru (HAL)' },
  ];
  optionsBengaluruKIARunway: { value: any; label: any; }[] = [
    // { value: 'RWY 09L', label: 'RWY 09L' },
    // { value: 'RWY 09R', label: 'RWY 09R' },
    // { value: 'RWY 27L', label: 'RWY 27L' },
    // { value: 'RWY 27R', label: 'RWY 27R' },
  ];

  optionsVIJPJAIPURRunway: { value: any; label: any; }[] = [
    // { value: 'RWY 09L', label: 'RWY 09L' },
    // { value: 'RWY 09R', label: 'RWY 09R' },
    // { value: 'RWY 27L', label: 'RWY 27L' },
    // { value: 'RWY 27R', label: 'RWY 27R' },
  ];
  optionsRWY_09LTypeofProcedure: { value: any; label: any; }[] = [
    // { value: 'SID', label: 'SID' },
    // { value: 'option2', label: 'Option 2' },
  ];
  optionsRWY_27RTypeofProcedure: { value: any; label: any; }[] = [
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

    const overlayMaps = {
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

  // updateLayers(): void {
  //   // Clear existing layers
  //   this.airportLayerGroup.clearLayers();

  //   const loadSIDProcedure = (procedureName: string, pointFileName: string, lineFileName: string) => {
  //     // Load Point_SID GeoJSON data
  //     fetch(pointFileName)
  //       .then(response => response.json())
  //       .then(data => {
  //         const stepIcon = L.icon({
  //           iconUrl: 'assets/AKTIM_7A/Fly-over.png',
  //           iconSize: [60, 50],
  //         });
  //         const geoJsonLayer = L.geoJSON(data, {
  //           pointToLayer: (feature, latlng) => {
  //             const marker = L.marker(latlng, { icon: stepIcon });
  //             marker.bindTooltip(`<b>${feature.properties.Name}</b><br>${feature.properties.Speed}<br>${feature.properties.Altitude}`, {
  //               permanent: true, direction: 'center', className: 'labelstyle'
  //             });
  //             return marker;
  //           }
  //         });
  //         this.airportLayerGroup.addLayer(geoJsonLayer);
  //         this.map.fitBounds(geoJsonLayer.getBounds());
  //       })
  //       .catch(error => {
  //         console.error('Error loading Point_SID GeoJSON:', error);
  //       });

  //     // Load Line_SID GeoJSON data
  //     fetch(lineFileName)
  //       .then(response => response.json())
  //       .then(data => {
  //         const geoJsonLayer = L.geoJSON(data, {
  //           style: {
  //             color: 'blue', // Set line color
  //             weight: 2 // Set line weight
  //           },
  //           onEachFeature: (feature, layer) => {
  //             if (feature.properties && feature.properties.Distance) {
  //               const customIcon = L.icon({
  //                 iconUrl: 'assets/AKTIM_7A/penta.png',
  //                 iconSize: [60, 60],
  //                 // rotationAngle: feature.properties.Bearing
  //               });
  //               // Get the coordinates of the line
  //               let coordinates: number[][] = [];
  //               if (feature.geometry.type === 'MultiLineString') {
  //                 coordinates = feature.geometry.coordinates[0]; // For MultiLineString, we choose the first line
  //               } else if (feature.geometry.type === 'LineString') {
  //                 coordinates = feature.geometry.coordinates;
  //               }

  //               // Calculate the center point of the line
  //               const center = coordinates.reduce((acc, curr) => [acc[0] + curr[0], acc[1] + curr[1]], [0, 0]);
  //               center[0] /= coordinates.length;
  //               center[1] /= coordinates.length;

  //               // Create a marker with custom icon at the center point
  //               const marker = L.marker(L.latLng(center[1], center[0]), { icon: customIcon, }).addTo(this.airportLayerGroup);
  //               // Rotate the marker icon using iconAngle option
  //               // const markerElement = marker.getElement();
  //               // if (markerElement) {
  //               //   markerElement.style.transform += ' rotate(' + feature.properties.Bearing + 'deg)';
  //               // }
  //               // Bind tooltip with distance to the marker
  //               marker.bindTooltip(`${feature.properties.Distance}`, {
  //                 permanent: true, direction: 'center', className: 'labelstyle', opacity: 1,
  //               });
  //             }
  //           }
  //         });
  //         this.airportLayerGroup.addLayer(geoJsonLayer);
  //       })
  //       .catch(error => {
  //         console.error('Error loading Line_SID GeoJSON:', error); // Log any errors
  //       });
  //   };
  //   //VOBL_RWY9L sid procedures
  //   if (this.selectedProcedureName.includes('AKTIM 7A')) {
  //     loadSIDProcedure('AKTIM 7A', 'assets/VOBL_RWY9L/SID/AKTIM7A/AKTIM7A_Point.geojson', 'assets/VOBL_RWY9L/SID/AKTIM7A/AKTIM7A_line.geojson');
  //   }

  //   if (this.selectedProcedureName.includes('ANIRO 7A')) {
  //     loadSIDProcedure('ANIRO 7A', 'assets/VOBL_RWY9L/SID/ANIRO7A/ANIRO7A_Point.geojson', 'assets/VOBL_RWY9L/SID/ANIRO7A/ANIRO7A_line.geojson');
  //   }

  //   if (this.selectedProcedureName.includes('GUNIM 7A')) {
  //     loadSIDProcedure('GUNIM 7A', 'assets/VOBL_RWY9L/SID/GUNIM7A/GUNIM7A_Point.geojson', 'assets/VOBL_RWY9L/SID/GUNIM7A/GUNIM7A_Line.geojson');
  //   }

  //   if (this.selectedProcedureName.includes('VAGPU 7A')) {
  //     loadSIDProcedure('VAGPU 7A', 'assets/VOBL_RWY9L/SID/VAGPU7A/VAGPU7A_Point.geojson', 'assets/VOBL_RWY9L/SID/VAGPU7A/VAGPU7A_Line.geojson');
  //   }

  //   if (this.selectedProcedureName.includes('GUNIM 7L')) {
  //     loadSIDProcedure('GUNIM 7L', 'assets/VOBL_RWY9L/SID/GUNIM7A/GUNIM7A_Point.geojson', 'assets/VOBL_RWY9L/SID/GUNIM7A/GUNIM7A_Line.geojson');
  //   }


  //   if (this.selectedProcedureName.includes('OPAMO 7A')) {
  //     loadSIDProcedure('OPAMO 7A', 'assets/VOBL_RWY9L/SID/OPAMO7A/OPAMO7A_Point.geojson', 'assets/VOBL_RWY9L/SID/OPAMO7A/OPAMO7A_Line.geojson');

  //   }
  //   if (this.selectedProcedureName.includes('PEXEG 7A')) {
  //     loadSIDProcedure('PEXEG 7A', 'assets/VOBL_RWY9L/SID/PEXEG7A/PEXEG7A_Point.geojson', 'assets/VOBL_RWY9L/SID/PEXEG7A/PEXEG7A_Line.geojson');

  //   }
  //   if (this.selectedProcedureName.includes('TULNA 7A')) {
  //     loadSIDProcedure('TULNA 7A', 'assets/VOBL_RWY9L/SID/TULNA7A/TULNA7A_Point.geojson', 'assets/VOBL_RWY9L/SID/TULNA7A/TULNA7A_Line.geojson');

  //   }
  //   if (this.selectedProcedureName.includes('VEMBO 7A')) {
  //     loadSIDProcedure('VEMBO 7A', 'assets/VOBL_RWY9L/SID/VEMBO7A/VEMBO7A_Point.geojson', 'assets/VOBL_RWY9L/SID/VEMBO7A/VEMBO7A_Line.geojson');

  //   }
  //   if (this.selectedProcedureName.includes('LATID 7A')) {
  //     loadSIDProcedure('LATID 7A', 'assets/VOBL_RWY9L/SID/LATID7A/LATID7A_Point.geojson', 'assets/VOBL_RWY9L/SID/LATID7A/LATID7A_Line.geojson');

  //   }
  //   if (this.selectedProcedureName.includes('SAI 7A')) {
  //     loadSIDProcedure('SAI 7A', 'assets/VOBL_RWY9L/SID/SAI7A/SAI7A_Point.geojson', 'assets/VOBL_RWY9L/SID/SAI7A/SAI7A_Line.geojson');

  //   }
  // }


  updateLayers(): void {
    // Clear existing layers
    this.airportLayerGroup.clearLayers();

    const loadSIDProcedure = async (procedureName: string, pointFileName: string, lineFileName: string) => {
      try {
        // Load Point_SID GeoJSON data
        const pointResponse = await fetch(pointFileName);
        const pointData = await pointResponse.json();

        const stepIcon = L.icon({
          iconUrl: 'assets/AKTIM_7A/Fly-over.png',
          iconSize: [60, 50],
        });

        const geoJsonLayer = L.geoJSON(pointData, {
          pointToLayer: (feature, latlng) => {
            const marker = L.marker(latlng, { icon: stepIcon });
            marker.bindTooltip(`<b>${feature.properties.Name}</b><br>${feature.properties.Speed}<br>${feature.properties.Altitude}`, {
              permanent: true,
              direction: 'center',
              className: 'labelstyle'
            });
            return marker;
          }
        });

        this.airportLayerGroup.addLayer(geoJsonLayer);
        this.map.fitBounds(geoJsonLayer.getBounds());

        // Load Line_SID GeoJSON data
        const lineResponse = await fetch(lineFileName);
        const lineData = await lineResponse.json();

        const lineGeoJsonLayer = L.geoJSON(lineData, {
          style: {
            color: 'blue', // Set line color
            weight: 2 // Set line weight
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.Distance) {
              const customIcon = L.icon({
                iconUrl: 'assets/AKTIM_7A/penta.png',
                iconSize: [60, 60],
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
              // Bind tooltip with distance to the marker
              marker.bindTooltip(`${feature.properties.Distance}`, {
                permanent: true,
                direction: 'center',
                className: 'labelstyle',
                opacity: 1,
              });
            }
          }
        });

        this.airportLayerGroup.addLayer(lineGeoJsonLayer);
      } catch (error) {
        console.error(`Error loading ${procedureName} SID procedure:`, error);
      }
    };

    // Mapping of procedure names to their respective file paths
    const proceduresMap: { [key: string]: [string, string] } = {
      //VOBL_RWY9L SID procedure
      'AKTIM 7A': ['assets/VOBL_RWY9L/SID/AKTIM7A/AKTIM7A_Point.geojson', 'assets/VOBL_RWY9L/SID/AKTIM7A/AKTIM7A_line.geojson'],
      'ANIRO 7A': ['assets/VOBL_RWY9L/SID/ANIRO7A/ANIRO7A_Point.geojson', 'assets/VOBL_RWY9L/SID/ANIRO7A/ANIRO7A_line.geojson'],
      'GUNIM 7A': ['assets/VOBL_RWY9L/SID/GUNIM7A/GUNIM7A_Point.geojson', 'assets/VOBL_RWY9L/SID/GUNIM7A/GUNIM7A_Line.geojson'],
      'VAGPU 7A': ['assets/VOBL_RWY9L/SID/VAGPU7A/VAGPU7A_Point.geojson', 'assets/VOBL_RWY9L/SID/VAGPU7A/VAGPU7A_Line.geojson'],
      'GUNIM 7L': ['assets/VOBL_RWY9L/SID/GUNIM7A/GUNIM7A_Point.geojson', 'assets/VOBL_RWY9L/SID/GUNIM7A/GUNIM7A_Line.geojson'],
      'OPAMO 7A': ['assets/VOBL_RWY9L/SID/OPAMO7A/OPAMO7A_Point.geojson', 'assets/VOBL_RWY9L/SID/OPAMO7A/OPAMO7A_Line.geojson'],
      'PEXEG 7A': ['assets/VOBL_RWY9L/SID/PEXEG7A/PEXEG7A_Point.geojson', 'assets/VOBL_RWY9L/SID/PEXEG7A/PEXEG7A_Line.geojson'],
      'TULNA 7A': ['assets/VOBL_RWY9L/SID/TULNA7A/TULNA7A_Point.geojson', 'assets/VOBL_RWY9L/SID/TULNA7A/TULNA7A_Line.geojson'],
      'VEMBO 7A': ['assets/VOBL_RWY9L/SID/VEMBO7A/VEMBO7A_Point.geojson', 'assets/VOBL_RWY9L/SID/VEMBO7A/VEMBO7A_Line.geojson'],
      'LATID 7A': ['assets/VOBL_RWY9L/SID/LATID7A/LATID7A_Point.geojson', 'assets/VOBL_RWY9L/SID/LATID7A/LATID7A_Line.geojson'],
      'SAI 7A': ['assets/VOBL_RWY9L/SID/SAI7A/SAI7A_Point.geojson', 'assets/VOBL_RWY9L/SID/SAI7A/SAI7A_Line.geojson'],
      //VOBL_RWY9L STAR procedure
      'GUNIM 7E': [
        'assets/VOBL_RWY9L/STAR/GUNIM7E/GUNIM7E_Point.geojson',
        'assets/VOBL_RWY9L/STAR/GUNIM7E/GUNIM7E_Line.geojson'
      ],
      'ADKAL 7E': [
        'assets/VOBL_RWY9L/STAR/ADKAL7E/ADKAL7E_Point.geojson',
        'assets/VOBL_RWY9L/STAR/ADKAL7E/ADKAL7E_Line.geojson'
      ],
      'LEKAP 7E': [
        'assets/VOBL_RWY9L/STAR/LEKAP7E/LEKAP7E_Point.geojson',
        'assets/VOBL_RWY9L/STAR/LEKAP7E/LEKAP7E_Line.geojson'
      ],
      'PEXEG 7E': [
        'assets/VOBL_RWY9L/STAR/PEXEG7E/PEXEG7E_Point.geojson',
        'assets/VOBL_RWY9L/STAR/PEXEG7E/PEXEG7E_Line.geojson'
      ],
      'RIKBU 7E': [
        'assets/VOBL_RWY9L/STAR/RIKBU7E/RIKBU7E_Point.geojson',
        'assets/VOBL_RWY9L/STAR/RIKBU7E/RIKBU7E_Line.geojson'
      ],
      'SUSIK 7E': [
        'assets/VOBL_RWY9L/STAR/SUSIK7E/SUSIK7E_Point.geojson',
        'assets/VOBL_RWY9L/STAR/SUSIK7E/SUSIK7E_Line.geojson'
      ],
      'SUSIK 7J': [
        'assets/VOBL_RWY9L/STAR/SUSIK7J/SUSIK7J_Point.geojson',
        'assets/VOBL_RWY9L/STAR/SUSIK7J/SUSIK7J_Line.geojson'
      ],
      'TELUV 7E': [
        'assets/VOBL_RWY9L/STAR/TELUV7E/TELUV7E_Point.geojson',
        'assets/VOBL_RWY9L/STAR/TELUV7E/TELUV7E_Line.geojson'
      ],
      'UGABA 7E': [
        'assets/VOBL_RWY9L/STAR/UGABA7E/UGABA7E_Point.geojson',
        'assets/VOBL_RWY9L/STAR/UGABA7E/UGABA7E_Line.geojson'
      ],
      'XIVIL 7E': [
        'assets/VOBL_RWY9L/STAR/XIVIL7E/XIVIL7E_Point.geojson',
        'assets/VOBL_RWY9L/STAR/XIVIL7E/XIVIL7E_Line.geojson'
      ],
      // VOBL_RWY9L APCH procedure
      'RNP': [
        'assets/VOBL_RWY9L/APCH/RNP/RNp_RWY_09L_Point.geojson',
        'assets/VOBL_RWY9L/APCH/RNP/RNp_RWY_09L_Line.geojson'
      ],

      // VOBL_RWY27R sid procedure
      'AKTIM 7B': [
        'assets/VOBL_RWY27R/SID27R_VOBL/AKTIM7B/AKTIM7B_Point.geojson',
        'assets/VOBL_RWY27R/SID27R_VOBL/AKTIM7B/AKTIM7B_Line.geojson'
      ],
      'ANIRO 7B': [
        'assets/VOBL_RWY27R/SID27R_VOBL/ANIRO7B/ANIRO7B_Point.geojson',
        'assets/VOBL_RWY27R/SID27R_VOBL/ANIRO7B/ANIRO7B_Line.geojson'
      ],
      'GUNIM 7B': [
        'assets/VOBL_RWY27R/SID27R_VOBL/GUNIM7B/GUNIM7B_Point.geojson',
        'assets/VOBL_RWY27R/SID27R_VOBL/GUNIM7B/GUNIM7B_Line.geojson'
      ],
      'GUNIM 7J': [
        'assets/VOBL_RWY27R/SID27R_VOBL/GUNIM7J/GUNIM7J_Point.geojson',
        'assets/VOBL_RWY27R/SID27R_VOBL/GUNIM7J/GUNIM7J_Line.geojson'
      ],
      'OPAMO 7B': [
        'assets/VOBL_RWY27R/SID27R_VOBL/OPAMO7B/OPAMO7B_Point.geojson',
        'assets/VOBL_RWY27R/SID27R_VOBL/OPAMO7B/OPAMO7B_Line.geojson'
      ],
      'SAI 7B': [
        'assets/VOBL_RWY27R/SID27R_VOBL/SAI7B/SAI7B_Point.geojson',
        'assets/VOBL_RWY27R/SID27R_VOBL/SAI7B/SAI7B_Line.geojson'
      ],
      'PEXEG 7B': [
        'assets/VOBL_RWY27R/SID27R_VOBL/PEXEG7B/PEXEG7B_Point.geojson',
        'assets/VOBL_RWY27R/SID27R_VOBL/PEXEG7B/PEXEG7B_Line.geojson'
      ],
      'TULNA 7B': [
        'assets/VOBL_RWY27R/SID27R_VOBL/TULNA7B/TULNA7B_Point.geojson',
        'assets/VOBL_RWY27R/SID27R_VOBL/TULNA7B/TULNA7B_Line.geojson'
      ],
      'VEMBO 7B': [
        'assets/VOBL_RWY27R/SID27R_VOBL/VEMBO7B/VEMBO7B_Point.geojson',
        'assets/VOBL_RWY27R/SID27R_VOBL/VEMBO7B/VEMBO7B_Line.geojson'
      ],
      'LATID 7B': [
        'assets/VOBL_RWY27R/SID27R_VOBL/LATID7B/LATID7B_Point.geojson',
        'assets/VOBL_RWY27R/SID27R_VOBL/LATID7B/LATID72_Line.geojson'
      ],
      'VEMBO 7S': [
        'assets/VOBL_RWY27R/SID27R_VOBL/VEMBO7S/VEMBO7S_Point.geojson',
        'assets/VOBL_RWY27R/SID27R_VOBL/VEMBO7S/VEMBO7S_Line.geojson'
      ],
      'ANIRO 7S': [
        'assets/VOBL_RWY27R/SID27R_VOBL/ANIRO7S/ANIRO7S_Point.geojson',
        'assets/VOBL_RWY27R/SID27R_VOBL/ANIRO7S/ANIRO7S_Line.geojson'
      ],
      'VAGPU 7B': [
        'assets/VOBL_RWY27R/SID27R_VOBL/VAGPU7B/VAGPU7B_Point.geojson',
        'assets/VOBL_RWY27R/SID27R_VOBL/VAGPU7B/VAGPU7B_Line.geojson'
      ],

      //VOBL_RWY27R star procedure
      'ADKAL 7F': [
        'assets/VOBL_RWY27R/STAR27R_VOBL/ADKAL7F/ADKAL7F_Point.geojson',
        'assets/VOBL_RWY27R/STAR27R_VOBL/ADKAL7F/ADKAL7F_Line.geojson'
      ],
      'GUNIM 7F': [
        'assets/VOBL_RWY27R/STAR27R_VOBL/GUNIM7F/GUNIM7F_Point.geojson',
        'assets/VOBL_RWY27R/STAR27R_VOBL/GUNIM7F/GUNIM7F_Line.geojson'
      ],
      'GUNIM 7N': [
        'assets/VOBL_RWY27R/STAR27R_VOBL/GUNIM7N/GUNIM7N_Point.geojson',
        'assets/VOBL_RWY27R/STAR27R_VOBL/GUNIM7N/GUNIM7N_Line.geojson'
      ],
      'LEKAP 7F': [
        'assets/VOBL_RWY27R/STAR27R_VOBL/LEKAP7F/LEKAP7F_Point.geojson',
        'assets/VOBL_RWY27R/STAR27R_VOBL/LEKAP7F/LEKAP7F_Line.geojson'
      ],
      'PEXEG 7F': [
        'assets/VOBL_RWY27R/STAR27R_VOBL/PEXEG7F/PEXEG7F_Point.geojson',
        'assets/VOBL_RWY27R/STAR27R_VOBL/PEXEG7F/PEXEG7F_Line.geojson'
      ],
      'PEXEG 7N': [
        'assets/VOBL_RWY27R/STAR27R_VOBL/PEXEG7N/PEXEG7N_Point.geojson',
        'assets/VOBL_RWY27R/STAR27R_VOBL/PEXEG7N/PEXEG7N_Line.geojson'
      ]
    };

    // Iterate over selected procedures and load them
    for (const procedureName in proceduresMap) {
      if (this.selectedProcedureName.includes(procedureName)) {
        const [pointFileName, lineFileName] = proceduresMap[procedureName];
        loadSIDProcedure(procedureName, pointFileName, lineFileName);
      }
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

  // watchAirportChanges(): void {
  //   this.Airform.get('selectedAirport')?.valueChanges.subscribe((selectedAirport: string[]) => {
  //     // Check if VOBL/Bengaluru (KIA) is selected
  //     if (selectedAirport.includes('VOBL/Bengaluru (KIA)')) {
  //       this.optionsBengaluruKIARunway = [
  //         { value: 'RWY 09L', label: 'RWY 09L' },
  //         { value: 'RWY 09R', label: 'RWY 09R' },
  //         { value: 'RWY 27L', label: 'RWY 27L' },
  //         { value: 'RWY 27R', label: 'RWY 27R' },
  //       ];
  //     } else {
  //       this.optionsBengaluruKIARunway = [];
  //     }
  //   });
  //   this.Airform.get('selectedRunway')?.valueChanges.subscribe((selectedRunway: string[]) => {
  //     // Check if RWY 09L is selected
  //     if (selectedRunway.includes('RWY 09L')) {
  //       this.optionsRWY_09LTypeofProcedure = [
  //         { value: 'SID', label: 'SID' },
  //         { value: 'STAR', label: 'STAR' },
  //         { value: 'APCH', label: 'APCH' },
  //         // Add other options here if needed
  //       ];
  //     } else {
  //       this.optionsRWY_09LTypeofProcedure = [];
  //     }
  //   });
  //   this.Airform.get('selectedTypeofProcedure')?.valueChanges.subscribe((selectedTypeofProcedure: string[]) => {
  //     // Check if SID is selected
  //     if (selectedTypeofProcedure.includes('SID')) {
  //       // Show optionsProcedureName
  //       this.optionsProcedureName = [
  //         { value: 'AKTIM 7A', label: 'AKTIM 7A' },
  //         { value: 'ANIRO 7A', label: 'ANIRO 7A' },
  //         { value: 'GUNIM 7A', label: 'GUNIM 7A' },
  //         { value: 'VAGPU 7A', label: 'VAGPU 7A' },
  //         { value: 'GUNIM 7L', label: 'GUNIM 7L' },
  //         { value: 'OPAMO 7A', label: 'OPAMO 7A' },
  //         { value: 'PEXEG 7A', label: 'PEXEG 7A' },
  //         { value: 'TULNA 7A', label: 'TULNA 7A' },
  //         { value: 'VEMBO 7A', label: 'VEMBO 7A' },
  //         { value: 'LATID 7A', label: 'LATID 7A' },
  //         { value: 'SAI 7A', label: 'SAI 7A' },
  //       ];
  //     } else if (selectedTypeofProcedure.includes('APCH')) {
  //       // Hide optionsProcedureName
  //       this.optionsProcedureName = [
  //       ];
  //     } else if (selectedTypeofProcedure.includes('STAR')) {
  //       // Show optionsProcedureName for STAR
  //       this.optionsProcedureName = [
  //         { value: 'ADKAL7E', label: 'ADKAL7E' },
  //         { value: 'GUNIM7E', label: 'GUNIM7E' },
  //         { value: 'LEKAP7E', label: 'LEKAP7E' },
  //         { value: 'PEXEG7E', label: 'PEXEG7E' },
  //         { value: 'RIKBU7E', label: 'RIKBU7E' },
  //         { value: 'SUSIK7E', label: 'SUSIK7E' },
  //         { value: 'SUSIK7J', label: 'SUSIK7J' },
  //         { value: 'TELUV7E', label: 'TELUV7E' },
  //         { value: 'UGABA7E', label: 'UGABA7E' },
  //         { value: 'XIVIL7E', label: 'XIVIL7E' },

  //         // Add other STAR options here if needed
  //       ];
  //     } else {
  //       // Hide optionsProcedureName if none of the types are selected
  //       this.optionsProcedureName = [];
  //     }
  //   });

  // }


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
      // Check if VIJP/JAIPUR is selected
      if (selectedAirport.includes('VIJP/JAIPUR')) {
        // Show options for VIJP/JAIPUR
        this.optionsVIJPJAIPURRunway = [
          { value: 'RWY 09', label: 'RWY 09' },
          { value: 'RWY 27', label: 'RWY 27' },
        ];
      } else {
        // Clear VIJP/JAIPUR options
        this.optionsVIJPJAIPURRunway = [];
      }
    });

    this.Airform.get('selectedRunway')?.valueChanges.subscribe((selectedRunway: string[]) => {
      // Check if RWY 09L is selected
      // Reset options for both runways
      this.optionsRWY_09LTypeofProcedure = [];
      this.optionsRWY_27RTypeofProcedure = [];

      // Check if RWY 09L or RWY 27R is selected
      if (selectedRunway.includes('RWY 09L') || selectedRunway.includes('RWY 27R') || selectedRunway.includes('RWY 09') || selectedRunway.includes('RWY 27')) {
        // Set options for SID, STAR, APCH
        this.optionsRWY_09LTypeofProcedure = [
          { value: 'SID', label: 'SID' },
          { value: 'STAR', label: 'STAR' },
          { value: 'APCH', label: 'APCH' },
          // Add other options here if needed
        ];
      }
    });

    this.Airform.get('selectedTypeofProcedure')?.valueChanges.subscribe((selectedTypeofProcedure: string[]) => {
      // Combine procedure names based on selected types
      let filteredOptions: { value: string, label: string }[] = [];
      if (this.Airform.get('selectedRunway')?.value.includes('RWY 09L')) {
        if (selectedTypeofProcedure.includes('SID')) {

          filteredOptions = filteredOptions.concat([
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
          ]);
        }
        if (selectedTypeofProcedure.includes('STAR')) {
          filteredOptions = filteredOptions.concat([
            { value: 'ADKAL 7E', label: 'ADKAL 7E' },
            { value: 'GUNIM 7E', label: 'GUNIM 7E' },
            { value: 'LEKAP 7E', label: 'LEKAP 7E' },
            { value: 'PEXEG 7E', label: 'PEXEG 7E' },
            { value: 'RIKBU 7E', label: 'RIKBU 7E' },
            { value: 'SUSIK 7E', label: 'SUSIK 7E' },
            { value: 'SUSIK 7J', label: 'SUSIK 7J' },
            { value: 'TELUV 7E', label: 'TELUV 7E' },
            { value: 'UGABA 7E', label: 'UGABA 7E' },
            { value: 'XIVIL 7E', label: 'XIVIL 7E' },
            // Add other STAR options here if needed
          ]);
        }
        if (selectedTypeofProcedure.includes('APCH')) {
          filteredOptions = filteredOptions.concat([
            { value: 'RNP', label: 'RNP' },

          ]);
        }
        this.optionsProcedureName = filteredOptions;
      }
      if (this.Airform.get('selectedRunway')?.value.includes('RWY 27R')) {
        if (selectedTypeofProcedure.includes('SID')) {

          filteredOptions = filteredOptions.concat([
            { value: 'AKTIM 7B', label: 'AKTIM 7B' },
            { value: 'ANIRO 7B', label: 'ANIRO 7B' },
            { value: 'GUNIM 7B', label: 'GUNIM 7B' },
            { value: 'GUNIM 7J', label: 'GUNIM 7J' },
            { value: 'OPAMO 7B', label: 'OPAMO 7B' },
            { value: 'SAI 7B', label: 'SAI 7B' },
            { value: 'PEXEG 7B', label: 'PEXEG 7B' },
            { value: 'TULNA 7B', label: 'TULNA 7B' },
            { value: 'VEMBO 7B', label: 'VEMBO 7B' },
            { value: 'LATID 7B', label: 'LATID 7B' },
            { value: 'VEMBO 7S', label: 'VEMBO 7S' },
            { value: 'ANIRO 7S', label: 'ANIRO 7S' },
            { value: 'VAGPU 7B', label: 'VAGPU 7B' },
          ]);
        }
        if (selectedTypeofProcedure.includes('STAR')) {
          filteredOptions = filteredOptions.concat([
            { value: 'ADKAL 7F', label: 'ADKAL 7F' },
            { value: 'GUNIM 7F', label: 'GUNIM 7F' },
            { value: 'GUNIM 7N', label: 'GUNIM 7N' },
            { value: 'LEKAP 7F', label: 'LEKAP 7F' },
            { value: 'PEXEG 7F', label: 'PEXEG 7F' },
            { value: 'PEXEG 7N', label: 'PEXEG 7N' },
            { value: 'RIKBU 7F', label: 'RIKBU 7F' },
            { value: 'SUSIK 7F', label: 'SUSIK 7F' },
            { value: 'SUSIK 7L', label: 'SUSIK 7L' },
            { value: 'TELUV 7F', label: 'TELUV 7F' },
            { value: 'UGABA 7F', label: 'UGABA 7F' },
            { value: 'XIVIL 7F', label: 'XIVIL 7F' },
            // Add other STAR options here if needed
          ]);
        }
        if (selectedTypeofProcedure.includes('APCH')) {
          filteredOptions = filteredOptions.concat([
            { value: 'RNP_Y', label: 'RNP_Y' },

          ]);
        }
        this.optionsProcedureName = filteredOptions;
      }
      if (this.Airform.get('selectedRunway')?.value.includes('RWY 09')) {
        if (selectedTypeofProcedure.includes('SID')) {

          filteredOptions = filteredOptions.concat([
            { value: 'UKASO 1D', label: 'UKASO 1D' },
            { value: 'UXENI 1D', label: 'UXENI 1D' },
            { value: 'GUDUM 1D', label: 'GUDUM 1D' },
            { value: 'NIKOT 1D', label: 'NIKOT 1D' },
            { value: 'IKAVA 1D', label: 'IKAVA 1D' },
            { value: 'INTIL 1D', label: 'INTIL 1D' },
            { value: 'LOVGA 1D', label: 'LOVGA 1D' },

          ]);
        }
        if (selectedTypeofProcedure.includes('STAR')) {
          filteredOptions = filteredOptions.concat([
            { value: 'IGOLU 1C', label: 'IGOLU 1C' },
            { value: 'LOVGA 1C', label: 'LOVGA 1C' },
            { value: 'BUBNU 1C', label: 'BUBNU 1C' },
            { value: 'RIDRA 1C', label: 'RIDRA 1C' },
            { value: 'INTIL 1C', label: 'INTIL 1C' },
            // Add other STAR options here if needed
          ]);
        }
        if (selectedTypeofProcedure.includes('APCH')) {
          filteredOptions = filteredOptions.concat([
            { value: 'RNP_Y_RWY_09', label: 'RNP_Y_RWY_09' },

          ]);
        }
        this.optionsProcedureName = filteredOptions;
      }
      if (this.Airform.get('selectedRunway')?.value.includes('RWY 27')) {
        if (selectedTypeofProcedure.includes('SID')) {

          filteredOptions = filteredOptions.concat([
            { value: 'UXENI 1B', label: 'UXENI 1B' },
            { value: 'IKAVA 1B', label: 'IKAVA 1B' },
            { value: 'INTIL 1B', label: 'INTIL 1B' },
            { value: 'UKASO 1B', label: 'UKASO 1B' },
            { value: 'LOVGA 1B', label: 'LOVGA 1B' },
            { value: 'GUDUM 1B', label: 'GUDUM 1B' },
            { value: 'NIKOT 1B', label: 'NIKOT 1B' },

          ]);
        }
        if (selectedTypeofProcedure.includes('STAR')) {
          filteredOptions = filteredOptions.concat([
            { value: 'IGOLU 1A', label: 'IGOLU 1A' },
            { value: 'LOVGA 1A', label: 'LOVGA 1A' },
            { value: 'INTIL 1A', label: 'INTIL 1A' },
            { value: 'RIDRA 1A', label: 'RIDRA 1A' },
            { value: 'BUBNU 1A', label: 'BUBNU 1A' },
            { value: 'UXENI 1A', label: 'UXENI 1A' },

            // Add other STAR options here if needed
          ]);
        }
        if (selectedTypeofProcedure.includes('APCH')) {
          filteredOptions = filteredOptions.concat([
            { value: 'RNP_Y_RWY27', label: 'RNP_Y_RWY27' },

          ]);
        }
        this.optionsProcedureName = filteredOptions;
      }
    });
  }

}