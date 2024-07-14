import { Component, OnInit } from '@angular/core';

declare var ol: any; // Declare OpenLayers globally

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.scss']
})
export class MapViewerComponent implements OnInit {
  trackMagnetic: string = '';
  airwayId: string = '';
  upperLimit: string = '';
  lowerLimit: string = '';
  mea: string = '';
  lateralLimits: string = '';
  map: any; // Define map globally
  vectorLayer: any; // Define vectorLayer globally
  conventionalAirwaysLayer: any; // Define layer for Conventional Airways
  popup: any; // Define popup globally
  filterPopupVisible: boolean = false; // Property to track visibility of filter popup
  menuOpen: boolean = false; // Property to track menu toggle

  constructor() { }

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    if (typeof ol === 'undefined') {
      console.error('OpenLayers library failed to load.');
      return;
    }

    this.map = new ol.Map({
      view: new ol.View({
        center: [0, 0],
        zoom: 2
      }),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      target: 'map'
    });

    // Initialize popup
    this.popup = new ol.Overlay({
      element: document.getElementById('popup'),
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    this.map.addOverlay(this.popup);

    // Add click event listener to the map for showing popup
    this.map.on('click', (event: any) => {
      this.displayFeatureInfo(event.coordinate);
    });
  }

  fetchGeoJSONData(url: string): Promise<any> {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        return null;
      });
  }

  addGeoJSONToMap(geojson: any): void {
    const vectorSource = new ol.source.Vector({
      features: new ol.format.GeoJSON().readFeatures(geojson, {
        featureProjection: 'EPSG:3857'
      })
    });
  
    // Remove existing vectorLayer from the map
    if (this.vectorLayer) {
      this.map.removeLayer(this.vectorLayer);
    }
  
    this.vectorLayer = new ol.layer.Vector({
      source: vectorSource
    });
  
    this.map.addLayer(this.vectorLayer);
  
    // Fit the map view to the extent of the GeoJSON data
    this.map.getView().fit(vectorSource.getExtent(), {
      padding: [50, 50, 50, 50],
      maxZoom: 15
    });
  }
  

  filterAndShowFeatures(type: string, trackMagnetic: string, airwayId: string, upperLimit: string, lowerLimit: string, mea: string, lateralLimits: string): void {
    const url = new URL('http://localhost:3002/data');
    const params: any = {};
  
    if (type) params.type = type;
    if (trackMagnetic) params.track_magnetic = trackMagnetic;
    if (airwayId) params.airway_id = airwayId;
    if (upperLimit) params.upper_limit = upperLimit;
    if (lowerLimit) params.lower_limit = lowerLimit;
    if (mea) params.mea = mea;
    if (lateralLimits) params.lateral_limits = lateralLimits;
  
    url.search = new URLSearchParams(params).toString();
  
    this.fetchGeoJSONData(url.toString()).then(data => {
      if (data && data.features) {
        // Filter GeoJSON data based on trackMagnetic and airwayId conditions
        data.features = data.features.filter((feature: any) => {
          let match = true;
  
          if (trackMagnetic && feature.properties.track_magnetic !== trackMagnetic) {
            match = false;
          }
  
          if (airwayId && feature.properties.airway_id !== airwayId) {
            match = false;
          }
          if (upperLimit && feature.properties.upper_limit !== upperLimit){
            match = false;
          }
  
          // Add other conditions like upperLimit, lowerLimit, etc. if needed
  
          return match;
        });
  
        // Add filtered GeoJSON data to the map
        this.addGeoJSONToMap(data);
      }
    });
  }
  
  

  displayFeatureInfo(coordinate: any): void {
    const feature = this.map.forEachFeatureAtPixel(this.map.getPixelFromCoordinate(coordinate), (feature: any) => {
      return feature;
    });

    if (feature) {
      const properties = feature.getProperties();
      const displayProperties = [
        'airway_id',
        'start_point',
        'end_point',
        'track_magnetic',
        'reverse_magnetic',
        'radial_distance',
        'upper_limit',
        'lower_limit',
        'airspace',
        'mea',
        'lateral_limits',
        'direction_of_cruising_levels',
        'type'
      ];

      let info = '<h3>Feature Info</h3>';
      displayProperties.forEach(prop => {
        if (properties.hasOwnProperty(prop)) {
          info += `<strong>${prop}:</strong> ${properties[prop]}<br>`;
        }
      });

      // Set popup content and position
      const popupContentElement = document.getElementById('popup-content');
      if (popupContentElement) {
        popupContentElement.innerHTML = info;
      }
      this.popup.setPosition(coordinate);
    } else {
      this.popup.setPosition(undefined); // Hide popup if no feature is clicked
    }
  }

  closeFilterPopup(event: Event): void {
    event.preventDefault();
    this.filterPopupVisible = false;
    this.menuOpen = false;
  }

  closePopup(event: Event): void {
    event.preventDefault(); // Prevent the default action
    this.popup.setPosition(undefined);
  }

  toggleFilterPopup(): void {
    this.filterPopupVisible = !this.filterPopupVisible;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    if (!this.menuOpen) {
      // Close the filter popup if menu is closed
      this.filterPopupVisible = false;
    }
  }

  toggleConventionalAirwaysLayer(): void {
    if (!this.conventionalAirwaysLayer) {
      // Fetch GeoJSON data only if the layer is not yet loaded
      this.fetchGeoJSONData('http://localhost:3002/data').then(data => {
        if (data) {
          this.addGeoJSONToMap(data);
          this.conventionalAirwaysLayer.setVisible(true); // Show layer
        }
      });
    } else {
      // Toggle visibility of the layer
      const isVisible = this.conventionalAirwaysLayer.getVisible();
      this.conventionalAirwaysLayer.setVisible(!isVisible);
    }
  }
}
