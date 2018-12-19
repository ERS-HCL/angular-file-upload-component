import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

// Update this URL with your REST API URL which would handle this file uploading
const url = 'http://localhost:3000/upload';

@Injectable()
export class UploadService {
  constructor(private http: HttpClient) {}

  public upload(files: Set<File>): { [key: string]: Observable<number> } {
    // this will be the our resulting map
    const status = {};

    files.forEach(file => {
      // create a new multipart-form for every file which we want to upload
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      // Create a http-post request and pass the form
      // Also tell it to report the upload progress
      const req = new HttpRequest('POST', url, formData, {
        reportProgress: true
      });

      // create a new upload-progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for upload-progress-updates
      this.http.request(req).subscribe(event => {

        // ========================================================================================

        // +++++++++++++++++++++++This is the code which would work with actual server++++++++++++++
        //   if (event.type === HttpEventType.UploadProgress) {
        //     // calculate the progress percentage

        //     const percentDone = Math.round((100 * event.loaded) / event.total);
        //     // pass the percentage into the progress-stream
        //     progress.next(percentDone);
        //   } else if (event instanceof HttpResponse) {
        //     // Close the progress-stream if we get an answer form the API
        //     // The upload is complete
        //     progress.complete();
        //   }
        // ========================================================================================

        // ========================================================================================
        // Dummy code to demonstrate the actual look and feel of the uploader 
        var eventLoaded = 0;
        var interval = setInterval( increment, 1000);
        function increment(){
          eventLoaded = eventLoaded % 360 + 1;
          const percentDone = Math.round((100 * eventLoaded) / 5);
          console.log(percentDone);
          progress.next(percentDone);

          if(percentDone == 100) {
            progress.complete();
            clearInterval(interval)
          }
        }
        //++++++++++++++++++++++++++++++++++++++++Dummy code ends+++++++++++++++++++++++++++++++++ 
        // ========================================================================================
      });


      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }
}
