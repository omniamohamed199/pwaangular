import { HttpClient } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pwaangular';
  DummyData: any[] = []
  image: any
  @ViewChild("img")
  img!: ElementRef;
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

  upload(ev: any) {
    alert(ev.target.files[0])
    this.img.nativeElement.src = window.URL.createObjectURL(
      ev.target.files[0]
    )
  }
}
