import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from '../../../../../../core/common/enum/operator';
import CkEditorAdapters from '../../../../../../core/utils/ck-editor-adapters';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import * as _ from 'lodash';
import { DisplayedFieldsModel } from '../../../../../../public/models/filter/displayed-fields.model';
import { MultiLanguageService } from '../../../../../../share/translate/multiLanguageService';
import { PageEvent } from '@angular/material/paginator/public-api';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfigContractListService } from '../../config-contract-list/config-contract-list.service';
// import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';

@Component({
  selector: 'app-config-contract-save-dialog',
  templateUrl: './config-contract-save-dialog.component.html',
  styleUrls: ['./config-contract-save-dialog.component.scss'],
})
export class ConfigContractSaveDialogComponent implements OnInit, OnDestroy {
  public Editor = DecoupledEditor;
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

  ckeditorConfig: any = {
    fontSize: {
      options: [9, 11, 13, 'default', 17, 19, 21],
    },
    plugins: [  ],
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
  };
  productStatusFilterCtrl: FormControl = new FormControl();
  productFilterCtrl: FormControl = new FormControl();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfigContractSaveDialogComponent>,
    private formBuilder: FormBuilder,
    private multiLanguageService: MultiLanguageService,
    private configContractListService: ConfigContractListService
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

  ngOnInit(): void {}

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
}
