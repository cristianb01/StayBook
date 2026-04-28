import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavbarComponent } from './navbar/navbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';

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
}
