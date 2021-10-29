import { Injectable } from '@angular/core';
import {
  InfoControllerService,
  UpdateInfoRequest,
} from 'open-api-modules/customer-api-docs';
import { FileControllerService } from '../../../../../../open-api-modules/com-api-docs';
import { CustomerControllerService } from '../../../../../../open-api-modules/dashboard-api-docs';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerDetailService {
  constructor(
    private customerControllerService: CustomerControllerService,
    private fileControllerService: FileControllerService,
    private customerService: InfoControllerService,
    private domSanitizer: DomSanitizer
  ) {}

  public getById(id) {
    return this.customerControllerService.getCustomerById(id).pipe(
      map((results) => {
        return results;
      }),

      catchError((err) => {
        throw err;
      })
    );
  }

  public returnCustomerToConfirmInformationPage(customerId: string) {
    return this.customerService.returnConfirmInformation(customerId).pipe(
      map((results) => {
        return results;
      }),

      catchError((err) => {
        throw err;
      })
    );
  }

  public downloadSingleFileDocument(customerId: string, documentPath: string) {
    return this.fileControllerService
      .downloadFile({ customerId, documentPath })
      .pipe(
        map((results) => {
          const imageUrl = this.convertBlobType(results, 'application/image');
          return this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
        }),
        // catch errors
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  public convertBlobType(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    return url;
  }

  public downloadFileDocument(customerId: string, documentPath: string) {
    return this.fileControllerService
      .downloadFile({ customerId, documentPath })
      .pipe(
        map((results) => {
          let imageType = documentPath.split('.').pop();
          if (imageType === 'jpg') {
            imageType = 'jpeg';
          }
          const imageUrl = this.convertBlobType(results, `image/${imageType}`);
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('href', imageUrl);
          a.setAttribute('download', imageUrl.split('/').pop());
          document.body.appendChild(a);
          a.click();
          a.remove();
        }),
        // catch errors
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  public uploadFileDocument(document_type: string, file, customerId: string) {
    console.log(
      'document_type, file, customerId',
      document_type,
      file,
      customerId
    );

    return this.fileControllerService
      .uploadSingleFile(document_type, file, customerId)
      .pipe(
        map((results) => {
          console.log('upload ok', results);
          return results;
        }),
        // catch errors
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      );
  }

  public updateCustomerInfo(customerId: string, updateInfoRequest: Object) {
    const infoData: UpdateInfoRequest = {
      info: {},
    };
    for (const key in updateInfoRequest) {
      if (updateInfoRequest[key] === null) {
        infoData.info[`personalData.${key}`] = null;
      } else {
        infoData.info[`personalData.${key}`] = new Object(
          updateInfoRequest[key]
        );
      }
    }
    console.log('infoData', infoData);
    return this.customerService.putInfo(customerId, infoData).pipe(
      map((results) => {
        console.log('update ok', results);
        return results;
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    );
  }

  public updateCustomerFinalcialData(
    customerId: string,
    updateInfoRequest: Object
  ) {
    const infoData: UpdateInfoRequest = {
      info: {},
    };
    for (const key in updateInfoRequest) {
      if (updateInfoRequest[key] === null) {
        infoData.info[`financialData.${key}`] = null;
      } else {
        infoData.info[`financialData.${key}`] = new Object(
          updateInfoRequest[key]
        );
      }
    }
    return this.customerService.putInfo(customerId, infoData).pipe(
      map((results) => {
        return results;
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    );
  }
}
