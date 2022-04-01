import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from '../../../../../../core/common/enum/operator';
import * as _ from 'lodash';
import { DisplayedFieldsModel } from '../../../../../../public/models/filter/displayed-fields.model';
import { MultiLanguageService } from '../../../../../../share/translate/multiLanguageService';
import { PageEvent } from '@angular/material/paginator/public-api';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { ConfigContractListService } from '../../config-contract-list/config-contract-list.service';
import { environment } from '../../../../../../../environments/environment';
import * as fromSelectors from '../../../../../../core/store/selectors';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../../../core/store';

@Component({
  selector: 'app-config-contract-save-dialog',
  templateUrl: './config-contract-save-dialog.component.html',
  styleUrls: ['./config-contract-save-dialog.component.scss'],
})
export class ConfigContractSaveDialogComponent implements OnInit, OnDestroy {
  contractTemplateForm: FormGroup;
  title: string;
  contractTemplate: any;
  productStatuses: any[];

  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  pageSize: number = 10;
  pageIndex: number = 0;
  pageLength: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  totalItems: number = 0;
  displayColumnRowDef: string[];
  subManager = new Subscription();
  accessToken$: Observable<string>;
  token: string;
  liveContent: any;

  displayColumns: DisplayedFieldsModel[] = [
    {
      key: 'createdAt',
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.register_at'
      ),
      type: DATA_CELL_TYPE.DATETIME,
      format: 'dd/MM/yyyy HH:mm:ss',
      showed: true,
      width: 100,
    },
    {
      key: 'status',
      title: this.multiLanguageService.instant(
        'customer.customer_check_info.status'
      ),
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.PL_OTHER_STATUS,
      showed: true,
      width: 100,
    },
  ];

  ckeditorConfigReadonly: any = {};

  ckeditorConfig: any = {
    extraPlugins:
      'image,dialogui,dialog,a11yhelp,about,basicstyles,bidi,blockquote,clipboard,' +
      'button,panelbutton,panel,floatpanel,colorbutton,colordialog,menu,' +
      'contextmenu,dialogadvtab,div,elementspath,enterkey,entities,popup,' +
      'filebrowser,find,fakeobjects,floatingspace,listblock,richcombo,' +
      'font,format,forms,horizontalrule,htmlwriter,iframe,indent,' +
      'indentblock,indentlist,justify,link,list,liststyle,magicline,' +
      'maximize,newpage,pagebreak,pastefromword,pastetext,preview,print,' +
      'removeformat,resize,save,menubutton,scayt,selectall,showblocks,' +
      'showborders,smiley,sourcearea,specialchar,stylescombo,tab,table,' +
      'tabletools,templates,toolbar,undo,wysiwygarea,exportpdf',
    removePlugins: '',
    extraAllowedContent: 'code',
    filebrowserBrowseUrl:
      environment.API_BASE_URL +
      environment.COM_API_PATH +
      environment.UPLOAD_FILE_CKEDITOR_PATH,
    filebrowserUploadUrl:
      environment.API_BASE_URL +
      environment.COM_API_PATH +
      environment.UPLOAD_FILE_CKEDITOR_PATH,
    filebrowserImageUploadUrl:
      environment.API_BASE_URL +
      environment.COM_API_PATH +
      environment.UPLOAD_FILE_CKEDITOR_PATH,
    imageUploadUrl:
      environment.API_BASE_URL +
      environment.COM_API_PATH +
      environment.UPLOAD_FILE_CKEDITOR_PATH,
    uploadUrl:
      environment.API_BASE_URL +
      environment.COM_API_PATH +
      environment.UPLOAD_FILE_CKEDITOR_PATH,
  };
  productStatusFilterCtrl: FormControl = new FormControl();
  productFilterCtrl: FormControl = new FormControl();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfigContractSaveDialogComponent>,
    private formBuilder: FormBuilder,
    private multiLanguageService: MultiLanguageService,
    private configContractListService: ConfigContractListService,
    private store: Store<fromStore.State>
  ) {
    this._getPropertiesContract();
    this.displayColumnRowDef = this.displayColumns.map((ele) => ele.key);
    this.buildForm();
    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  ngOnInit(): void {
    this.accessToken$ = this.store.select(fromSelectors.getTokenState);
    this.accessToken$.subscribe((token) => {
      this.token = token;
    });
  }

  buildForm() {
    this.contractTemplateForm = this.formBuilder.group({
      name: [''],
      content: [''],
      statusId: [''],
      productId: [''],
      isActive: [''],
    });
  }

  initDialogData(data) {
    this.title = data?.title;
    this.contractTemplate = data?.element;

    this.contractTemplateForm.patchValue({
      name: this.contractTemplate?.name,
      content: this.contractTemplate?.content || '',
      statusId: this.contractTemplate?.statusId,
      productId: this.contractTemplate?.productId,
      isActive: this.contractTemplate?.isActive,
    });
  }

  submitForm() {
    if (this.contractTemplateForm.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.contractTemplateForm.getRawValue(),
    });
  }

  public onReadyCkEditor(editor) {
    // editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    //   return new CkEditorAdapters(loader, editor.config);
    // };
    // editor.ui
    //   .getEditableElement()
    //   .parentElement.insertBefore(
    //     editor.ui.view.toolbar.element,
    //     editor.ui.getEditableElement()
    //   );
  }

  public fileUploadRequest($event) {
    console.log('$event', $event);
    const xhr = $event.data.fileLoader.xhr;
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
  }

  public fileUploadResponse(e) {
    e.stop();

    const genericErrorText = `Couldn't upload file`;
    let response = JSON.parse(e.data.fileLoader.xhr.responseText);
    console.log('response', response);

    if (!response || response.error) {
      e.data.message =
        response && response.error ? response.error.message : genericErrorText;
      e.cancel();
      return;
    }

    e.data.url = response.url;
  }

  getPropByString(obj, propString) {
    if (!propString || !obj) return null;

    var prop,
      props = propString.split('.');

    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
      prop = props[i];

      var candidate = obj[prop];

      if (!_.isEmpty(candidate)) {
        obj = candidate;
      } else {
        break;
      }
    }

    return obj[props[i]];
  }

  public onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this._getPropertiesContract();
  }

  private _getPropertiesContract() {
    let requestBody = {
      limit: this.pageSize,
      pageIndex: this.pageIndex,
    };
    this.subManager.add(
      this.configContractListService
        .getDataPropertiesContract(requestBody)
        .subscribe((data: any) => {
          this.dataSource.data = data.result.data;
          this.pageLength = data.result?.pagination?.maxPage || 0;
          this.totalItems = data.result?.pagination?.total || 0;
        })
    );
  }

  syncPreview(data) {
    this.liveContent = data;
  }

  onCkeditorChange(data) {
    this.syncPreview(data);
  }
}
