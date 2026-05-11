import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-properties-page',
  standalone: true,
  imports: [],
  templateUrl: './properties-page.component.html',
  styleUrl: './properties-page.component.scss'
})
export class PropertiesPageComponent {
  private startDate: Date | null = null;
  private endDate: Date | null = null;

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.startDate = params['startDate'];
      this.endDate = params['endDate'];

      console.log(this.startDate, this.endDate)
    })
  }
}
