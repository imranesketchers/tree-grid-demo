import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { FieldBase } from '../models/field-base';
import { DropdownField } from '../models/field-dropdown';
import { TextboxField } from '../models/field-textbox';


@Injectable()
export class FieldControlService {
  constructor() { }

  toFormGroup(fields: FieldBase<string>[] ) {
    const group: any = {};

    fields.forEach(field => {
      group[field.key] = field.required ? new FormControl(field.value || '', Validators.required)
                                              : new FormControl(field.value || '');
    });
    return new FormGroup(group);
  }

  getColumnFields() {

    const dataFields: FieldBase<string>[] = [

      new TextboxField({
        key: 'columnName',
        label: 'Column name',
        required: true,
        order: 1
      }),

      new DropdownField({
        key: 'dataType',
        label: 'Data Type',
        options: [
          {text: 'text',  value: 'Text'},
          {text: 'number',  value: 'Number'},
          {text: 'date',   value: 'Date'},
          {text: 'boolean', value: 'Boolean'},
          {text: 'dropdown', value: 'DropDownList'}
        ],
        required: true,
        order: 2
      }),
      new TextboxField({
        key: 'defaultValue',
        label: 'Default value',
        required: true,
        order: 3
      }),
      new TextboxField({
        key: 'minimumColumnWidth',
        label: 'Minimum column width',
        value: '90',
        type: 'number',
        required: true,
        order: 4
      }),

      new TextboxField({
        key: 'fontSize',
        label: 'Font size',
        value: '11',
        type: 'number',
        required: false,
        order: 5
      }),

      new TextboxField({
        key: 'fontColor',
        label: 'Font color',
        required: false,
        order: 6
      }),
      new TextboxField({
        key: 'backgroundColor',
        label: 'Background color',
        required: false,
        order: 7
      }),
      new TextboxField({
        key: 'alignment',
        label: 'Alignment',
        required: false,
        order: 8
      }),
      new TextboxField({
        key: 'textWrap',
        label: 'Text wrap',
        type: 'boolean',
        order: 9
      })
    ];

    return of(dataFields.sort((a, b) => a.order - b.order));
  }

}
