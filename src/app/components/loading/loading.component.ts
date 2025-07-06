import { Component, OnInit, Input } from '@angular/core';
// Ionic
import { IonSpinner, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sparklesOutline  } from 'ionicons/icons';
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  imports: [
    IonSpinner, IonIcon, IonText
  ]
})
export class LoadingComponent implements OnInit {
  @Input() message: string = 'Loading...';
  constructor() {
    addIcons({ sparklesOutline });
   }

  ngOnInit() { }

}
