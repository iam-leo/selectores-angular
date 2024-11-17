import { Injectable } from '@angular/core';
import { Region, SmallCountry } from '../interfaces/country.interface';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private _regions: Region[] = [ Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania ];
  private _baseURL: string = 'https://restcountries.com/v3.1';

  constructor( private http: HttpClient ) { }

  get regions(): Region[]{
    return [...this._regions ];
  }

  getCountriesByRegion( region: Region ): Observable<SmallCountry[]> {
    const url = `${this._baseURL}/region/${region}?fields=cca3,name,borders`;

    if(!region) return of([]);

    return this.http.get<SmallCountry[]>(url)
      .pipe(
        tap( resp => console.log(resp) ),
      )
  }
}
