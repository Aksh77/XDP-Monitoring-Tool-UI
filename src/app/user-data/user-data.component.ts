import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  tests = [];

  constructor(
    private http: HttpClient) {}

  ngOnInit(): void {
    let url = 'https://xdp-monitoring-tool.herokuapp.com/patient';
  }

  searchPatient(event: any){
    if (event.keyCode == 13 || event.key == "Enter") {
      const val = (event.target as HTMLInputElement).value.trim().toLowerCase();
      // mock data
      this.tests = [
        {
          "Date": "10 January 2022",
          "UPDRS Scale": [
            { 
              "Test type": "Finger Tapping",
              "Description": "Finger Tapping",
              "Status": "Ready",
              "Score": 73,
              "Video": {
                "Raw": "",
                "Annotated": ""
              }
            },
            {
              "Test type": "Posture",
              "Description": "Posture while standing erect",
              "Status": "Submitted for analysis",
              "Score": "Pending",
              "Video": {
                "Raw": "",
                "Annotated": ""
              }
            }
          ],
          "BFM Scale": [
            {
              "Test type": "Neck",
              "Description": "Dystonia of neck",
              "Status": "Not collected",
              "Score": 87,
              "Image": {
                "Raw": "",
                "Annotated": ""
              }
            }
          ],
          "Other Tests": [

          ]
        },
        {
          "Date": "15 February 2022",
          "UPDRS Scale": [
            { 
              "Test type": "Finger Tapping",
              "Description": "Finger Tapping",
              "Status": "Ready",
              "Score": 73,
              "Video": {
                "Raw": "",
                "Annotated": ""
              }
            },
            {
              "Test type": "Posture",
              "Description": "Posture while standing erect",
              "Status": "Submitted for analysis",
              "Score": "Pending",
              "Video": {
                "Raw": "",
                "Annotated": ""
              }
            }
          ],
          "BFM Scale": [
            {
              "Test type": "Neck",
              "Description": "Dystonia of neck",
              "Status": "Not collected",
              "Score": 87,
              "Image": {
                "Raw": "",
                "Annotated": ""
              }
            }
          ],
          "Other Tests": [

          ]
        },
      ]
      console.log("Search ", val);
    }
  }

  triggerSearch() {
    const input = document.getElementById('patient-search');
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keyup', {'key':'Enter'}));
  }

  getColour(status) {
    if (status == 'Ready') {
      return 'rgba(0, 255, 0, 0.2)';
    }
    else if (status == 'Submitted for analysis') {
      return 'rgba(0, 125, 255, 0.2)';
    }
    else if (status == 'Not collected') {
      return 'rgba(255, 0, 0, 0.2)';
    }
  }

}
