import { Component, OnInit, ViewChild, TemplateRef, QueryList, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import data from '../../assets/data/sample_data.json';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import Plotly from 'plotly.js-dist/plotly';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  @ViewChild('dataModalTemplate', { static: true }) public dataModalTemplate: TemplateRef<any>;
  @ViewChild('tabs', { static: true }) tabGroup: MatTabGroup;
  @ViewChildren('chart') progressionChartDiv: QueryList<any>;

  tests = [];
  dialogRef;
  notFound;

  constructor(private http: HttpClient, public dialog: MatDialog) {
  }

  ngAfterViewChecked(): void {
    // TODO: feels like a better place to subscribe but 
    // this.plotProgression is being called multiple times in here
    // this.progressionChartDiv.changes.subscribe(result => {
    //   this.plotProgression(result.first.nativeElement)
    // });
  }

  ngOnDestroy(): void {
    // TODO: not sure where to unsubscribe
    // this.progressionChartDiv.changes.unsubscribe();
  }

  searchPatient(event: any){
    if (event.keyCode == 13 || event.key == "Enter") {
      const val = (event.target as HTMLInputElement).value.trim().toLowerCase();
      let url = `https://xdp-monitoring-tool.herokuapp.com/patient/${val}`;
      this.http.get(url).subscribe(
        data => {
          if (data['data']) {
            this.notFound = false;
            this.tests = data['data'];
            // credits: https://stackoverflow.com/a/41234724/1585523
            this.progressionChartDiv.changes.subscribe(result => {
              this.plotProgression(result.first.nativeElement)
              }
            );
          }
          else {
            console.log(data);
          }
        },
        error => {
          this.notFound = true;
          this.tests = [];
        }
      )
      console.log("Search ", val);
    }
  }

  triggerSearch() {
    const input = document.getElementById('patient-search');
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keyup', { 'key': 'Enter' }));
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

  plotProgression(chartContainer) {
    console.log(data)
    Plotly.newPlot(chartContainer, [{
      x: [1, 2, 3, 4, 5],
      y: [1, 2, 4, 8, 16]
    }], {
      margin: { t: 0 }
    });
  }

}
