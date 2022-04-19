import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../../../../../core/services/notification.service';
import * as PDFObject from 'pdfobject';
import { ContractTemplate } from '../../../../../../../../open-api-modules/dashboard-api-docs';
import * as htmlToPdfmake from 'html-to-pdfmake';
import pdfmake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// @ts-ignore
import pdfFonts from '../../../../../../public/vfs_fonts/vfs_custom_fonts';
pdfmake.vfs = pdfFonts.pdfMake.vfs;

pdfmake.fonts = {
  // Default font should still be available
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Bold.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-BoldItalic.ttf',
  },
  // Make sure you define all 4 components - normal, bold, italics, bolditalics - (even if they all point to the same font file)
  Arial: {
    normal: 'arial.ttf',
    bold: 'arialbd.ttf',
    italics: 'ariali.ttf',
    bolditalics: 'arialbi.ttf',
  },
  TimesNewRoman: {
    normal: 'times.ttf',
    bold: 'timesbd.ttf',
    italics: 'timesi.ttf',
    bolditalics: 'timesbi.ttf',
  },
  Calibri: {
    normal: 'calibri.ttf',
    bold: 'calibrib.ttf',
    italics: 'calibrii.ttf',
    bolditalics: 'calibriz.ttf',
  },
};

@Component({
  selector: 'app-config-contract-save-dialog',
  templateUrl: './config-contract-save-dialog.component.html',
  styleUrls: ['./config-contract-save-dialog.component.scss'],
})
export class ConfigContractSaveDialogComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable, { read: ElementRef }) private matTableRef: ElementRef;
  contractTemplateForm: FormGroup;
  title: string;
  contractTemplate: ContractTemplate;
  action: TABLE_ACTION_TYPE;
  workflowStatuses: any[];
  loanProducts: any[];

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
  timeout: any;
  docPdf: any;

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
      width: 100,
    },
    {
      key: 'description',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_property.description'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
      width: 100,
    },
    {
      key: 'code',
      title: this.multiLanguageService.instant(
        'system.system_config.contract_property.code'
      ),
      type: DATA_CELL_TYPE.TEXT,
      format: null,
      showed: true,
      width: 100,
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
    font_names: 'Arial;Times New Roman;Roboto;',
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

    this.convertHtmlToPdf(this.contractTemplate?.content || '');
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
          this.contractTemplate?.product?.id
        );
        this.filteredWorkflowStatuses = this.workflowStatuses || [];
      })
    );
  }

  convertHtmlToPdf(data) {
    // let doc = new jsPDF('p', 'pt', 'a4');
    // const specialElementHandlers = {
    //   '#editor': function (element, renderer) {
    //     return true;
    //   },
    // };
    //
    // doc.fromHTML('<p>đạt</p>', 15, 15, {
    //   width: 190,
    //   elementHandlers: specialElementHandlers,
    // });

    this.docPdf = this.pdfMakeHtmlToPdf(data);

    setTimeout(() => {
      if (typeof this.docPdf !== 'undefined')
        try {
          if (
            navigator.appVersion.indexOf('MSIE') !== -1 ||
            navigator.appVersion.indexOf('Edge') !== -1 ||
            navigator.appVersion.indexOf('Trident') !== -1
          ) {
            let options = {
              pdfOpenParams: {
                navpanes: 0,
                toolbar: 0,
                statusbar: 0,
                view: 'FitV',
              },
              forcePDFJS: true,
              PDFJS_URL: 'examples/PDF.js/web/viewer.html',
            };

            this.docPdf.getBlob(function (dataURL) {
              PDFObject.embed(dataURL, '#preview-pane', options);
            });
            // PDFObject.embed(doc.output("bloburl"), "#preview-pane", options);
          } else {
            this.docPdf.getDataUrl(function (dataURL) {
              PDFObject.embed(dataURL, '#preview-pane');
            });

            // PDFObject.embed(doc.output("datauristring"), "#preview-pane");
          }
        } catch (e) {
          alert('Error ' + e);
        }
    }, 0);
  }

  /**
   * Sync preview after 3s ckeditor changed
   * @param data
   */
  onCkeditorChange(data) {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.convertHtmlToPdf(data);
    }, 3000);
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

  pdfMakeHtmlToPdf(data) {
    let val = htmlToPdfmake(data);
    let pdfData = { content: val };
    return pdfmake.createPdf(pdfData);
  }

  openPdfPreviewNewTab() {
    this.docPdf.open();
  }
}
