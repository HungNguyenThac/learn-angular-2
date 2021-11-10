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
import { NotificationService } from '../../core/services/notification.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let dialogRef = null;

    if (!req.reportProgress) {
      Promise.resolve(null).then(() => {
        dialogRef = this.notificationService.showLoading({
          showContent: false,
        });
      });
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
