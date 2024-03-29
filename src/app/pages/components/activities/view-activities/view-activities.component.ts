import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { activity, activityByUser, addActivityByUserResponse } from 'src/app/interfaces/activities';
import { ActivitiesService } from 'src/app/services/activities.service';
import { LoadingControllerService } from 'src/app/services/loading-controller.service';

@Component({
  selector: 'app-view-activities',
  templateUrl: './view-activities.component.html',
  styleUrls: ['./view-activities.component.scss'],
})
export class ViewActivitiesComponent  implements OnInit {

  activities:activityByUser[] = [];
  activitiesByUser: addActivityByUserResponse[] = [];

  constructor(private activitiesService: ActivitiesService, private alertController: AlertController,
    private loading: LoadingControllerService) { }

  async ngOnInit() {
    this.loading.present();
    try {
      this.activitiesService.getActivityByUser().subscribe({
        next: async (activitiesByUserDb: addActivityByUserResponse[]) => {
          this.loading.dismiss(); 
          this.activitiesByUser = [...activitiesByUserDb];
          this.setActivities();
        },
        error: async (err: HttpErrorResponse) => {
          this.loading.dismiss(); 
          const alert = await this.alertController.create({
            header: 'Error',
            message: `${err?.error?.message ?? 'Mensaje no disponible.'}`,
            buttons: ['Ok'],
          });
          await alert.present();
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async setActivities(){
    this.activitiesService.getActivities().subscribe({
      next: async (activities: activity[])=>{
        activities.forEach((activity: activity)=>{
          let activityByUser: activityByUser = {
            _id: activity._id,
            description: activity.description,
            image: activity.image,
            isDone: this.activitiesByUser.find((actUser:addActivityByUserResponse) => actUser.idActivity === activity._id)?.isDone ?? false,
            name: activity.name,
            timeDone: this.activitiesByUser.find((actUser:addActivityByUserResponse) => actUser.idActivity === activity._id)?.timeDone ?? 0,
            url: activity.url
          };
          this.activities.push(activityByUser)
        });
      },
      error: async (err: HttpErrorResponse) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: `${err?.error?.message ?? 'Mensaje no disponible.'}`,
          buttons: ['Ok'],
        });
        await alert.present();
      }
    });
  }

  evalueActivityState(state:boolean):string{
    if (state){
      return "success";
    }else{
      return "danger"; 
    }
  }

}
