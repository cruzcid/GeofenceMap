import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaveGeofenceModal } from './save-geofence-modal';

@NgModule({
  declarations: [
    SaveGeofenceModal,
  ],
  imports: [
    IonicPageModule.forChild(SaveGeofenceModal),
  ],
  exports: [
    SaveGeofenceModal
  ]
})
export class SaveGeofenceModalModule {}
