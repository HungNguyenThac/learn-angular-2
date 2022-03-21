import {
  Component,
  ElementRef,
  Inject,
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
import { BUTTON_TYPE } from '../../../../../../core/common/enum/operator';
import { ApplicationDocument } from '../../../../../../../../open-api-modules/com-api-docs';
import { ApplicationDocumentType } from '../../../../../../../../open-api-modules/dashboard-api-docs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, Subject } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-application-document-save-dialog',
  templateUrl: './application-document-save-dialog.component.html',
  styleUrls: ['./application-document-save-dialog.component.scss'],
})
export class ApplicationDocumentSaveDialogComponent implements OnInit {
  applicationDocumentForm: FormGroup;
  title: string;
  applicationDocument: ApplicationDocument;
  applicationDocumentTypeOptions: ApplicationDocumentType[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredFileTypes: Observable<string[]>;
  fileTypes: string[] = [];
  allFileTypes: string[] = [
    '.jpg',
    '.png',
    '.jpeg',
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
  ];

  @ViewChild('fileTypeInput') fileTypeInput: ElementRef<HTMLInputElement>;
  fileTypeControl = new FormControl('', [Validators.required]);
  selectSearchCtrl: FormControl = new FormControl();
  _onDestroy = new Subject<void>();
  filteredDocumentTypeItems: ApplicationDocumentType[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ApplicationDocumentSaveDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
    if (data) {
      this.initDialogData(data);
    }
    this._changeFilterFileType();
  }

  private _changeFilterFileType() {
    this.filteredFileTypes = this.applicationDocumentForm.valueChanges.pipe(
      startWith(null),
      map((data) =>
        data ? this._filterFileType(data) : this.allFileTypes.slice()
      )
    );
  }

  ngOnInit(): void {
    this.selectSearchCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSelectOptions();
      });
  }

  filterSelectOptions() {
    let search = this.selectSearchCtrl.value;
    if (!search) {
      this.filteredDocumentTypeItems = this.applicationDocumentTypeOptions;
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredDocumentTypeItems = this.applicationDocumentTypeOptions.filter(
      (item) => item.name.toLowerCase().indexOf(search) > -1
    );
  }

  buildForm() {
    this.applicationDocumentForm = this.formBuilder.group({
      name: [''],
      description: [''],
      fileType: this.fileTypeControl,
      applicationDocumentType: [''],
    });
  }

  initDialogData(data) {
    this.title = data?.title;
    this.applicationDocumentTypeOptions = data?.applicationDocumentTypeOptions;
    this.applicationDocument = data?.element;
    this.fileTypes = this.applicationDocument?.fileType.split(',') || [];

    this.applicationDocumentForm.patchValue({
      name: this.applicationDocument?.name,
      description: this.applicationDocument?.description,
      fileType: this.fileTypes,
      applicationDocumentType:
        this.applicationDocument?.applicationDocumentType,
    });

    this.filterSelectOptions();
  }

  submitForm() {
    if (this.applicationDocumentForm.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.applicationDocumentForm.getRawValue(),
    });
  }

  addFileType(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fileTypes.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.applicationDocumentForm.controls.fileType.setValue(this.fileTypes);
  }

  removeFileType(fileType: string): void {
    const index = this.fileTypes.indexOf(fileType);

    if (index >= 0) {
      this.fileTypes.splice(index, 1);
    }

    this.applicationDocumentForm.controls.fileType.setValue(this.fileTypes);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fileTypeInput.nativeElement.value = '';
    if (this.fileTypes && this.fileTypes.includes(event.option.viewValue))
      return;

    this.fileTypes.push(event.option.viewValue);
    this.applicationDocumentForm.controls.fileType.setValue(this.fileTypes);
  }

  private _filterFileType(data: any): string[] {
    const filterValue = data.fileType;
    return this.allFileTypes.filter(
      (fileType) => !filterValue.includes(fileType)
    );
  }
}
