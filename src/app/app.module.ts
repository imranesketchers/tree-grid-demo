import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  TreeGridModule,
  PageService,
  SortService,
  FilterService,
  EditService,
  ToolbarService,
  ResizeService,
  ContextMenuService,
} from '@syncfusion/ej2-angular-treegrid';
import { AppComponent } from './app.component';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { HttpClientModule } from '@angular/common/http';
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldControlService } from './services/field-control.service';

/**
 * Module
 */
@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    TreeGridModule,
    ButtonModule,
    DropDownListAllModule,
    HttpClientModule,
    ContextMenuModule,
    DialogModule,
  ],
  declarations: [AppComponent, DynamicFormComponent],
  bootstrap: [AppComponent],
  providers: [
    PageService,
    SortService,
    FilterService,
    EditService,
    ResizeService,
    ContextMenuService,
    ToolbarService,
    FieldControlService,
  ],
})
export class AppModule {}
