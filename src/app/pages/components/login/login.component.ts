import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plugins } from '@capacitor/core';
import { AlertController, NavController } from '@ionic/angular';
import { UserAuthRequest, UserAuthResponse } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingControllerService } from 'src/app/services/loading-controller.service';
const { Storage } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  form : FormGroup= this.formBuilder.group({
    email: ['', [Validators.required, Validators.email ]],
    password: ['', [Validators.required]]
  });
  
  constructor(private nvCtrl: NavController, private formBuilder: FormBuilder, private alertController: AlertController,
    private readonly authService: AuthService, private loading: LoadingControllerService) { }

  ngOnInit() {}

  async login(){

    const auth: UserAuthRequest = {
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value
    }
    this.loading.present();
    this.authService.postAuthentication(auth)
    .subscribe({
      next: async (response:UserAuthResponse) => {
        if (response){
          this.loading.dismiss(); 
          localStorage.setItem('token', response.token);
          this.nvCtrl.navigateRoot('/main-view', { animated: true });
        }
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


  }

}
