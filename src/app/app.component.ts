import { HttpClient } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pwaangular';
  DummyData: any[] = []
  private readonly publicKey = 'BE9VqOG6Kqs-svXBx6GuBAdxKmLaJCuHmqmyZ7Y0XPUQFD4aT1-uw1Qk9NMHIOsJuKBP8AQuVCi1wit6LUmj7i4'
  constructor(private http: HttpClient, swUpdate: SwUpdate, private swpush: SwPush) {
    if (swUpdate.isEnabled) {
      swUpdate.available.subscribe(event => {
        console.log(event, "color:yellow")
        swUpdate.activateUpdate().then(() => document.location.reload())
      })
    }

  }
  ngOnInit(): void {

    this.pushSubscription()

    this.swpush.messages.subscribe(Message => {
      console.log(Message)
    })

    this.swpush.notificationClicks.subscribe(({ action, notification }) => {
      console.log(notification)
    })

    this.http.get('https://jsonplaceholder.typicode.com/users').subscribe((res: any) => {
      this.DummyData = res
    })
  }
  pushSubscription() {
    if (!this.swpush.isEnabled) {
      console.log("Notification is not enabled ")
      return;
    }
    this.swpush.requestSubscription({
      serverPublicKey: this.publicKey
    }).then(sub => console.log(JSON.stringify(sub))).catch(err => console.log(JSON.stringify(err)))
  }
  postSync() {
    let obj = {
      name: 'omnia'
    }
    this.http.post('http://localhost:55000/data', obj).subscribe(res => {
      console.log(res)
    }, err => {
      console.log(err)
      this.backgroundSync()
    })
  }
  backgroundSync() {
    navigator.serviceWorker.ready.then((swRegisteration) => {
      swRegisteration.sync.register('post-data')
    }).catch(err => console.log)
  }
  upload(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const filePicker = document.querySelector('input');
      if (!filePicker || !filePicker.files
        || filePicker.files.length <= 0) {
        reject('No file selected.');
        return;
      }
      const myFile = filePicker.files[0];
      this.convert(myFile);
      resolve();
    });
  }
  convert(myFile: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      if (fileReader && myFile) {
        fileReader.readAsDataURL(myFile);
        fileReader.onload = () => {
          const blob = new Blob([new Uint8Array(
            fileReader.result as ArrayBuffer)]);
          const blobURL = URL.createObjectURL(blob);
          console.log(blobURL)
          var myImage = new Image()
          myImage.src = blobURL;
          document.body.appendChild(myImage);
          resolve(blobURL);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      } else {
        reject('No file provided');
      }
    });
  }
}
