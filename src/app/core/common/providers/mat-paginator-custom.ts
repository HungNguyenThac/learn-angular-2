import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MultiLanguageService } from '../../../share/translate/multiLanguageService';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  itemsPerPageLabel = 'Số dòng một trang';
  firstPageLabel = 'First page';
  lastPageLabel = 'Last page';
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';

  constructor(private translate: MultiLanguageService) {
    super();
    this.translateLabels();
  }

  getRangeLabel = (page, pageSize, length) => {
    if (length === 0 || pageSize === 0) {
      return this.translate.instant('mat_paginator_intl.range_label', {
        range: '0',
        total: length,
      });
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return this.translate.instant('mat_paginator_intl.range_label', {
      range: `${startIndex + 1} - ${endIndex}`,
      total: length,
    });
  };

  injectTranslateService(translate: MultiLanguageService) {
    this.translate = translate;

    this.translate.onLangChange.subscribe(() => {
      this.translateLabels();
    });

    this.translateLabels();
  }

  translateLabels() {
    this.itemsPerPageLabel = this.translate.instant(
      'mat_paginator_intl.items_per_page'
    );
    this.firstPageLabel = this.translate.instant(
      'mat_paginator_intl.first_page'
    );
    this.lastPageLabel = this.translate.instant('mat_paginator_intl.last_page');
    this.nextPageLabel = this.translate.instant('mat_paginator_intl.next_page');
    this.previousPageLabel = this.translate.instant(
      'mat_paginator_intl.previous_page'
    );
  }
}
