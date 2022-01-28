import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-treegrid";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TaskModel } from "./task-model";
import { map } from "rxjs/operators";
import { DataSourceChangedEventArgs } from "@syncfusion/ej2-grids";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: "root"
})
export class TaskStoreService extends Subject<DataStateChangeEventArgs> {
  private apiUrl = 'http://localhost:3000/api/tasks';
  // private apiUrl = 'https://531a-2400-adc5-156-ec00-fcdd-8f6c-f3ec-37a1.ngrok.io/api/tasks';

  constructor(private http: HttpClient) {
    super();
  }

  public getTasksURL(){
    return this.apiUrl;
  }
  public execute(state: any): void {
    if (state.requestType === "expand") {
      state.childDataBind();
    } else {
      this.getTasks(state).subscribe(x =>
        super.next(x as DataStateChangeEventArgs)
      );
    }
  }

  getTasksTableConfigurations(): Observable<any[]> {
    return this.http.get<TaskModel[]>(this.apiUrl+'/config').pipe(
      map(
        (response: any) =>
          <any>{
            result:response.data,
            count: response.data.length
          }
      )
    );
  }

  getTasks(state?: any): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(this.apiUrl).pipe(
      map(
        (response: any) =>
          <any>{
            result:
              state.take > 0
                ? response.data.slice(state.skip, state.take)
                : response.data,
            count: response.data.length
          }
      )
    );
  }

  addRecord(
    dataSourceChangedEvent: DataSourceChangedEventArgs
  ): Observable<TaskModel> {
    return this.http.post<TaskModel>(
      this.apiUrl,
      dataSourceChangedEvent.data,
      httpOptions
    );
  }

  updateRecord(
    dataSourceChangedEvent: DataSourceChangedEventArgs
  ): Observable<TaskModel> {
    return this.http.put<TaskModel>(
      this.apiUrl,
      dataSourceChangedEvent.data,
      httpOptions
    );
  }

  deleteRecord(
    dataSourceChangedEvent: DataSourceChangedEventArgs
  ): Observable<TaskModel> {
    debugger

    const id = dataSourceChangedEvent.data;
    //dataSourceChangedEvent.data[0].id;
    const url = `${this.apiUrl}/${id}`;

    return this.http.delete<TaskModel>(url, httpOptions);
  }
}
