import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {
  public countriesByRegion: SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: [{ value: '', disabled: true }, Validators.required],
    borders: ['', Validators.required],
  })

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) { }

  ngOnInit(): void {
    this.onRegionChanged();
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
}
