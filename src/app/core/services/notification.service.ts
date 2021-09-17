import { Injectable } from '@angular/core';
import { PlPromptComponent } from '../../share/components';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  subManager = new Subscription();

  constructor(private dialog: MatDialog) {}

  openErrorModal(payload: any) {
    this.openPrompt(payload, 'assets/img/payday-loan/warning-prompt-icon.png');
  }

  openSuccessModal(payload: any) {
    this.openPrompt(payload, 'assets/img/payday-loan/success-prompt-icon.png');
  }

  openPrompt(payload: any, imgUrl: string) {
    const dialogRef = this.dialog.open(PlPromptComponent, {
      panelClass: 'custom-dialog-container',
      height: 'auto',
      minHeight: '194px',
      data: {
        imgBackgroundClass: 'text-center',
        imgUrl: !payload.imgGroupUrl ? payload?.imgUrl || imgUrl : null,
        imgGroupUrl: payload?.imgGroupUrl || null,
        title: payload?.title,
        content: payload?.content,
        primaryBtnText: payload?.primaryBtnText,
        secondaryBtnText: payload?.secondaryBtnText,
      },
    });

    this.subManager.add(
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        console.log(confirmed);
        this.subManager.unsubscribe();
      })
    );
  }
}
