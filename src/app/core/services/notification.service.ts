import { Injectable } from '@angular/core';
import { PlPromptComponent } from '../../share/components';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Prompt } from '../../public/models/prompt.model';
import { PlLoadingComponent } from '../../share/components/dialogs/pl-loading/pl-loading.component';
import { MultiLanguageService } from '../../share/translate/multiLanguageService';
import { PlLoading } from 'src/app/public/models/plloading.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  subManager = new Subscription();

  constructor(
    private dialog: MatDialog,
    private multiLanguageService: MultiLanguageService
  ) {}

  openErrorModal(payload: Prompt) {
    this.openPrompt(payload, 'assets/img/payday-loan/warning-prompt-icon.png');
  }

  openSuccessModal(payload: Prompt) {
    this.openPrompt(payload, 'assets/img/payday-loan/success-prompt-icon.png');
  }

  openPrompt(payload: Prompt, imgUrl: string) {
    const dialogRef = this.dialog.open(PlPromptComponent, {
      panelClass: 'custom-dialog-container',
      height: 'auto',
      minHeight: '194px',
      data: {
        imgBackgroundClass: payload.imgBackgroundClass
          ? payload.imgBackgroundClass + ' text-center'
          : 'text-center',
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

  showLoading(payload: PlLoading) {
    const dialogRef = this.dialog.open(PlLoadingComponent, {
      panelClass: 'custom-dialog-container',
      height: 'auto',
      minHeight: '194px',
      data: {
        title: payload?.title || 'Thông tin của bạn đang được xử lý',
        content:
          payload?.content ||
          'Quá trình sẽ mất khoảng một vài giây, vui lòng không thoát ứng dụng',
      },
    });

    this.subManager.add(
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        console.log(confirmed);
        this.subManager.unsubscribe();
      })
    );
  }

  destroyAllDialog() {
    this.dialog.closeAll();
  }

  hideLoading() {
    this.destroyAllDialog()
  }
}
