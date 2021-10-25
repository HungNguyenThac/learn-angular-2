import { Injectable } from '@angular/core';
import { PlPromptComponent } from '../../share/components';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Prompt } from '../../public/models/prompt.model';
import { PlLoadingComponent } from '../../share/components';
import { PlLoading } from 'src/app/public/models/plloading.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  subManager = new Subscription();

  constructor(
    private dialog: MatDialog,
    private loadingDialogRef: MatDialogRef<PlLoadingComponent>,
    private promptDialogRef: MatDialogRef<PlPromptComponent>
  ) {}

  openErrorModal(payload: Prompt) {
    this.openPrompt(payload, 'assets/img/op/warning-prompt-icon.png');
  }

  openSuccessModal(payload: Prompt) {
    this.openPrompt(payload, 'assets/img/op/success-prompt-icon.png');
  }

  openPrompt(payload: Prompt, imgUrl?: string) {
    this.promptDialogRef = this.dialog.open(PlPromptComponent, {
      panelClass: 'custom-dialog-container',
      height: 'auto',
      minHeight: '194px',
      maxWidth: '330px',
      data: {
        imgBackgroundClass: payload?.imgBackgroundClass
          ? payload?.imgBackgroundClass + ' text-center'
          : 'text-center',
        imgUrl: !payload?.imgGroupUrl ? payload?.imgUrl || imgUrl : null,
        imgGroupUrl: payload?.imgGroupUrl || null,
        title: payload?.title,
        content: payload?.content,
        primaryBtnText: payload?.primaryBtnText,
        secondaryBtnText: payload?.secondaryBtnText,
      },
    });

    this.subManager.add(
      this.promptDialogRef.afterClosed().subscribe((confirmed: boolean) => {
        console.log(confirmed);
        this.subManager.unsubscribe();
      })
    );
  }

  showLoading(payload?: PlLoading) {
    this.loadingDialogRef = this.dialog.open(PlLoadingComponent, {
      panelClass: payload?.showContent
        ? 'custom-dialog-container'
        : 'hide-content-dialog',
      height: 'auto',
      minHeight: '194px',
      maxWidth: '290px',
      data: {
        title: payload?.title || 'Thông tin của bạn đang được xử lý',
        content:
          payload?.content ||
          'Quá trình sẽ mất khoảng một vài giây, vui lòng không thoát ứng dụng',
        showContent: payload?.showContent,
      },
    });

    this.subManager.add(
      this.loadingDialogRef.afterClosed().subscribe((confirmed: boolean) => {
        console.log(confirmed);
        this.subManager.unsubscribe();
      })
    );
  }

  destroyAllDialog() {
    console.log('destroyAllDialog');
    this.dialog.closeAll();
  }

  hidePrompt() {
    this.promptDialogRef.close('hidePrompt');
  }

  hideLoading() {
    this.loadingDialogRef.close('hideLoading');
  }
}
