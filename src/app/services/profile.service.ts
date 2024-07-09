import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { ProfileData } from '../datatypes'; 

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) {}

  getProfileData(user_handle: string): Observable<ProfileData> {
    const profileData: ProfileData = {
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

    const profileUrl = `https://codeforces.com/api/user.info?handles=${user_handle}&checkHistoricHandles=false`;
    const ratingUrl = `https://codeforces.com/api/user.rating?handle=${user_handle}`;
    const statusUrl = `https://codeforces.com/api/user.status?handle=${user_handle}`;

    return new Observable(observer => {
      this.http.get(profileUrl).pipe(
        catchError((error: any) => {
          console.error('Error fetching user data:', error);
          alert('User  name Not Found');
          profileData.clear();
          return throwError(error);
        })
      ).subscribe((res: any) => {
        if (res.status === "OK") {
          profileData.name = res.result[0].firstName || res.result[0].lastName ? `${res.result[0].firstName || ''} ${res.result[0].lastName || ''}`.trim() : res.result[0].handle;
          profileData.handleName = res.result[0].handle;
          profileData.rank = res.result[0].rank;
          profileData.contestRating = res.result[0].rating;
          profileData.maxRating = res.result[0].maxRating;
          profileData.contribution = res.result[0].contribution;
          profileData.organization = res.result[0].organization;
          profileData.city = res.result[0].city;
          profileData.country = res.result[0].country;
          profileData.profile_photo = res.result[0].titlePhoto;

          this.http.get(statusUrl).subscribe((res: any) => {
            let solveCounts: { [contestId: string]: boolean } = {};
            let solvedContests: { [contestId: string]: string[] } = {};
            let solved: { [key: string]: number } = {};
            for (let i: number = 0; i < res.result.length; i++) {
              if (res.result[i].verdict === "OK") {
                let contestId = res.result[i].contestId;
                let problemName = res.result[i].problem.name;
                let proble_id = `${contestId}-${problemName}-${res.result[i].problem.rating}`;
                solved[proble_id] = 1;
                if (!solveCounts[contestId]) {
                  solveCounts[contestId] = true;
                  solvedContests[contestId] = [problemName];
                } else {
                  solvedContests[contestId].push(problemName);
                }
              }
            }
            profileData.number_of_solve = Object.keys(solved).length;
          });

          this.http.get(ratingUrl).subscribe((res: any) => {
            profileData.number_of_contest = res.result.length;
            observer.next(profileData);
            observer.complete();
          });
        } else {
          alert(res.comment);
          profileData.clear();
          observer.error('Error fetching profile data');
        }
      });
    });
  }
}
