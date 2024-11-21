import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interface';
import { combineLatest, map, Observable, of, tap } from 'rxjs';
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

    return this.http.get<Country[]>(url)
      .pipe(
        map( countries => countries.map( country => ({
            name: country.name.common,
            cca3: country.cca3,
            borders: country.borders ?? []
          }))
        ),
      )
  }

  getCountriesByAlphaCode( alphacode: string ): Observable<SmallCountry>{
    const url = `${this._baseURL}/alpha/${alphacode}?fields=cca3,name,borders`;
    return this.http.get<Country>(url)
    .pipe(
      map( country => ({
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? []
      }))
    )
  }

  getCountryBordersByCodes( borders: string[]): Observable<SmallCountry[]> {
    if( !borders || borders.length === 0 ) return of([]);

    const countriesRequests: Observable<SmallCountry>[] = [];

    borders.forEach( border => {
      countriesRequests.push( this.getCountriesByAlphaCode( border ) );
    });

    return combineLatest(countriesRequests);
  }
}
