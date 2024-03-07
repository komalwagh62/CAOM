import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {


  Airform !: FormGroup;
  options: { value: any; label: any; }[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ];

  selectedOptions: string[] = [];
  selectedAirport: string[] = [];
  selectedRunway: string[] = [];
  selectedTypeofProcedure: string[] = [];
  selectedProcedureName: string[] = [];

  constructor(private formbuilder: FormBuilder,) { }


  optionsAirport: { value: any; label: any; }[] = [
    { value: 'VOBL/Bengaluru (KIA)', label: 'VOBL/Bengaluru (KIA)' },
    { value: 'VOBG/Bengaluru (HAL)', label: 'VOBG/Bengaluru (HAL)' },
  ];
  optionsRunway: { value: any; label: any; }[] = [
    // { value: 'RWY 09L', label: 'RWY 09L' },
    // { value: 'RWY 09R', label: 'RWY 09R' },
    // { value: 'RWY 27L', label: 'RWY 27L' },
    // { value: 'RWY 27R', label: 'RWY 27R' },
  ];
  optionsTypeofProcedure: { value: any; label: any; }[] = [
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
  citiesLayer!: L.LayerGroup;
  parksLayer!: L.LayerGroup;
  geojsonLayer!: L.LayerGroup;

  ngOnInit(): void {
    this.Airform = this.formbuilder.group({
      selectedOptions: [[]],
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
    const baseMaps = {
      'Streets': streets,
      'Satellite': satellite
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


    // Load the custom layer JSON
    fetch('assets/Height.geojsonl.json')
      .then(response => response.json())
      .then(geojsonData => {
        this.geojsonLayer = new L.GeoJSON(geojsonData)
      })

      

    // Define Layer Groups
    this.citiesLayer = L.layerGroup();
    this.parksLayer = L.layerGroup();
    this.geojsonLayer = L.layerGroup();

    // Add Layer Groups to the map
    this.citiesLayer.addTo(this.map);
    this.parksLayer.addTo(this.map);
    this.geojsonLayer.addTo(this.map);
  }

  updateMapLayers(): void {
    // Clear existing layers
    this.citiesLayer.clearLayers();
    this.parksLayer.clearLayers();
    this.geojsonLayer.clearLayers();

    // Add selected layers based on selectedOptions
    if (this.selectedProcedureName.includes('AKTIM 7A')) {
      const cityMarker = L.marker([19.0760, 72.8777]).bindPopup('This is Mumbai');
      this.citiesLayer.addLayer(cityMarker);
    }
    if (this.selectedProcedureName.includes('ANIRO 7A')) {
      const parkPolygon = L.polygon([
        [19.0760, 72.8777],
        [19.0805, 72.8645],
        [19.0644, 72.8825]
      ]).bindPopup('This is a park');
      this.parksLayer.addLayer(parkPolygon);
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
        this.optionsRunway = [
          { value: 'RWY 09L', label: 'RWY 09L' },
          { value: 'RWY 09R', label: 'RWY 09R' },
          { value: 'RWY 27L', label: 'RWY 27L' },
          { value: 'RWY 27R', label: 'RWY 27R' },
        ];
      } else {
        this.optionsRunway = [];
      }
    });
    this.Airform.get('selectedRunway')?.valueChanges.subscribe((selectedRunway: string[]) => {
      // Check if RWY 09L is selected
      if (selectedRunway.includes('RWY 09L')) {
        this.optionsTypeofProcedure = [
          { value: 'SID', label: 'SID' },
          // Add other options here if needed
        ];
      } else {
        this.optionsTypeofProcedure = [];
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
      } else {
        // Hide optionsProcedureName
        this.optionsProcedureName = [];
      }
    });

  }

}
