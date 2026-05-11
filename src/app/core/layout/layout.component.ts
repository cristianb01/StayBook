import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavbarComponent } from './navbar/navbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SearchFilters } from '../../features/properties/models/search-filters.model';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, MatSidenavModule, NavbarComponent, SidenavComponent],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
    sidenavOpened = true;

    constructor(private router: Router) {
    }

    public onSearchProperties($event: SearchFilters) {
        this.router.navigate(['/properties'], {
            queryParams: {
                startDate: $event.startDate.toISOString(),
                endDate: $event.endDate.toISOString()
            }
        });

    }
}
