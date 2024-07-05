import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StreamServiceService } from 'src/app/Service/stream-service.service';
import { Target } from 'src/app/target';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {
  targets$!: Observable<Target[]>;
  constructor(private apiService: StreamServiceService, private cdr: ChangeDetectorRef) { }
  fetchResponse: any[] = [];
  rawResponse: string = '';
  ngOnInit(): void {
    this.targets$ = this.apiService.getStreamData();
    this.clickme()
  }

  // clickme() {
  //   const url = 'https://api.airsafe.spire.com/v2/targets/stream?compression=none';
  //   const textDecoder = new TextDecoder('utf-8');

  //   fetch(url, {
  //     headers: {
  //       Authorization: `Bearer tHkcJG5CGq3VzgTjcApGNE5ZB0YNvE6b`,
  //     },
  //   })
  //     .then((response) => {
  //       if (!response.body) {
  //         console.error('No response body');
  //         return;
  //       }

  //       const reader = response.body.getReader();
  //       let chunks = '';

  //       const read = () => {
  //         reader.read().then(({ done, value }) => {
  //           if (done) {
  //             this.fetchResponse = chunks;
  //             console.log('Final response:', this.fetchResponse);
  //             return;
  //           }

  //           chunks += textDecoder.decode(value, { stream: true });
  //           console.log('Current chunks:', chunks); // Debug log to see current chunks
  //           read();
  //         }).catch((error) => {
  //           console.error('Read error:', error);
  //         });
  //       };

  //       read();
  //     })
  //     .catch((error) => {
  //       console.error('Fetch error:', error);
  //     });
  // }



  clickme() {
    const url = 'https://api.airsafe.spire.com/v2/targets/stream?compression=none';
    const textDecoder = new TextDecoder('utf-8');

    fetch(url, {
      headers: {
        Authorization: `Bearer tHkcJG5CGq3VzgTjcApGNE5ZB0YNvE6b`,
      },
    })
      .then((response) => {
        if (!response.body) {
          console.error('No response body');
          return;
        }

        const reader = response.body.getReader();
        let chunks = '';

        const read = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              console.log('Complete chunk data:', chunks);
              this.rawResponse = chunks; // Store the raw JSON response
              try {
                // Split the chunks into individual JSON objects and parse them
                const parsedData = chunks.split('\n').filter(chunk => chunk.trim()).map(chunk => {
                  try {
                    return JSON.parse(chunk);
                  } catch (parseError) {
                    console.error('Chunk parsing error:', parseError, 'Chunk:', chunk);
                    return null;
                  }
                }).filter(parsedItem => parsedItem !== null);

                console.log('Parsed Data:', parsedData);
                this.fetchResponse = parsedData;
                this.cdr.detectChanges(); // Manually trigger change detection
                console.log('Change detection triggered');
              } catch (error) {
                if (error instanceof Error) {
                  console.error('Parsing error:', error.message);
                  this.rawResponse = `Parsing error: ${error.message}`;
                } else {
                  console.error('Unknown parsing error:', error);
                  this.rawResponse = 'Unknown parsing error';
                }
              }
              return;
            }

            chunks += textDecoder.decode(value, { stream: true });
            // console.log('Current chunks:', chunks);
            this.rawResponse = chunks;
            read();
          }).catch((error) => {
            if (error instanceof Error) {
              console.error('Read error:', error.message);
            } else {
              console.error('Unknown read error:', error);
            }
          });
        };

        read();
      })
      .catch((error) => {
        if (error instanceof Error) {
          console.error('Fetch error:', error.message);
        } else {
          console.error('Unknown fetch error:', error);
        }
      });
  }

}