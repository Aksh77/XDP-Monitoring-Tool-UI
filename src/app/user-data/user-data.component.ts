import { Component, OnInit, ViewChild, TemplateRef, QueryList, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import patientData from '../../assets/data/sample_data.json';
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

  ngAfterViewInit(): void {
    // credits: https://stackoverflow.com/a/41234724/1585523
    this.progressionChartDiv.changes.subscribe(result => {
      this.plotProgression(result.first.nativeElement)
    });
    // this.plotProgression(document.querySelector("#progressionChart"))
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    // TODO: not sure where and how to unsubscribe
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

  private plotProgression(chartDashboardDiv) {
    // console.log(patientData)
    // assumes the first entry has all the tests listed
    const allTestNames = patientData.data[0].Tests.map(testData => testData["Test type"])
    chartDashboardDiv.innerHTML = ""
    for (const testName of allTestNames) {
      const testDiv = document.createElement("div")
      testDiv.style.width = "650px";
      testDiv.style.height = "450px";
      testDiv.style.margin = "5px"
      testDiv.style.float = "left"
      chartDashboardDiv.appendChild(testDiv)
      this.plotProgressionForTest(testName, testDiv);
    }
    const clearLayoutDiv = document.createElement("div")
    clearLayoutDiv.style.clear = "both"
    chartDashboardDiv.appendChild(clearLayoutDiv)
  }


  private plotProgressionForTest(testName: string, chartContainer: any) {
    // Note: This fn assumes the test score exists for all the dates
    const x = patientData.data.map(d => new Date(d.Date));
    const testData = patientData.data.map(d => d.Tests.filter(t => t["Test type"] === testName));
    const ys = {};
    for (const test of testData) {
      for (const subTest of test[0]['Sub-tests']) {
        const subTestName = subTest["Test parameter"];
        if (subTestName in ys) {
          ys[subTestName].push(subTest.Score.Patient);
        } else {
          ys[subTestName] = [subTest.Score.Patient];
        }
      }
    }
    const plotData = Object.keys(ys).map(subTestName => {
      return {
        x: x,
        y: ys[subTestName],
        mode: 'lines+markers',
        name: subTestName
      };
    });
    const layout = {
      hovermode: 'closest',
      title: testName,
      yaxis: { title: "Patient Score" },
      xaxis: { title: "Date" }
    };
    Plotly.newPlot(chartContainer, plotData, layout);
  }
}
