import {NgModule, Optional, SkipSelf} from "@angular/core";
import {CommonModule} from "@angular/common";

import {CoreStoreModule} from "./store";

import {throwIfAlreadyLoaded} from "./common/module-import-guard";

@NgModule({
    imports: [
        CommonModule,
        CoreStoreModule
    ],
    providers: [
    ],
    declarations: [],
    exports: []
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
