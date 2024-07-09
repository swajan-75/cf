import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { userInfo } from 'os';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    {path:"",component:HomeComponent},
    {path:"home",component:HomeComponent},
    {path:"user-info",component:UserProfileComponent},
    {path:"**",component:PageNotFoundComponent}
];
