import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import data from '../../assets/data/mock_data.json';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  @ViewChild('dataModalTemplate', { static: true }) public dataModalTemplate: TemplateRef<any>;
  @ViewChild('tabs', { static: true }) tabGroup: MatTabGroup;
  tests = data;
  dialogRef;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    let url = 'https://xdp-monitoring-tool.herokuapp.com/patient';
  }

  searchPatient(event: any){
    if (event.keyCode == 13 || event.key == "Enter") {
      const val = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.tests = data;
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

  openDataModal(test_data) {
    this.dialogRef = this.dialog.open(this.dataModalTemplate, {
      width: '60%',
      data: test_data,
    }).afterOpened().subscribe(_ => {
      this.tabGroup.selectedIndex = 0;
    });
  }

}
