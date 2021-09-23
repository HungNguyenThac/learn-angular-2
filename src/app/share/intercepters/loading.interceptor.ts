import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { PlLoadingComponent } from '../components';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let dialogRef = null;

    if (!req.reportProgress) {
      Promise.resolve(null).then(
        () =>
          (dialogRef = this.dialog.open(PlLoadingComponent, {
            panelClass: 'hide-content-dialog',
            height: 'auto',
            minHeight: '194px',
            maxWidth: '290px',
            data: {
              showContent: false,
            },
          }))
      );
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (!req.reportProgress) {
          dialogRef.close();
        }
      })
    );
  }
}
