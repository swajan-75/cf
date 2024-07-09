import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileData } from '../datatypes';
import { ProfileService } from '../services/profile.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user_handle: string = "";
  friends: ProfileData[] = [];
  sortCriteria: { key: string, order: 'asc' | 'desc' }[] = [];
  file: File | null = null;
  handlesToAdd: string[] = [];
  addingFriends: boolean = false;
  pausedAdding: boolean = false;
  uploadSuccessful: boolean = false; 
  delay: number = 100;

  constructor(private profileService: ProfileService) { }

  addFriend() {
    if (this.user_handle.length > 0) {
      this.profileService.getProfileData(this.user_handle).subscribe(
        profile => {
          const isDuplicate = this.friends.some(friend => friend.handleName === profile.handleName);
          if (!isDuplicate) {
            this.friends.push(profile);
            this.sortFriends(); 
          } else {
            alert('This user is already in your friends list');
          }
          this.user_handle = ''; 
          this.processNextHandle(); 
        },
        error => {
          console.error(error);
          alert(`User name "${this.user_handle}" not found or error fetching data`);
          this.user_handle = '';
          this.processNextHandle();
        }
      );
    } else {
      alert('Please enter a valid handle');
      this.processNextHandle();
    }
  }

  sort(criteria: string) {
    const existingCriteria = this.sortCriteria.find(c => c.key === criteria);
    if (existingCriteria) {
      existingCriteria.order = existingCriteria.order === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortCriteria = [{ key: criteria, order: 'desc' }]; 
    }
    this.sortFriends();
  }

  sortFriends() {
    this.friends.sort((a, b) => {
      for (const criteria of this.sortCriteria) {
        const key = criteria.key;
        const order = criteria.order === 'asc' ? 1 : -1;
        let aValue: number, bValue: number;

        switch (key) {
          case 'currentRating':
            aValue = Number(a.contestRating);
            bValue = Number(b.contestRating);
            break;
          case 'maxRating':
            aValue = Number(a.maxRating);
            bValue = Number(b.maxRating);
            break;
          case 'numberOfSolve':
            aValue = a.number_of_solve;
            bValue = b.number_of_solve;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return 1 * order;
        if (aValue > bValue) return -1 * order;
      }
      return 0;
    });
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.file = target.files[0];
    }
  }

  uploadFile() {
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result) {
          const data = new Uint8Array(result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData: (string | number)[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

          const handleIndex = jsonData[0].indexOf('handles');
          if (handleIndex !== -1) {
            const handles = jsonData.slice(1).map((row: (string | number)[]) => row[handleIndex] as string);
            this.handlesToAdd = handles;
            this.uploadSuccessful = true; 
            this.addingFriends = true; 
            this.processNextHandle(); 
          } else {
            alert('No "handles" column found in the uploaded file.');
            this.uploadSuccessful = false; 
          }
        }
      };
      reader.readAsArrayBuffer(this.file);
    } else {
      alert('Please upload a valid Excel file.');
    }
  }

  processNextHandle() {
    if (!this.addingFriends || this.pausedAdding) {
      return;
    }
  
    if (this.handlesToAdd.length > 0) {
      setTimeout(() => {
        this.user_handle = this.handlesToAdd.shift()!;
        this.addFriend();
      }, this.delay);
    } else {
      this.addingFriends = false;
      this.uploadSuccessful = false; 
    }
  }

  pauseAddingFriends() {
    this.pausedAdding = true;
  }

  resumeAddingFriends() {
    if (this.pausedAdding) {
      this.pausedAdding = false;
      this.processNextHandle(); 
    }
  }

  clearData() {
    this.friends = [];
    this.handlesToAdd = [];
    this.uploadSuccessful = false; 
    this.addingFriends = false;
    this.pausedAdding = false; 
  }

  getBackgroundColor(rating_sting: string): string {
    let rating = Number(rating_sting);
    if (rating >= 2900) {
      return 'background-color: red; color: white;';
    } else if (rating >= 2600) {
      return 'background-color: red; color: white;';
    } else if (rating >= 2400) {
      return 'background-color: red; color: white;';
    } else if (rating >= 2300) {
      return 'background-color: orange; color: white;';
    } else if (rating >= 2200) {
      return 'background-color: orange; color: white;';
    } else if (rating >= 1900) {
      return 'background-color: violet; color: white;';
    } else if (rating >= 1600) {
      return 'background-color: blue; color: white;';
    } else if (rating >= 1400) {
      return 'background-color: cyan; color: black;';
    } else if (rating >= 1200) {
      return 'background-color: green; color: white;';
    } else {
      return 'background-color: gray; color: white;';
    }
  }
}
