import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  BUTTON_TYPE,
  DATA_CELL_TYPE,
  RESPONSE_CODE,
  TABLE_ACTION_TYPE,
} from '../../../../../../core/common/enum/operator';
import * as _ from 'lodash';
import { DisplayedFieldsModel } from '../../../../../../public/models/filter/displayed-fields.model';
import { MultiLanguageService } from '../../../../../../share/translate/multiLanguageService';
import { PageEvent } from '@angular/material/paginator/public-api';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, Subscription } from 'rxjs';
import { ConfigContractListService } from '../../config-contract-list/config-contract-list.service';
import { environment } from '../../../../../../../environments/environment';
import * as fromSelectors from '../../../../../../core/store/selectors';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../../../core/store';
import { jsPDF } from 'jspdf';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../../../../../core/services/notification.service';

@Component({
  selector: 'app-config-contract-save-dialog',
  templateUrl: './config-contract-save-dialog.component.html',
  styleUrls: ['./config-contract-save-dialog.component.scss'],
})
export class ConfigContractSaveDialogComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild(MatTable, { read: ElementRef }) private matTableRef: ElementRef;
  contractTemplateForm: FormGroup;
  title: string;
  contractTemplate: any;
  action: TABLE_ACTION_TYPE;
  workflowStatuses: any[];
  loanProducts: any[];

  resizeTimeout: any;

  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  pageSize: number = 20;
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
      key: 'orderNumber',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_property.order_number'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
      width: 50,
    },
    {
      key: 'variableName',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_property.variable_name'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
      width: 200,
    },
    {
      key: 'description',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_property.description'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
      width: 200,
    },
    {
      key: 'code',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_property.code'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
      width: 200,
    },
  ];

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
  _onDestroy = new Subject<void>();
  filteredWorkflowStatuses: any[];
  filteredProducts: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfigContractSaveDialogComponent>,
    private formBuilder: FormBuilder,
    private multiLanguageService: MultiLanguageService,
    private configContractListService: ConfigContractListService,
    private store: Store<fromStore.State>,
    private notificationService: NotificationService
  ) {
    this._getPropertiesContract();
    this._getListLoanProducts();
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
    this.productFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProducts();
      });

    this.productStatusFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterWorkflowStatuses();
      });
  }

  filterProducts() {
    let search = this.productFilterCtrl.value;
    if (!search) {
      this.filteredProducts = this.loanProducts;
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredProducts = this.loanProducts.filter(
      (product) => product.name.toLowerCase().indexOf(search) > -1
    );
  }

  filterWorkflowStatuses() {
    let search = this.productStatusFilterCtrl.value;
    if (!search) {
      this.filteredWorkflowStatuses = this.workflowStatuses;
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredWorkflowStatuses = this.workflowStatuses.filter(
      (workflowStatus) =>
        workflowStatus.loanStatus?.name.toLowerCase().indexOf(search) > -1
    );
  }

  buildForm() {
    this.contractTemplateForm = this.formBuilder.group({
      name: ['', [Validators.maxLength(100)]],
      content: [''],
      statusFlowId: [''],
      productId: [''],
      isActive: [''],
    });
  }

  initDialogData(data) {
    this.title = data?.title;
    this.contractTemplate = data?.element;
    this.action = data?.action || TABLE_ACTION_TYPE.CREATE;
    if (this.action === TABLE_ACTION_TYPE.VIEW) {
      this.ckeditorConfig.readOnly = true;
      this.contractTemplateForm.controls.name.disable();
    }
    this.contractTemplateForm.patchValue({
      name: this.contractTemplate?.name,
      content: this.contractTemplate?.content || '',
      statusFlowId: this.contractTemplate?.statusFlow?.id,
      productId: this.contractTemplate?.product?.id,
      isActive: this.contractTemplate?.isActive,
    });
  }

  submitForm() {
    if (this.contractTemplateForm.invalid) {
      return;
    }
    let selectedProduct = this.loanProducts.find((value) => {
      return value.id === this.contractTemplateForm.controls.productId.value;
    });

    if (selectedProduct.contractTemplates) {
      let existContractTemplateActive = false;
      if (this.action === TABLE_ACTION_TYPE.EDIT) {
        existContractTemplateActive = selectedProduct.contractTemplates.find(
          (contractTemplate) => {
            return (
              contractTemplate.isActive &&
              contractTemplate.id != this.contractTemplate?.id
            );
          }
        );
      } else if (this.action === TABLE_ACTION_TYPE.CREATE) {
        existContractTemplateActive = selectedProduct.contractTemplates.find(
          (contractTemplate) => {
            return contractTemplate.isActive;
          }
        );
      }

      if (!existContractTemplateActive) {
        this.dialogRef.close({
          type: BUTTON_TYPE.PRIMARY,
          data: this.contractTemplateForm.getRawValue(),
        });
        return;
      }
    }

    this._confirmChangeContract();
  }

  private _confirmChangeContract() {
    const confirmChangeContractForProductRef =
      this.notificationService.openPrompt({
        imgUrl: 'assets/img/payday-loan/warning-prompt-icon.png',
        title: this.multiLanguageService.instant(
          'system.system_config.contract_template.prompt_update_contract_title'
        ),
        content: this.multiLanguageService.instant(
          'system.system_config.contract_template.prompt_update_contract_content'
        ),
        primaryBtnText: this.multiLanguageService.instant('common.confirm'),
        primaryBtnClass: 'btn-error',
        secondaryBtnText: this.multiLanguageService.instant('common.skip'),
      });
    confirmChangeContractForProductRef.afterClosed().subscribe((result) => {
      if (result === BUTTON_TYPE.PRIMARY) {
        this.dialogRef.close({
          type: BUTTON_TYPE.PRIMARY,
          data: this.contractTemplateForm.getRawValue(),
        });
      }
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
  }

  private _getPropertiesContract() {
    this.subManager.add(
      this.configContractListService
        .getDataPropertiesContract(
          true,
          this.pageIndex + 1,
          this.pageSize,
          'createdAt'
        )
        .subscribe((response: any) => {
          if (
            !response ||
            !response.result ||
            response.responseCode !== RESPONSE_CODE.SUCCESS
          ) {
            return;
          }
          this.dataSource.data = response.result.items.map((element, index) => {
            return { ...element, orderNumber: index + 1 };
          });
          response.result.items;
          this.pageLength = response.result?.meta?.totalPages || 0;
          this.totalItems = response.result?.meta?.totalItems || 0;
        })
    );
  }

  private _getListLoanProducts() {
    this.subManager.add(
      this.configContractListService.getLoanProducts().subscribe((response) => {
        if (
          !response ||
          !response.result ||
          response.responseCode !== RESPONSE_CODE.SUCCESS
        ) {
          return;
        }
        this.loanProducts = response.result;
        this.filteredProducts = this.loanProducts;
        this._getWorkflowStatusesFromProductId(
          this.contractTemplate?.productId
        );
        this.filteredWorkflowStatuses = this.workflowStatuses || [];
      })
    );
  }

  syncPreview(data) {
    this.liveContent = data;
  }

  convertHtmlToPdf(html) {
    let pdf = new jsPDF();
    let specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      },
    };
    // pdf.html(this.liveContent, 15, 15, {
    //     'width': 170,
    //     'elementHandlers':specialElementHandlers
    //   }
    // );
    console.log(pdf);
  }

  onCkeditorChange(data) {
    this.syncPreview(data);
  }

  resizeTableAfterContentChanged() {
    this.setTableResize();
  }

  setTableResize() {
    if (!this.matTableRef) {
      return;
    }
    let tableWidth = this.matTableRef.nativeElement.clientWidth;
    let totWidth = 0;

    let tableColumn: DisplayedFieldsModel[] = [...this.displayColumns];
    tableColumn.forEach((column) => {
      totWidth += column.width;
    });
    const scale = (tableWidth - 5) / totWidth;
    tableColumn.forEach((column) => {
      column.width *= scale;
      this.setColumnWidth(column);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    //debounce resize, wait for resize to finish before doing stuff
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.setTableResize();
    }, 100);
  }

  setColumnWidth(column: DisplayedFieldsModel) {
    const columnEls = Array.from(
      this.matTableRef.nativeElement.getElementsByClassName(
        'mat-column-' + column.key.replace(/\./g, '-')
      )
    );

    columnEls.forEach((el: HTMLDivElement) => {
      el.style.width = column.width + 'px';
    });
  }

  onChangeProduct(productId) {
    this.contractTemplateForm.controls.statusFlowId.setValue(null);
    this.filteredProducts = [];
    this._getWorkflowStatusesFromProductId(productId);
    this.filteredWorkflowStatuses = this.workflowStatuses;
  }

  private _getWorkflowStatusesFromProductId(productId) {
    this.workflowStatuses = [];
    if (!this.loanProducts || !productId) return;
    let selectedProduct = this.loanProducts.find((value) => {
      return value.id === productId;
    });
    if (!selectedProduct) return;
    this.workflowStatuses = selectedProduct.statusGroup?.statusFlows || [];
  }

  ngAfterViewInit(): void {
    this.setTableResize();
  }
}
