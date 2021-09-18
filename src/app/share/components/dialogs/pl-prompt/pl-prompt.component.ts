import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'pl-prompt',
  templateUrl: './pl-prompt.component.html',
  styleUrls: ['./pl-prompt.component.scss']
})
export class PlPromptComponent implements OnInit {
  promptContent: any = {
    title: "",
    content: "",
    secondaryBtnText: "",
    primaryBtnText: "",
    disabledBtn: false,
    imgGroupUrl: null,
    imgUrl: null,
    imgBackgroundClass: null
  };

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<PlPromptComponent>) {
    if (data) {
      this.promptContent = data
    }
  }

  ngOnInit(): void {
  }

  clickSecondary() {
    this.dialogRef.close("clickSecondary");
  }

  clickPrimary() {
    this.dialogRef.close("clickPrimary");
  }
}
