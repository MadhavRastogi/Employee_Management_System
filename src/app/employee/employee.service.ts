import { Injectable } from '@angular/core';
import { IEmployee } from './IEmployee';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IEmpSup } from './IEmpSup';
import { IEmpSts } from './IEmpSts';

@Injectable()
export class EmployeeService {
  baseUrl = 'http://localhost:3000/employees';
  baseUrl2 = 'http://localhost:3002/empSups';
  baseUrl3 = 'http://localhost:3004/empStss';
  constructor(private httpClient: HttpClient) {
  }

  getEmployees(): Observable<IEmployee[]> {
    return this.httpClient.get<IEmployee[]>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }

  getEmpSups(): Observable<IEmpSup[]> {
    return this.httpClient.get<IEmpSup[]>(this.baseUrl2)
      .pipe(catchError(this.handleError));
  }

  getEmpStss(): Observable<IEmpSts[]> {
    return this.httpClient.get<IEmpSts[]>(this.baseUrl3)
      .pipe(catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse): Observable<any>{
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  getEmployee(id: number): Observable<IEmployee> {
    return this.httpClient.get<IEmployee>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getEmpSup(id: number): Observable<IEmpSup> {
    return this.httpClient.get<IEmpSup>(`${this.baseUrl2}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getEmpSts(id: number): Observable<IEmpSts> {
    return this.httpClient.get<IEmpSts>(`${this.baseUrl3}/${id}`)
      .pipe(catchError(this.handleError));
  }


  addEmployee(employee: IEmployee): Observable<IEmployee> {
    return this.httpClient.post<IEmployee>(this.baseUrl, employee, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }

  addEmpSup(empSup: IEmpSup): Observable<IEmpSup> {
    return this.httpClient.post<IEmpSup>(this.baseUrl2, empSup, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }

  addEmpSts(empSts: IEmpSts): Observable<IEmpSts> {
    return this.httpClient.post<IEmpSts>(this.baseUrl3, empSts, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }



  updateEmployee(employee: IEmployee): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${employee.id}`, employee, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }

  updateEmpSup(empSup: IEmpSup): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl2}/${empSup.id}`, empSup, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }

  updateEmpSts(empSts: IEmpSts): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl3}/${empSts.id}`, empSts, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }



  deleteEmployee(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  deleteEmpSup(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl2}/${id}`)
      .pipe(catchError(this.handleError));
  }

  deleteEmpSts(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl3}/${id}`)
      .pipe(catchError(this.handleError));
  }
}

