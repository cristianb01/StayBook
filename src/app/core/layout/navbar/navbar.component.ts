import { ChangeDetectionStrategy, Component, OnInit, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { SearchFilters } from '../../../features/properties/models/search-filters.model';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
    readonly menuToggle = output<void>();
    readonly search = output<SearchFilters>();

    public dateRange = new FormGroup({
        startDate: new FormControl<Date | null>(null),
        endDate: new FormControl<Date | null>(null)
    });

    public ngOnInit(): void {
    }

    public onSearchButtonClick(): void {
        this.search.emit(this.dateRange.value as SearchFilters);
    }
}
