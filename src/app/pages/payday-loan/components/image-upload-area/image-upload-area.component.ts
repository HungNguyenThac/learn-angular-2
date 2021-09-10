import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'image-upload-area',
  templateUrl: './image-upload-area.component.html',
  styleUrls: ['./image-upload-area.component.scss']
})
export class ImageUploadAreaComponent implements OnInit, AfterViewInit {
  @Input() initValue: string;
  @Input() placeholderImageSrc: string;
  @Input() filledTitle: string;
  @Input() uploadHint: string;
  @Input() uploadTitle: string;
  @Input() required: boolean = false;
  @Input() isManualUploadFile: boolean = false;
  @Input() name: string = "image-upload-area";
  @Input() acceptFileType: string = "image/png, image/jpeg, image/jpg, application/pdf, application/zip,application/x-zip,application/x-zip-compressed, application/x-rar-compressed, application/octet-stream";
  @Input() rules: string;
  @Input() id: string;
  @Input() disabled: boolean = false;

  _imageSrc: any;
  get imageSrc(): any {
    return this._imageSrc;
  }

  @Input() set imageSrc(newVal: any) {
    if (!newVal) {
      this.triggerClickResetInput();
      this.file = null;
    }
    this.image = newVal;
    this._imageSrc = newVal;
  }


  _file: any;
  get file(): any {
    return this._file;
  }

  set file(newVal: any) {
    if (this.isManualUploadFile && newVal && newVal["name"]) {
      this.fileName = this.fileNameAndExt(newVal["name"])[0];
      this.fileType = this.fileNameAndExt(newVal["name"])[1];
    }
    this._file = newVal;
  }


  @Output() receiveResult = new EventEmitter<any>();
  @Output() changeImage = new EventEmitter<string>();
  @Output() uploadImage = new EventEmitter<string>();


  image: any = null;
  fileName: string = "";
  fileType: string = "";

  constructor() {
  }

  ngOnInit(): void {
  }


  initImgSrc(value): void {
    if (!value) {
      this.triggerClickResetInput();
      this.file = null;
    }
    this.image = value;
    if (!this.isManualUploadFile || !value || this.isBase64(value)) {
      return;
    }

    this.urltoFile(
      value,
      this.getFilename(value),
      this.getUrlExtension(value)
    ).then(file => {
      this.file = file;
    });
  }

  isBase64(encodedString) {
    var regexBase64 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return regexBase64.test(encodedString);   // return TRUE if its base64 string.
  }

  uploadImg(): void {
    if (this.isManualUploadFile) {
      this.triggerClickUploadImg();
    }

    this.uploadImage.emit("uploadImage");
  }

  triggerClickUploadImg(): void {
    let manualUploadInput: HTMLElement = document.getElementById(`manual-upload-input-${this.id}`) as HTMLElement
    if (!manualUploadInput) return;
    manualUploadInput.click();
  }

  triggerClickResetInput(): void {
    let resetInput: HTMLElement = document.getElementById(`reset-manual-upload-input-${this.id}`) as HTMLElement
    if (!resetInput) return;
    resetInput.click();
  }

  changeImageSrc(): void {
    if (this.isManualUploadFile) {
      this.triggerClickUploadImg();
    }
    this.changeImage.emit("changeImage");
  }

  onFileChange(e): void {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    this.getValidFile(files[0]);
  }

  createImage(file): void {
    let reader = new FileReader();
    reader.onload = e => {
      this.image = e.target.result;
      this.receiveResult.emit({
        imgSrc: this.image,
        file: file
      });
    };
    reader.readAsDataURL(file);
  }

  getFilename(url) {
    if (url) {
      var m = url.toString().match(/.*\/(.+?)\./);
      if (m && m.length > 1) {
        return m[1];
      }
    }
    return "";
  }

  getUrlExtension(url) {
    if (!url) return "";
    return url
      .split(/[#?]/)[0]
      .split(".")
      .pop()
      .trim();
  }

  fileNameAndExt(str) {
    if (!str) return [];
    let file = str.split("/").pop();
    return [
      file.substr(0, file.lastIndexOf(".")),
      file.substr(file.lastIndexOf(".") + 1, file.length)
    ];
  }

  urltoFile(url, filename, mimeType) {
    return fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, {type: mimeType});
      })
      .catch(e => {
        // Sentry.captureException(e);
      });
  }

  getValidFile(file) {
    if (!(file instanceof File)) {
      return null;
    }
    this.file = file;
    this.createImage(file);
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  }

  ngAfterViewInit(): void {
    this.initImgSrc(this.imageSrc);
  }

}
