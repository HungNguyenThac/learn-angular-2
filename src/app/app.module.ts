import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { OpenApiModule } from './share/modules/open-api.module';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './layout/header/header.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { BlankComponent } from './layout/blank/blank.component';
import { SharedModule } from './share/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainLayoutComponent,
    NotFoundComponent,
    BlankComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    OpenApiModule,
    SharedModule,
    FlexLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
