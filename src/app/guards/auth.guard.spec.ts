import { TestBed } from "@angular/core/testing";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, convertToParamMap } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthGuard } from "./auth.guard";

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard]
    });
    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    route = {} as ActivatedRouteSnapshot;
    state = {} as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if submitted query param is present', () => {
    const paramMap = convertToParamMap({ submitted: true });
    const snapshot = { queryParamMap: paramMap } as any;
    const route = { queryParamMap: paramMap } as any;
    expect(guard.canActivate(route, snapshot)).toEqual(true);
  });

  it('should navigate to /form if submitted query param is not present', () => {
    const paramMap = convertToParamMap({});
    const snapshot = { queryParamMap: paramMap } as any;
    const route = { queryParamMap: paramMap } as any;
    const urlTree = guard.canActivate(route, snapshot) as any;
    expect(urlTree.fragment).toEqual('form');
  });
});
