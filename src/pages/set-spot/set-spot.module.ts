import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetSpot } from './set-spot';

@NgModule({
  declarations: [
    SetSpot,
  ],
  imports: [
    IonicPageModule.forChild(SetSpot),
  ],
  exports: [
    SetSpot
  ]
})
export class SetSpotModule {}
