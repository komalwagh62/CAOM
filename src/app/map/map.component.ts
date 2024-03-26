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
    { value: 'VEPY/PAKYONG', label: 'VEPY/PAKYONG' },
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
  optionsVEPYPAKYONGRunway: { value: any; label: any; }[] = [
    // { value: 'RWY 09L', label: 'RWY 09L' },
    // { value: 'RWY 09R', label: 'RWY 09R' },
    // { value: 'RWY 27L', label: 'RWY 27L' },
    // { value: 'RWY 27R', label: 'RWY 27R' },
  ];
  optionsRWY_09TypeofProcedure: { value: any; label: any; }[] = [
    // { value: 'SID', label: 'SID' },
    // { value: 'option2', label: 'Option 2' },
  ];
  optionsRWY_27TypeofProcedure: { value: any; label: any; }[] = [
    // { value: 'SID', label: 'SID' },
    // { value: 'option2', label: 'Option 2' },
  ];
  optionsRWY_02TypeofProcedure: { value: any; label: any; }[] = [
    // { value: 'SID', label: 'SID' },
    // { value: 'option2', label: 'Option 2' },
  ];
  optionsRWY_20TypeofProcedure: { value: any; label: any; }[] = [
    // { value: 'SID', label: 'SID' },
    // { value: 'option2', label: 'Option 2' },
  ];
  optionsRWY_09LTypeofProcedure: { value: any; label: any; }[] = [
    // { value: 'SID', label: 'SID' },
    // { value: 'option2', label: 'Option 2' },
  ];
  optionsVEPYTypeofProcedure: { value: any; label: any; }[] = [
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
              const marker = L.marker(L.latLng(center[1], center[0])).addTo(this.airportLayerGroup);
              // Bind popup with distance to the marker
              const distancePopup = `<b>Distance:</b> ${feature.properties.Distance} <br><b>Bearing:</b> ${feature.properties.Bearing}`;
              marker.bindPopup(distancePopup, {
                className: 'labelstyle'
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
      ],
      'RIKBU 7F': [
        'assets/VOBL_RWY27R/STAR27R_VOBL/RIKBU7F/RIKBU7F_Point.geojson',
        'assets/VOBL_RWY27R/STAR27R_VOBL/RIKBU7F/RIKBU7F_Line.geojson'
      ],
      'SUSIK 7F': [
        'assets/VOBL_RWY27R/STAR27R_VOBL/SUSIK7F/SUSIK7F_Point.geojson',
        'assets/VOBL_RWY27R/STAR27R_VOBL/SUSIK7F/SUSIK7F_Line.geojson'
      ],
      'SUSIK 7L': [
        'assets/VOBL_RWY27R/STAR27R_VOBL/SUSIK7L/SUSIK7L_Point.geojson',
        'assets/VOBL_RWY27R/STAR27R_VOBL/SUSIK7L/SUSIK7L_Line.geojson'
      ],
      'TELUV 7F': [
        'assets/VOBL_RWY27R/STAR27R_VOBL/TELUV7F/TELUV7F_Point.geojson',
        'assets/VOBL_RWY27R/STAR27R_VOBL/TELUV7F/TELUV7F_Line.geojson'
      ],
      'UGABA 7F': [
        'assets/VOBL_RWY27R/STAR27R_VOBL/UGABA7F/UGABA7F_Point.geojson',
        'assets/VOBL_RWY27R/STAR27R_VOBL/UGABA7F/UGABA7F_Line.geojson'
      ],
      'XIVIL 7F': [
        'assets/VOBL_RWY27R/STAR27R_VOBL/XIVIL7F/XIVIL7F_Point.geojson',
        'assets/VOBL_RWY27R/STAR27R_VOBL/XIVIL7F/XIVIL7F_Line.geojson'
      ],
      //VOBL_RWY27R APCh procedure
      'RNP_Y': [
        'assets/VOBL_RWY27R/APCH27R_VOBL/RNP_Y_RWY_27R_Point.geojson',
        'assets/VOBL_RWY27R/APCH27R_VOBL/RNP_Y_RWY_27R_Line.geojson'
      ],
      //VIJP_RWY09 sid procedures
      'UKASO 1D': [
        'assets/VIJP_RWY09/SID_RWY09/UKASO1D/UKASO1D_Point.geojson',
        'assets/VIJP_RWY09/SID_RWY09/UKASO1D/UKASO1D_Line.geojson'
      ],
      'UXENI 1D': [
        'assets/VIJP_RWY09/SID_RWY09/UXENI1D/UXENI1D_Point.geojson',
        'assets/VIJP_RWY09/SID_RWY09/UXENI1D/UXENI1D_Line.geojson'
      ],
      'GUDUM 1D': [
        'assets/VIJP_RWY09/SID_RWY09/GUDUM1D/GUDUM1D_1_Point.geojson',
        'assets/VIJP_RWY09/SID_RWY09/GUDUM1D/GUDUM1D_1_Line.geojson'
      ],
      'NIKOT 1D': [
        'assets/VIJP_RWY09/SID_RWY09/NIKOT1D/NIKOT1D_Point.geojson',
        'assets/VIJP_RWY09/SID_RWY09/NIKOT1D/NIKOT1D_Line.geojson'
      ],
      'IKAVA 1D': [
        'assets/VIJP_RWY09/SID_RWY09/IKAVA1D/IKAVA1D_Point.geojson',
        'assets/VIJP_RWY09/SID_RWY09/IKAVA1D/IKAVA1D_Line.geojson'
      ],
      'INTIL 1D': [
        'assets/VIJP_RWY09/SID_RWY09/INTIL1D/INTIL1D_Point.geojson',
        'assets/VIJP_RWY09/SID_RWY09/INTIL1D/INTIL1D_Line.geojson'
      ],
      'LOVGA 1D': [
        'assets/VIJP_RWY09/SID_RWY09/LOVGA1D/LOVGA1D_Point.geojson',
        'assets/VIJP_RWY09/SID_RWY09/LOVGA1D/LOVGA1D_Line.geojson'
      ],
      //VIJP_RWY09 Star procedures
      'IGOLU 1C': [
        'assets/VIJP_RWY09/STAR_RWO9/IGOLU1C/IGOLU1C_Point.geojson',
        'assets/VIJP_RWY09/STAR_RWO9/IGOLU1C/IGOLU1C_Line.geojson'
      ],
      'LOVGA 1C': [
        'assets/VIJP_RWY09/STAR_RWO9/LOVGA1C/LOVGA1C_Point.geojson',
        'assets/VIJP_RWY09/STAR_RWO9/LOVGA1C/LOVGA1C_Line.geojson'
      ],
      'BUBNU 1C': [
        'assets/VIJP_RWY09/STAR_RWO9/BUBNU1C/BUBNU1C_Point.geojson',
        'assets/VIJP_RWY09/STAR_RWO9/BUBNU1C/BUBNU1C_Line.geojson'
      ],
      'RIDRA 1C': [
        'assets/VIJP_RWY09/STAR_RWO9/RIDRA1C/RIDRA1C_Point.geojson',
        'assets/VIJP_RWY09/STAR_RWO9/RIDRA1C/RIDRA1C_Line.geojson'
      ],
      'INTIL 1C': [
        'assets/VIJP_RWY09/STAR_RWO9/INTILC/INTIL1C_Point.geojson',
        'assets/VIJP_RWY09/STAR_RWO9/INTILC/INTIL1C_Line.geojson'
      ],
      'UXENI 1C': [
        'assets/VIJP_RWY09/STAR_RWO9/UXENI1C/UXENI1C_Point.geojson',
        'assets/VIJP_RWY09/STAR_RWO9/UXENI1C/UXENI1C_Line.geojson'
      ],
      //VIJP_RWY09 APCH procedures
      'RNP_Y_RWY_09': [
        'assets/VIJP_RWY09/APCH_RW09/RNP_Y_RWY_09_Point.geojson',
        'assets/VIJP_RWY09/APCH_RW09/RNP_Y_RWY_09_Line.geojson'
      ],
      //VIJP_RWY27 SID procedures
      'GUDUM 1B': [
        'assets/VIJP_RWY27/SID_RWY27/GUDUM1B/GUDUM1B_Point.geojson',
        'assets/VIJP_RWY27/SID_RWY27/GUDUM1B/GUDUM1B_Line.geojson'
      ],
      'UXENI 1B': [
        'assets/VIJP_RWY27/SID_RWY27/UXENI1B/UXENI1B_Point.geojson',
        'assets/VIJP_RWY27/SID_RWY27/UXENI1B/UXENI1B_Line.geojson'
      ],
      'IKAVA 1B': [
        'assets/VIJP_RWY27/SID_RWY27/IKAVA1B/IKAVA1B_Point.geojson',
        'assets/VIJP_RWY27/SID_RWY27/IKAVA1B/IKAVA1B_Line.geojson'
      ],
      'INTIL 1B': [
        'assets/VIJP_RWY27/SID_RWY27/INTIL1B/INTIL1B_Point.geojson',
        'assets/VIJP_RWY27/SID_RWY27/INTIL1B/INTIL1B_Line.geojson'
      ],
      'UKASO 1B': [
        'assets/VIJP_RWY27/SID_RWY27/UKASO1B/UKASO1B_Point.geojson',
        'assets/VIJP_RWY27/SID_RWY27/UKASO1B/UKASO1B_Line.geojson'
      ],
      'LOVGA 1B': [
        'assets/VIJP_RWY27/SID_RWY27/LOVGA1B/LOVGA1B_Point.geojson',
        'assets/VIJP_RWY27/SID_RWY27/LOVGA1B/LOVGA1B_Line.geojson'
      ],
      'NIKOT 1B': [
        'assets/VIJP_RWY27/SID_RWY27/NIKOT1B/NIKOT1B_Point.geojson',
        'assets/VIJP_RWY27/SID_RWY27/NIKOT1B/NIKOT1B_Line.geojson'
      ],

      //VIJP_RWY27 STAR procedures
      'IGOLU 1A': [
        'assets/VIJP_RWY27/STAR_RWY27/IGOLU1A/IGOLU1A_Point.geojson',
        'assets/VIJP_RWY27/STAR_RWY27/IGOLU1A/IGOLU1A_Line.geojson'
      ],
      'LOVGA 1A': [
        'assets/VIJP_RWY27/STAR_RWY27/LOVGA1A/LOVGA1A_Point.geojson',
        'assets/VIJP_RWY27/STAR_RWY27/LOVGA1A/LOVGA1A_Line.geojson'
      ],
      'INTIL 1A': [
        'assets/VIJP_RWY27/STAR_RWY27/INTIL1A/INTIL1A_Point.geojson',
        'assets/VIJP_RWY27/STAR_RWY27/INTIL1A/INTIL1A_Line.geojson'
      ],
      'RIDRA 1A': [
        'assets/VIJP_RWY27/STAR_RWY27/RIDRA1A/RIDRA1A_Point.geojson',
        'assets/VIJP_RWY27/STAR_RWY27/RIDRA1A/RIDRA1A_Line.geojson'
      ],
      'BUBNU 1A': [
        'assets/VIJP_RWY27/STAR_RWY27/BUBNU1A/BUBNU1A_Point.geojson',
        'assets/VIJP_RWY27/STAR_RWY27/BUBNU1A/BUBNU1A_Line.geojson'
      ],
      'UXENI 1A': [
        'assets/VIJP_RWY27/STAR_RWY27/UXENI1A/UXENI1A_Point.geojson',
        'assets/VIJP_RWY27/STAR_RWY27/UXENI1A/UXENI1A_Line.geojson'
      ],
      //VIJP_RWY27 APCH procedures
      'RNP_Y_RWY27': [
        'assets/VIJP_RWY27/APCH_RW27/RNP_Y_RWY27_Point.geojson',
        'assets/VIJP_RWY27/APCH_RW27/RNP_Y_RWY27_Line.geojson'
      ],
      //VEPY_RWY02 APCH procedures
      'RNP_Y_RWY02': [
        'assets/VEPY/APCH_RWY02/RNP_Y_RWY02_Point.geojson',
        'assets/VEPY/APCH_RWY02/RNP_Y_RWY02_Line.geojson'
      ],
      //VEPY_RWY20 SID procedures
      'BGD1': [
        'assets/VEPY/SID_RWY20/BGD1_Departure/BGD1_Point.geojson',
        'assets/VEPY/SID_RWY20/BGD1_Departure/BGD1_Line.geojson'
      ],
      //VOBL_RWY09R SID procedures
      'AKTIM 7C': [
        'assets/VOBL_RWY09R/AKTIM7C/AKTIM7C_Point.geojson',
        'assets/VOBL_RWY09R/AKTIM7C/AKTIM7C_Line.geojson'
      ],
      'ANIRO 7C': [
        'assets/VOBL_RWY09R/ANIRO7C/ANIRO7C_Point.geojson',
        'assets/VOBL_RWY09R/ANIRO7C/ANIRO7C_Line.geojson'
      ],
      'GUNIM 7C': [
        'assets/VOBL_RWY09R/GUNIM7C/GUNIM7C_Point.geojson',
        'assets/VOBL_RWY09R/GUNIM7C/GUNIM7C_Line.geojson'
      ],
      'GUNIM 7M': [
        'assets/VOBL_RWY09R/GUNIM7M/GUNIM7M_Point.geojson',
        'assets/VOBL_RWY09R/GUNIM7M/GUNIM7M_Line.geojson'
      ],
      'LATID 7C': [
        'assets/VOBL_RWY09R/LATID7C/LATID7C_Point.geojson',
        'assets/VOBL_RWY09R/LATID7C/LATID7C_Line.geojson'
      ],
      'OPAMO 7C': [
        'assets/VOBL_RWY09R/OPAMO7C/OPAMO7C_Point.geojson',
        'assets/VOBL_RWY09R/OPAMO7C/OPAMO7C_Line.geojson'
      ],
      'PEXEG 7C': [
        'assets/VOBL_RWY09R/PEXEG7C/PEXEG7C_Point.geojson',
        'assets/VOBL_RWY09R/PEXEG7C/PEXEG7C_Line.geojson'
      ],
      'SAI 7C': [
        'assets/VOBL_RWY09R/SAI7C/SAI7C_Point.geojson',
        'assets/VOBL_RWY09R/SAI7C/SAI7C_Line.geojson'
      ],
      'TULNA 7C': [
        'assets/VOBL_RWY09R/TULNA7C/TULNA7C_Point.geojson',
        'assets/VOBL_RWY09R/TULNA7C/TULNA7C_Line.geojson'
      ],
      'VAGPU 7C': [
        'assets/VOBL_RWY09R/VAGPU7C/VAGPU7C_Point.geojson',
        'assets/VOBL_RWY09R/VAGPU7C/VAGPU7C_Line.geojson'
      ],
      'VEMBO 7C': [
        'assets/VOBL_RWY09R/VEMBO7C/VEMBO7C_Point.geojson',
        'assets/VOBL_RWY09R/VEMBO7C/VEMBO7C_Line.geojson'
      ],
        //VOBL_RWY09R APCH procedures
        'RNP_Y_RWY09R': [
          'assets/VOBL_RWY09R/VOBL_APCH09R/RNP_Y_RWY09R_Point.geojson',
          'assets/VOBL_RWY09R/VOBL_APCH09R/RNP_Y_RWY09R_Line.geojson'
        ],
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


  watchAirportChanges(): void {
    this.Airform.get('selectedAirport')?.valueChanges.subscribe((selectedAirport: string[]) => {
      this.optionsBengaluruKIARunway = [];
      this.optionsVIJPJAIPURRunway = [];
      this.optionsVEPYPAKYONGRunway = [];
      this.optionsRWY_09LTypeofProcedure = [];
      this.optionsVEPYTypeofProcedure = [];
      this.optionsRWY_27RTypeofProcedure = [];
      this.optionsProcedureName = [];

      // Check if VOBL/Bengaluru (KIA) is selected
      if (selectedAirport.includes('VOBL/Bengaluru (KIA)')) {
        this.optionsBengaluruKIARunway = [
          { value: 'RWY 09L', label: 'RWY 09L' },
          { value: 'RWY_9R', label: 'RWY 09R' },
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
          { value: 'RWY_09', label: 'RWY_09' },
          { value: 'RWY_27', label: 'RWY_27' },
        ];
      } else {
        // Clear VIJP/JAIPUR options
        this.optionsVIJPJAIPURRunway = [];
      }
      // Check if VEPY/PAKYONG is selected
      if (selectedAirport.includes('VEPY/PAKYONG')) {
        // Show options for VEPY/PAKYONG
        this.optionsVEPYPAKYONGRunway = [
          { value: 'RWY 02', label: 'RWY 02' },
          { value: 'RWY 20', label: 'RWY 20' },
        ];
      } else {
        // Clear VEPY/PAKYONG options
        this.optionsVEPYPAKYONGRunway = [];
      }
    });

    this.Airform.get('selectedRunway')?.valueChanges.subscribe((selectedRunway: string[]) => {
      // Check if RWY 09L is selected
      // Reset options for both runways
      this.optionsRWY_09LTypeofProcedure = [];
      this.optionsRWY_27RTypeofProcedure = [];
      this.optionsVEPYTypeofProcedure = [];
      // Check if RWY 09L or RWY 27R is selected
      if (selectedRunway.includes('RWY 09L') || selectedRunway.includes('RWY 27R') ||
        selectedRunway.includes('RWY_09') || selectedRunway.includes('RWY 02') ||
        selectedRunway.includes('RWY 20') || selectedRunway.includes('RWY_27') ||
        selectedRunway.includes('RWY_9R')) {
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
      if (this.Airform.get('selectedRunway')?.value.includes('RWY_09')) {
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
      if (this.Airform.get('selectedRunway')?.value.includes('RWY_27')) {
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
      if (this.Airform.get('selectedRunway')?.value.includes('RWY 20')) {
        if (selectedTypeofProcedure.includes('SID')) {

          filteredOptions = filteredOptions.concat([
            { value: 'BGD1', label: 'BGD1' },


          ]);
        }
        this.optionsProcedureName = filteredOptions;
      }
      if (this.Airform.get('selectedRunway')?.value.includes('RWY 02')) {

        if (selectedTypeofProcedure.includes('APCH')) {
          filteredOptions = filteredOptions.concat([
            { value: 'RNP_Y_RWY02', label: 'RNP_Y_RWY02' },

          ]);
        }
        this.optionsProcedureName = filteredOptions;
      }

      if (this.Airform.get('selectedRunway')?.value.includes('RWY_9R')) {
        if (selectedTypeofProcedure.includes('SID')) {

          filteredOptions = filteredOptions.concat([
            { value: 'AKTIM 7C', label: 'AKTIM 7C' },
            { value: 'ANIRO 7C', label: 'ANIRO 7C' },
            { value: 'GUNIM 7C', label: 'GUNIM 7C' },
            { value: 'GUNIM 7M', label: 'GUNIM 7M' },
            { value: 'LATID 7C', label: 'LATID 7C' },
            { value: 'OPAMO 7C', label: 'OPAMO 7C' },
            { value: 'PEXEG 7C', label: 'PEXEG 7C' },
            { value: 'SAI 7C', label: 'SAI 7C' },
            { value: 'TULNA 7C', label: 'TULNA 7C' },
            { value: 'VAGPU 7C', label: 'VAGPU 7C' },
            { value: 'VEMBO 7C', label: 'VEMBO 7C' },

          ]);
        }

        if (selectedTypeofProcedure.includes('APCH')) {
          filteredOptions = filteredOptions.concat([
            { value: 'RNP_Y_RWY09R', label: 'RNP_Y_RWY09R' },

          ]);
        }
        this.optionsProcedureName = filteredOptions;
      }
    });
  }
}