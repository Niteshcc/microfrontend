import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Component, Inject } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ROUTED_APP } from './app.tokens';
import { RoutedApp } from '@microfrontend/client';
import { IMap } from '../../../common/src/lib/map';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';

    constructor(@Inject(ROUTED_APP) private routedApp: RoutedApp, private router: Router) {
        this.initRoutedApp();
    }

    initRoutedApp(): void {
        this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((ene) => {
            const e = <NavigationEnd>ene;
            if (!e.url.endsWith('#IGNORE')) {
                this.routedApp.sendRoute(e.url);
            }
        });

        this.routedApp.registerCustomFrameConfigCallback((cfg) => console.debug('app-a received frame config: ', cfg));
        this.routedApp.registerRouteChangeCallback((activated, url) => {
            if (url) {
                this.navigate(url);
            }

            console.debug(`app-a was activated: ${activated}`);
        });
        this.routedApp.registerBroadcastCallback((tag, data) => {
            console.debug('app-a received broadcast', { tag, data });
            console.debug(`app-a hasShell: ${this.routedApp.hasShell}`);
        });

        this.routedApp.setFrameStyles({ 'background-color': 'white' });
    }

    private navigate(url: string): void {
        this.router.navigateByUrl(url + '#IGNORE', { skipLocationChange: true, replaceUrl: true });
    }
}
