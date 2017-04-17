import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {
 GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker
} from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-set-spot',
  templateUrl: 'set-spot.html',
})
export class SetSpot {

  private marker: Marker;
  private map: GoogleMap;
  private markerOnMap:boolean; 
  private markerOptions: MarkerOptions;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private googleMaps: GoogleMaps,
    private alertCtrl: AlertController ) {
  }

  // Load map only after view is initialized
  ngAfterViewInit() {
    this.loadMap();
  }

  private loadMap():void {  
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    this.map = this.googleMaps.create(element);

    // listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {console.log('Map is ready!')
      this.map.setMyLocationEnabled(true);
      this.map.setClickable(true);
      this.map.setCompassEnabled(true);
      this.map.moveCamera(position);
    });

    // Long click on Map
    this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe((latLng) =>{
      
      console.log("Long Click");
      this.setMarkerOptions( latLng );      
      this.onLongClick();

    });

    // Short click on Map
    this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(() => {      
      this.onShortClick();
    });

    // create LatLng object
    let ionic: LatLng = new LatLng(19.3767208,-99.1775760);

    // create CameraPosition
    let position: CameraPosition = {
      target: ionic,
      zoom: 18,
      tilt: 30
    };    
    
    // create new marker
    let markerOptions: MarkerOptions = {
      position: ionic,
      title: 'Ionic'
    };    
  }

  private setMarkerOptions( latLng:any ) {
    console.log("setMarkerOptions()");
    let touchedPosition: LatLng = new LatLng(latLng.lat, latLng.lng);
    this.markerOptions = {
      position : touchedPosition,
      title: '' + latLng.lat + ' ' + latLng.lng
    }
  }

  private addMarker(markerOptions: MarkerOptions):void {
     console.log("addMarker():void");
     this.map.addMarker(markerOptions)
      .then((marker: Marker) => {
          this.marker = marker;
          this.marker.showInfoWindow();    
          let jsonResult:string = JSON.stringify(this.marker.getPosition);
          console.log("jsonResult " + this.marker.getTitle.toString );                                    
          this.markerOnMap = true;        
        });
  }  

  private removeMarker():void {
    console.info("removeMarker():void");
    this.marker.remove();
    this.markerOnMap = false; 
  }

  private onShortClick():void {
    this.markerOnMap = false;
    this.marker.remove();
  }

  private onLongClick():void {
    console.log("onLongClick():void");    
    if( this.markerOnMap ) {
      this.removeMarker();            
    }      
    this.addMarker(this.markerOptions);
  }

  private presentAlert( message:string ) {
    console.log("presentAlert()");
  
    this.map.setClickable(false);
    let alert = this.alertCtrl.create({
      title: 'Low battery',
      subTitle: '',
      message: message,
      buttons: [{
        text:'Ok',
        handler: () => { 
          console.log("Beautiful handler");
          this.map.setClickable(true);
        }
      }]
    });
    alert.present();   
  }

  private saveGeofence():void {
    console.log("Save geofence");
  }
}
