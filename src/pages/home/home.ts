import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ObjectType } from './objecttype';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class Home {
  
  private places:ObjectType[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
       this.places = [{title:"card1", description:"name1"}, {title:"card2", description:"name2"}];
  } 
  goToMap ():void {
    this.navCtrl.push('SetSpot');
  }
}