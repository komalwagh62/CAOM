export interface Plane {
  icao_address: string;
  callsign: string;
  origin_country: string;
  time_position: string;
  last_contact: string;
  longitude: number;
  latitude: number;
  altitude_baro: number;
  on_ground: boolean;
  velocity: number;
  heading: number;
  vertical_rate: number;
  sensors: any;
  geo_altitude: number;
  squawk: string | null;
  spi: boolean;
  position_source: number;
}
