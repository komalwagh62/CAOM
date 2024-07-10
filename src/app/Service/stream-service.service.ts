import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
interface PlaneData {
  timestamp: string;
  icao_address: string;
  longitude: string;
  latitude: string;
  altitude_baro: string;
  collection_type: 'satellite' | 'terrestrial';
  flight_number: string;
  callsign: string;
}

@Injectable({
  providedIn: 'root'
})
export class StreamServiceService {
  
  private extractJSON(string: string): any[] {
    const results = string.match(/\{(?:[^{}])*\}/g);
    return results ? results.map(res => JSON.parse(res)) : [];
  }

  listenToStream(): Observable<{ satellite: string[][], terrestrial: string[][] }> {
    return new Observable(observer => {
      fetch(
        `https://api.airsafe.spire.com/v2/targets/stream?compression=none`,
        {
          headers: {
            Authorization: `Bearer tHkcJG5CGq3VzgTjcApGNE5ZB0YNvE6b`,
          },
        }
      )
        .then(async (response) => {
          if (response.status === 401) {
            alert("Unauthorized");
            observer.error('Unauthorized');
            return;
          }

          const stream = response.body?.getReader();
          if (!stream) {
            observer.error('Stream not available');
            return;
          }

          const currentData = {
            satellite: [["", "", "", "", "", "", "", ""]],
            terrestrial: [["", "", "", "", "", "", "", ""]],
          };

          while (true) {
            const { value, done } = await stream.read() as { value: Uint8Array; done: boolean; };
            if (done) {
              break;
            }
            try {
              this.extractJSON(new TextDecoder("utf-8").decode(value)).forEach(
                (parsed: PlaneData) => {
                  if (parsed.icao_address) {
                    const elem = parsed;
                    const index = currentData[elem.collection_type].findIndex(
                      (item) => item[1] === elem.icao_address
                    );
                    const newElem = [
                      elem.timestamp || "",
                      elem.icao_address || "",
                      elem.longitude || "",
                      elem.latitude || "",
                      elem.altitude_baro || "",
                      elem.collection_type || "",
                      elem.flight_number || "",
                      elem.callsign || "",
                    ];
                    if (index >= 0) {
                      currentData[elem.collection_type][index] = newElem;
                    } else {
                      currentData[elem.collection_type].push(newElem);
                    }
                  }
                }
              );

              observer.next(currentData);
            } catch (e) {
              observer.error('An error occurred while parsing stream results');
            }
          }
        })
        .catch((e) => {
          observer.error('An error occurred while calling the endpoint');
        });
    });
  }
}
