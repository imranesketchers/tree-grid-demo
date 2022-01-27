import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldBase } from '../models/field-base';
import { FieldControlService } from '../services/field-control.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {
  dataField!: FieldBase<string>;
  dataFields: FieldBase<string>[] | null = [];
  form!: FormGroup;
  payLoad = '';
  public taskForm!: FormGroup;

  constructor(private fcs: FieldControlService) {
    fcs.getColumnFields().subscribe((allFields) => {
      this.dataFields = allFields;
      this.form = this.fcs.toFormGroup(allFields as FieldBase<string>[]);
    });
  }

  ngOnInit(): void {
    console.log(this.form);
  }

  get isValid() {
    return this.form.controls[this.dataField.key].valid;
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }

  dateValidator() {
      return (control: FormControl): null | Object  => {
          return control.value && control.value.getFullYear &&
          (1900 <= control.value.getFullYear() && control.value.getFullYear() <=  2099) ? null : { OrderDate: { value : control.value}};
      };
  }

// actionBegin(args: SaveEventArgs): void {
//     if (args.requestType === 'beginEdit' || args.requestType === 'add') {
//         this.submitClicked = false;
//         this.taskForm = this.createFormGroup(args.rowData);
//     }
//     if (args.requestType === 'save') {
//         this.submitClicked = true;
//         if (this.taskForm.valid) {
//             args.data = this.taskForm.value;
//         } else {
//             args.cancel = true;
//         }
//     }
// }

// actionComplete(args: DialogEditEventArgs): void {
//     if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
//         if (Browser.isDevice) {
//             args.dialog.height = window.innerHeight - 90 + 'px';
//             (<Dialog>args.dialog).dataBind();
//         }
//         // Set initail Focus
//         if (args.requestType === 'beginEdit') {
//             (args.form.elements.namedItem('taskName') as HTMLInputElement).focus();
//         } else if (args.requestType === 'add') {
//             (args.form.elements.namedItem('taskID') as HTMLInputElement).focus();
//         }
//     }
// }

}
