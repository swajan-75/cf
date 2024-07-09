import { Component } from '@angular/core';
import { ProfileData } from '../datatypes'; // Adjust the path as necessary
import { ProfileService } from '../services/profile.service'; // Adjust the path as necessary
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  user_handel: string = '';
  profileData: ProfileData = {
    name: '',
    handleName: '',
    number_of_solve: 0,
    number_of_contest: 0,
    rank: '',
    contestRating: '',
    maxRating: '',
    contribution: '',
    organization: '',
    city: '',
    country: '',
    profile_photo: '',
    clear(): void {
      this.name = '';
      this.handleName = '';
      this.number_of_solve = 0;
      this.rank = '';
      this.contestRating = '';
      this.maxRating = '';
      this.contribution = '';
      this.organization = '';
      this.city = '';
      this.country = '';
      this.profile_photo = '';
      document.getElementById('profile_photo')?.setAttribute('src', "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExczlvdmJtd3ltdHdwdm16NDNoZ2NkYTR3cWpiYmFlbWJtYmowZHI2ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QHE5gWI0QjqF2/giphy.webp");
    }
  };

  constructor(private profileService: ProfileService) {}

  update() {
    if (this.user_handel.length == 0) {
      alert('No data found for the provided handle.');
      this.profileData.clear();
    } else {
      this.profileService.getProfileData(this.user_handel).subscribe({
        next: (data: ProfileData) => {
          this.profileData = data;
          document.getElementById('profile_photo')?.setAttribute('src',this.profileData.profile_photo);
        },
        error: (err) => {
          console.error('Error fetching profile data:', err);
        }
      });
    }
  }
}
