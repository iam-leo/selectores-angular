import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {
  public countriesByRegion: SmallCountry[] = [];
  public bordersCountries: SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: [{ value: '', disabled: true }, Validators.required],
    border: [{ value: '', disabled: true }, Validators.required],
  })

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) { }

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges
    .pipe(
      //tap( () => this.myForm.get('country')!.setValue('') ),
      tap( () => {
        this.myForm.get('country')!.reset({ value: '', disabled: true });
        this.countriesByRegion = [];
      }),
      switchMap( region => this.countriesService.getCountriesByRegion(region) )
    )
    .subscribe(countries => {
      this.countriesByRegion = countries;

      if (countries.length > 0) {
        // Habilitar el select de `country` si hay países
        this.myForm.get('country')!.enable();
      }
    })
  }

  onCountryChanged(): void {
    this.myForm.get('country')!.valueChanges
    .pipe(
      tap( () => {
        this.myForm.get('border')!.reset({ value: '', disabled: true });
        this.bordersCountries = [];
      }),
      filter( (value: string) => value.length > 0 ),
      switchMap( ( alphacode ) => this.countriesService.getCountriesByAlphaCode( alphacode ) ),
      switchMap( country => this.countriesService.getCountryBordersByCodes( country.borders ))
    )
    .subscribe(countries => {
      this.bordersCountries = countries;

      if (countries.length > 0) {
        // Habilitar el select de `border` si hay países
        this.myForm.get('border')!.enable();
      }
    })
  }
}
