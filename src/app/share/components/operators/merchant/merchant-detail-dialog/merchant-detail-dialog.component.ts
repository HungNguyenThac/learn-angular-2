import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MultiLanguageService } from '../../../../translate/multiLanguageService';
import {
  MerchantFeature,
  MerchantSellType,
} from '../../../../../../../open-api-modules/bnpl-api-docs';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import CkEditorAdapters from '../../../../../core/utils/ck-editor-adapters';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Merchant } from '../../../../../../../open-api-modules/dashboard-api-docs';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';
import * as moment from 'moment';

// import * as SourceEditing from '@ckeditor/ckeditor5-source-editing';

@Component({
  selector: 'app-merchant-detail-dialog',
  templateUrl: './merchant-detail-dialog.component.html',
  styleUrls: ['./merchant-detail-dialog.component.scss'],
})
export class MerchantDetailDialogComponent implements OnInit, AfterViewChecked {
  public Editor = DecoupledEditor;
  tabIndex: number = 0;
  merchantInfoForm: FormGroup;
  merchantInfo: Merchant = {};
  dialogTitle = this.multiLanguageService.instant(
    'merchant.merchant_dialog.add_merchant_title'
  );

  allProductTypes: any[] = ['Thời trang', 'Thực phẩm', 'Điện tử'];
  productTypes: any[] = [];
  merchantSellTypes: any[] = [
    {
      value: MerchantSellType.Offline,
      title: this.multiLanguageService.instant(
        'merchant.merchant_sell_type.offline'
      ),
    },
    {
      value: MerchantSellType.Online,
      title: this.multiLanguageService.instant(
        'merchant.merchant_sell_type.online'
      ),
    },
  ];
  merchantFeatures: any[] = [
    {
      value: MerchantFeature.Display,
      title: this.multiLanguageService.instant(
        'merchant.merchant_feature.display'
      ),
    },
    {
      value: MerchantFeature.HotBrand,
      title: this.multiLanguageService.instant(
        'merchant.merchant_feature.hot_brand'
      ),
    },
    {
      value: MerchantFeature.Promotion,
      title: this.multiLanguageService.instant(
        'merchant.merchant_feature.promotion'
      ),
    },
  ];

  bdStaffOptions: any[] = [];
  allMerchant: any[] = [];
  selectStaffCtrl: FormControl = new FormControl();
  selectMerchantCtrl: FormControl = new FormControl();
  productTypeControl: FormControl = new FormControl('', [Validators.required]);
  _onDestroy = new Subject<void>();
  filteredStaffOptions: any[] = [];
  filteredMerchantOptions: any[] = [];
  isCreateMode: boolean = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredProductTypes: Observable<string[]>;

  @ViewChild('productTypeInput') fileTypeInput: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MerchantDetailDialogComponent>,
    private multiLanguageService: MultiLanguageService,
    private formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.buildIndividualForm();
    if (data) {
      this.initDialogData(data);
    }
    this._changeFilterProductType();
  }

  ngOnInit(): void {
    this.selectStaffCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterStaffOptions();
      });

    this.selectMerchantCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMerchantOptions();
      });
  }

  private _changeFilterProductType() {
    this.filteredProductTypes = this.merchantInfoForm.valueChanges.pipe(
      startWith(null),
      map((data) =>
        data ? this._filterProductType(data) : this.allProductTypes.slice()
      )
    );
  }

  filterStaffOptions() {
    let search = this.selectStaffCtrl.value;
    if (!search) {
      this.filteredStaffOptions = this.bdStaffOptions;
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredStaffOptions = this.bdStaffOptions.filter(
      (item) => item.title.toLowerCase().indexOf(search) > -1
    );
  }

  filterMerchantOptions() {
    let search = this.selectMerchantCtrl.value;
    if (!search || !this.allMerchant) {
      this.filteredMerchantOptions = this.allMerchant;
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredMerchantOptions = this.allMerchant.filter(
      (item) => item.title.toLowerCase().indexOf(search) > -1
    );
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ckeditorConfig: any = {
    fontSize: {
      options: [9, 11, 13, 'default', 17, 19, 21],
    },
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

  submitForm() {
    if (this.merchantInfoForm.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.merchantInfoForm.getRawValue(),
    });
  }

  initDialogData(data: any) {
    this.merchantInfo = data?.merchantInfo
      ? JSON.parse(JSON.stringify(data?.merchantInfo))
      : null;
    this.tabIndex = data?.tabIndex;
    this.dialogTitle =
      data?.dialogTitle ||
      this.multiLanguageService.instant(
        'merchant.merchant_dialog.add_merchant_title'
      );
    this.isCreateMode = data?.isCreateMode;
    this.bdStaffOptions = data?.bdStaffOptions;
    this.allMerchant = data?.allMerchant
      ? data?.allMerchant.filter((merchant) => {
          return merchant.value != data?.merchantInfo?.id;
        })
      : [];
    this.productTypes = this.merchantInfo?.productTypes || [];
    this.filterStaffOptions();
    this.filterMerchantOptions();
    this.initMerchantInfoForm();
  }

  private initMerchantInfoForm() {
    this.merchantInfoForm.patchValue({
      id: this.merchantInfo?.id,
      code: this.merchantInfo?.code,
      name: this.merchantInfo?.name,
      address: this.merchantInfo?.address,
      bdStaffId: this.merchantInfo?.bdStaffId,
      merchantSellTypes: this.merchantInfo?.merchantSellTypes || [],
      mobile: this.merchantInfo?.mobile,
      email: this.merchantInfo?.email,
      website: this.merchantInfo?.website,
      identificationNumber: this.merchantInfo?.identificationNumber,
      establishTime: this.merchantInfo?.establishTime
        ? this.formatTimeToDisplay(this.merchantInfo?.establishTime)
        : null,
      productTypes: this.productTypes || [],
      merchantServiceFee: this.merchantInfo?.merchantServiceFee
        ? this.merchantInfo?.merchantServiceFee * 100
        : 0,
      customerServiceFee: this.merchantInfo?.customerServiceFee
        ? this.merchantInfo?.customerServiceFee * 100
        : 0,
      status: this.merchantInfo?.status,
      logo: this.merchantInfo?.logo,
      descriptionImg: this.merchantInfo?.descriptionImg,
      description: this.merchantInfo?.description || null,
      merchantParentId: this.merchantInfo?.merchantParentId,
      merchantFeatures: this.merchantInfo?.merchantFeatures || [],
      managerName: this.merchantInfo?.agentInformation?.name,
      managerPosition: this.merchantInfo?.agentInformation?.position,
      managerMobile: this.merchantInfo?.agentInformation?.mobile,
      managerEmail: this.merchantInfo?.agentInformation?.email,
    });
  }

  buildIndividualForm() {
    this.merchantInfoForm = this.formBuilder.group({
      id: [''],
      code: [''],
      name: [''],
      address: [''],
      bdStaffId: ['', [Validators.required]],
      merchantSellTypes: [''],
      mobile: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      website: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
          ),
        ],
      ],
      identificationNumber: [''],
      establishTime: ['', Validators.required],
      productTypes: this.productTypeControl,
      merchantServiceFee: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      customerServiceFee: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      status: [''],
      logo: ['', Validators.required],
      descriptionImg: ['', Validators.required],
      description: [''],
      merchantParentId: [''],
      managerName: ['', Validators.required],
      managerEmail: ['', [Validators.required, Validators.email]],
      managerMobile: ['', Validators.required],
      managerPosition: ['', Validators.required],
      merchantFeatures: [''],
    });
  }

  changeDescriptionImages(event) {
    this.merchantInfoForm.controls.descriptionImg.setValue(event);
  }

  changeLogo(event) {
    this.merchantInfoForm.controls.logo.setValue(event);
  }

  addFileType(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.productTypes.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.merchantInfoForm.controls.productTypes.setValue(this.productTypes);
  }

  removeProductType(productType: string): void {
    const index = this.productTypes.indexOf(productType);

    if (index >= 0) {
      this.productTypes.splice(index, 1);
    }

    this.merchantInfoForm.controls.productTypes.setValue(this.productTypes);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fileTypeInput.nativeElement.value = '';
    if (this.productTypes && this.productTypes.includes(event.option.viewValue))
      return;

    this.productTypes.push(event.option.viewValue);
    this.merchantInfoForm.controls.productTypes.setValue(this.productTypes);
  }

  private _filterProductType(data: any): string[] {
    const filterValue = data.productTypes;
    return this.allProductTypes.filter(
      (productType) => !filterValue.includes(productType)
    );
  }

  formatTimeToDisplay(time) {
    if (!time) return;
    let formatDate = moment(time, ['DD-MM-YYYY', 'DD/MM/YYYY']).format(
      'YYYY-DD-MM HH:mm:ss'
    );
    return moment(formatDate, 'YYYY-DD-MM').toISOString();
  }
}
