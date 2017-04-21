import { Component } from '@angular/core';
import { DataOptions } from './dataOptions';
import { IonicPage, 
        NavController, 
        NavParams,
        ViewController,
        Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-save-geofence-modal',
  templateUrl: 'save-geofence-modal.html',
})
export class SaveGeofenceModal {
  
  private mTransitionType:number;
  private mNoteName:string;
  private mNoteDescription:string;
  private data:DataOptions;

  constructor(
    public navCtrl: NavController, 
    private navParams: NavParams,
    private viewCtrl: ViewController, 
    private events: Events ) {
      this.mNoteName = "";
      this.mNoteDescription = "";
      this.mTransitionType = 1;
      this.events.subscribe('ionCancel',() => {
        console.log("something changed inside me");
      });
  }

  ionViewDidLoad() {   
  }

  // ____________________________________________________________________
  // ----------------      MODAL     ------------------------------------
  // ____________________________________________________________________
  private onCancel():void {
     this.setDataOptions(true);
     this.dismiss();
  }

  private onSave():void {   
    this.setDataOptions(false);
    this.dismiss();
  }
 
  private dismiss():void {   
    this.viewCtrl.dismiss(this.data);    
  }
  
  private setDataOptions(mDataOptionsEmpty:boolean):void {
    if(mDataOptionsEmpty) {
      this.data = { 
          dataEmpty : true,
          noteDescription : "",
          noteName:"",
          noteTransitionType:1
      };
    } else {
      this.data = { 
          dataEmpty : true,
          noteDescription : this.mNoteDescription,
          noteName: this.mNoteName,
          noteTransitionType:this.mTransitionType
      };
    }
  }

}
