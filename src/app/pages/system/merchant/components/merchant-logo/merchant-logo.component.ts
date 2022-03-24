import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import {
  BUTTON_TYPE,
  MULTIPLE_ELEMENT_ACTION_TYPE,
  RESPONSE_CODE,
} from '../../../../../core/common/enum/operator';
import { MerchantDetailDialogComponent } from '../../../../../share/components';
import { MatDialog } from '@angular/material/dialog';
import {
  AdminControllerService,
  ApiResponseMerchant,
  ApiResponseString,
} from '../../../../../../../open-api-modules/bnpl-api-docs';
import {
  ApiResponseCustomerInfo,
  MerchantControllerService,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import CkEditorAdapters from '../../../../../core/utils/ck-editor-adapters';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-merchant-logo',
  templateUrl: './merchant-logo.component.html',
  styleUrls: ['./merchant-logo.component.scss'],
})
export class MerchantLogoComponent implements OnInit, OnDestroy {
  _merchantId: string;
  @Input()
  get merchantId(): string {
    return this._merchantId;
  }

  set merchantId(value: string) {
    this._merchantId = value;
  }

  @Input() merchantInfo;
  @Output() triggerUpdateInfo = new EventEmitter<any>();
  @Output() triggerDeleteMerchant = new EventEmitter<any>();
  @Output() triggerLockMerchant = new EventEmitter<any>();
  @Output() triggerUnlockMerchant = new EventEmitter<any>();
  merchantInfoForm: FormGroup;
  subManager = new Subscription();
  public Editor = DecoupledEditor;

  ckeditorConfig: any = {
    toolbar: [
      'heading',
      '|',
      'fontfamily',
      'fontsize',
      '|',
      'alignment',
      '|',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bold',
      'italic',
      'strikethrough',
      'underline',
      'subscript',
      'superscript',
      '|',
      'link',
      '|',
      'outdent',
      'indent',
      '|',
      'bulletedList',
      'numberedList',
      'todoList',
      '|',
      'sourceEditing',
      '|',
      'insertTable',
      '|',
      'mediaEmbed',
      'uploadImage',
      'blockQuote',
      'watchDog',
      'widget',
      '|',
      'undo',
      'redo',
    ],
    readOnly: true
  };

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private adminControllerService: AdminControllerService,
    private merchantControllerService: MerchantControllerService
  ) {
    this.buildIndividualForm();
  }

  ngOnInit(): void {
    this.initDialogData(this.merchantInfo);
  }

  buildIndividualForm() {
    this.merchantInfoForm = this.formBuilder.group({
      description: [''],
    });
  }

  initDialogData(data) {
    this.merchantInfoForm.patchValue({
      description: data?.description,
    });
  }

  public refreshContent() {
    setTimeout(() => {
      this._getMerchantInfoById(this.merchantInfo.id);
    }, 1000);
  }

  private _getMerchantInfoById(merchantId) {
    if (!merchantId) return;
    this.subManager.add(
      this.merchantControllerService
        .getMerchantById(merchantId)
        .subscribe((data: ApiResponseCustomerInfo) => {
          this.merchantInfo = data?.result;
          // this.updateElementInfo.emit(this.merchantInfo)
        })
    );
  }

  get status() {
    return this.merchantInfo?.status;
  }

  public openUpdateDialog() {
    this.triggerUpdateInfo.emit();
  }

  public lockPrompt() {
    this.triggerLockMerchant.emit();
  }

  public unlockPrompt() {
    this.triggerUnlockMerchant.emit();
  }

  public deletePrompt() {
    this.triggerDeleteMerchant.emit();
  }

  public onReadyCkEditor(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new CkEditorAdapters(loader, editor.config);
    };

    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );

  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
