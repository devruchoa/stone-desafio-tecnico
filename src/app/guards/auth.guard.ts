import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

/**
  * Determines whether the user is authorized to access a certain route.
  * @param route - The activated route snapshot.
  * @param state - The router state snapshot.
  * @returns A boolean indicating whether the user is authorized to access the route or a UrlTree to redirect the user to a different route.
  */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    const submitted = route.queryParamMap.get('submitted');
    if (submitted) {
      return true;
    } else {
      return this.router.createUrlTree(['/form'], { fragment: 'form' });
    }
  }
}
