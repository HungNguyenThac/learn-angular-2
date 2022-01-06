import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MultiLanguageService} from '../../../../translate/multiLanguageService';
import {BUTTON_TYPE} from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-merchant-detail-dialog',
  templateUrl: './merchant-detail-dialog.component.html',
  styleUrls: ['./merchant-detail-dialog.component.scss'],
})
export class MerchantDetailDialogComponent implements OnInit, AfterViewChecked {
  tabIndex: number = 0;
  merchantInfoForm: FormGroup;
  merchantInfo;
  dialogTitle = this.multiLanguageService.instant(
    'merchant.merchant_dialog.add_merchant_title'
  );
  typeOptions: any[] = [
    {
      id: 1,
      name: 'Tại cửa hàng',
    },
    {
      id: 2,
      name: 'Trực tuyến',
    },
  ];
  showOptions: any[] = [
    {
      id: 1,
      name: 'Hiển thị',
    },
    {
      id: 2,
      name: 'Hot Brand',
    },
    {
      id: 2,
      name: 'Promotion',
    },
  ];
  products: any[] = [
    {
      id: 1,
      name: 'Thực phẩm',
    },
    {
      id: 2,
      name: 'Thời trang',
    },
    {
      id: 3,
      name: 'Điện tử',
    },
    {
      id: 4,
      name: 'Bảo hiểm',
    },
  ];
  managers: any[] = [
    {
      id: 1,
      name: 'user1',
    },
    {
      id: 2,
      name: 'user2',
    },
    {
      id: 3,
      name: 'user3',
    },
  ];

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
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
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
    console.log('iashodhasodoas', data.merchantInfo);
    this.merchantInfo = data?.merchantInfo;
    this.tabIndex = data?.tabIndex;
    this.dialogTitle = data?.dialogTitle;

    this.merchantInfoForm.patchValue({
      id: this.merchantInfo?.id,
      code: this.merchantInfo?.code,
      name: this.merchantInfo?.name,
      address: this.merchantInfo?.address,
      ward: this.merchantInfo?.ward,
      district: this.merchantInfo?.district,
      province: this.merchantInfo?.province,
      bdStaffId: this.merchantInfo?.bdStaffId,
      sellTypes: this.merchantInfo?.sellTypes
        ? this.merchantInfo?.sellTypes
        : '',
      mobile: this.merchantInfo?.mobile,
      email: this.merchantInfo?.email,
      website: this.merchantInfo?.website,
      identificationNumber: this.merchantInfo?.identificationNumber,
      establishTime: this.merchantInfo?.establishTime,
      productTypes: this.merchantInfo?.productTypes
        ? this.merchantInfo?.productTypes
        : '',
      merchantServiceFee: this.merchantInfo?.merchantServiceFee,
      customerServiceFee: this.merchantInfo?.customerServiceFee,
      status: this.merchantInfo?.status,
      logo: this.merchantInfo?.logo,
      descriptionImg: this.merchantInfo?.descriptionImg,
      description: this.merchantInfo?.description,
    });
  }

  buildIndividualForm() {
    this.merchantInfoForm = this.formBuilder.group({
      id: [''],
      code: [''],
      name: [''],
      address: [''],
      ward: [''],
      district: [''],
      province: [''],
      bdStaffId: [''],
      sellTypes: [''],
      mobile: [''],
      email: [''],
      website: [''],
      identificationNumber: [''],
      establishTime: [''],
      productTypes: [''],
      merchantServiceFee: [''],
      customerServiceFee: [''],
      status: [''],
      logo: [''],
      descriptionImg: [''],
      description: [''],
    });
  }
}
