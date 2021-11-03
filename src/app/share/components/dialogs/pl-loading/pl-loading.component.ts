import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {PlLoading} from "../../../../public/models/external/plloading.model";

@Component({
  selector: 'app-pl-loading',
  templateUrl: './pl-loading.component.html',
  styleUrls: ['./pl-loading.component.scss'],
})
export class PlLoadingComponent implements OnInit {
  promptContent: PlLoading = {
    title: '',
    content: '',
    showContent: false
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: PlLoading,
    private dialogRef: MatDialogRef<PlLoadingComponent>
  ) {
    dialogRef.disableClose = true;
    if (data) {
      this.promptContent = data;
    }
  }

  ngOnInit(): void {}

  clickSecondary() {
    this.dialogRef.close('clickSecondary');
  }

  clickPrimary() {
    this.dialogRef.close('clickPrimary');
  }
}
