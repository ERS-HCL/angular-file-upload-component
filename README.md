# Angular File Uploader Component

## Description
A reusable component to upload any local file(txt/pdf/doc/docx/jpg/png etc.) on server, and ultimately save/fetch to/from desired database location.

## Start Uploading:
![alt text](https://github.com/AshuHCL/angular-file-upload-component/blob/master/assets/startUploading.PNG)

## Upload Completed
![alt text](https://github.com/AshuHCL/angular-file-upload-component/blob/master/assets/endUploading.PNG)

## Network XHR calls to send the uploading file/s as binary
![alt text](https://github.com/AshuHCL/angular-file-upload-component/blob/master/assets/NetworkRequest.PNG)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Demo
You may want to have a look at the demo : https://staticassets-bd560.firebaseapp.com/

## Steps to start the application locally
1. Clone the application
2. Run "npm install" at the root folder of the application to download the node_modules
3. Run "npm start" and your application will start in your default browser at "localhost:4200"

## Code walkthrough
```
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
          if (event.type === HttpEventType.UploadProgress) {
            // calculate the progress percentage
            const percentDone = Math.round((100 * event.loaded) / event.total);
            // pass the percentage into the progress-stream
            progress.next(percentDone);
          } else if (event instanceof HttpResponse) {
            // Close the upload-progress-stream if we get an response form the API
            // that the upload is complete
            progress.complete();
          }
      });

      // Save every upload-progress-observable in a map of observables for all the files
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    // return the map of upload progress observables to update the UI on successfull upload
    return status;
  }
}
```
## Server Code
There is also /server folder, which contains the sample server code to demonstrate the server behaviour. This can be modified to save/fetch the file to/from the desired location.

## Development server
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

# Need Help?
For any help further, please contact me on Email: ashutosh.p@hcl.com / Phone: 7053592528

# Author
Ashutosh Pradhan
