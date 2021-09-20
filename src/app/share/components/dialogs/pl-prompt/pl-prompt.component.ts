import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Prompt } from '../../../../public/models/prompt.model';

@Component({
  selector: 'pl-prompt',
  templateUrl: './pl-prompt.component.html',
  styleUrls: ['./pl-prompt.component.scss'],
})
export class PlPromptComponent implements OnInit {
  promptContent: Prompt = {
    title: '',
    content: '',
    secondaryBtnText: '',
    primaryBtnText: '',
    disabledBtn: false,
    imgGroupUrl: null,
    imgUrl: null,
    imgBackgroundClass: null,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Prompt,
    private dialogRef: MatDialogRef<PlPromptComponent>
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
