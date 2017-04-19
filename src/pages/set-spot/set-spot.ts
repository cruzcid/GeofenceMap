import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {
 GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker, CircleOptions, Circle
} from '@ionic-native/google-maps';
import { Geofence } from '@ionic-native/geofence';

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
  private latLng:any;
  private radiosity:number;
  private static staticID:number = 0;
  private circleAdded:boolean = false;
  private circle:Circle;
  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private googleMaps: GoogleMaps,
    private alertCtrl: AlertController,
    private geofence: Geofence ) {
  }

  // Load map only after view is initialized
  ngAfterViewInit() {
    this.loadMap();
    this.loadGeofence();
  }

 // ____________________________________________________________________
 // ----------------      MAPS      ------------------------------------
 // ____________________________________________________________________

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
      this.latLng = latLng;
      this.setMarkerOptions();      
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

  private setMarkerOptions( ) {
    console.log("setMarkerOptions()");
    let touchedPosition: LatLng = new LatLng(this.latLng.lat, this.latLng.lng);
    this.markerOptions = {
      position : touchedPosition,
      title: '' + this.latLng.lat + ' ' + this.latLng.lng
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

  private removeCircle():void {    
    this.circleAdded = false;
    this.radiosity = 5;
    this.circle.remove();
  }

  private radiousChange():void {
    this.circle.setRadius(this.radiosity);
  }
  
  private onShortClick():void {
    this.removeItemsFromMap();
  }

  private onLongClick():void {
    console.log("onLongClick():void");    
    if( this.markerOnMap ) {
      this.removeItemsFromMap();    
    }      
    this.addMarker(this.markerOptions);
    this.addCircle();

  }
  private removeItemsFromMap():void {
      this.removeMarker();     
      this.removeCircle(); 
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


  public addCircle() {
    let circleOptions : CircleOptions = {
        center: this.latLng,
        radius: this.radiosity,                
        visible: true      
    }    

    this.circleAdded = true;
    this.map.addCircle(circleOptions).then(circle => this.circle = circle,
       failure => console.error(failure));
       
  }
 // ____________________________________________________________________
 // ----------------   GEOFENCE     ------------------------------------
 // ____________________________________________________________________
 
  private saveGeofence():void {
    console.log("Save geofence");

    //options describing geofence
    let numberId:number = Math.floor(Math.random() * 1000000) + 1 ;
    let stringID:string = "DCM_ID:" + SetSpot.staticID++ + "_" + numberId;
    let notificationID =  "C_" + stringID;    
    console.log(notificationID);    

    let fence = {
      id: stringID, //any unique ID
      latitude:       this.latLng.lat, //center of geofence radius
      longitude:      this.latLng.lng,
      radius:         this.radiosity, //radius to edge of geofence
      transitionType: 3, //see 'Transition Types' below
      notification: { //notification settings
          id:             notificationID, //any unique ID
          title:          "You crossed a fence", //notification title
          text:           "You just arrived to Gliwice city center.", //notification body
          openAppOnClick: true //open app when notification is tapped
      }
    }

    this.geofence.addOrUpdate(fence).then(
      () => console.log('Geofence added'),
      (err) => console.log('Geofence failed to add')
    );
       
  }
  private loadGeofence():void {
      this.geofence.initialize().then(
        // resolved promise does not return a value
        () => console.log('Geofence Plugin Ready'),
        (err) => console.log(err)
      )
  }
}
