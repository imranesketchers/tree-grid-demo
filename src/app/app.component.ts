import { Component, OnInit, ViewChild } from '@angular/core';
import {
  TreeGrid, Page ,
  VirtualScrollService,
  TreeGridComponent,
  DataStateChangeEventArgs,
  ColumnChooserService,
  ToolbarService,
  ColumnMenuService,
} from '@syncfusion/ej2-angular-treegrid';
import {
  ContextMenuService,
  EditService,
  SortService,
  ResizeService,
  SortEventArgs,
} from '@syncfusion/ej2-angular-grids';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-inputs';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { Observable } from 'rxjs';
import { TaskStoreService } from './services/task-store.service';
import {
  ButtonPropsModel,
  DialogComponent,
} from '@syncfusion/ej2-angular-popups';
import { DataManager, WebApiAdaptor, UrlAdaptor } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  providers: [
    VirtualScrollService,
    ContextMenuService,
    EditService,
    SortService,
    ResizeService,
    ColumnChooserService,
    ToolbarService,
    ColumnMenuService
  ],
})
export class AppComponent implements OnInit {
  // public data: Object[] = [{}];


  public data!: DataManager;

  public editSettings: object = {};
  public filterSettings!: Object;
  public pageSettings: Object = {};
  public sortSettings!: Object;
  public contextMenuItems: any = [];
  public toolbar: string[] = [];
  public selectionType: string = 'Single';
  // dialog box
  @ViewChild('edit_dialog')
  public editDialog!: DialogComponent;
  public visible: Boolean = false;
  public promptDlgBtnClick = (): void => {
    this.editDialog.hide();
  };
  public alertDlgButtons: ButtonPropsModel[] = [
    {
      click: this.promptDlgBtnClick.bind(this),
      buttonModel: { content: 'Save', isPrimary: true },
    },
    {
      click: this.promptDlgBtnClick.bind(this),
      buttonModel: { content: 'Cancel' },
    },
  ];
  public contextMenuRowItems = [
    { text: 'Add Next', target: '.e-content', id: 'next' },
    { text: 'Add Child', target: '.e-content', id: 'child' },
    { text: 'Multi Select', target: '.e-content', id: 'multi' },
    { text: 'Copy Rows', target: '.e-content', id: 'copy' },
    { text: 'Cut Rows', target: '.e-content', id: 'cut' },
    { text: 'Paste Next', target: '.e-content', id: 'paste-next' },
    { text: 'Paste Child', target: '.e-content', id: 'paste-child' },
    'SortAscending',
    'SortDescending',
    'Edit',
    'Delete',
    'Filter',
    'PdfExport', 'ExcelExport', 'CsvExport',
  ];
  public treegridColumns: any = [];

  public headermenuItems = [
    {
      iconCss: 'e-icons e-edit',
      text: 'Edit Column',
      target: '.e-headercontent',
      id: 'edit',
    },
    {
      iconCss: 'e-icons e-icon-new',
      text: 'New Column',
      target: '.e-headercontent',
      id: 'new',
    },
    {
      iconCss: 'e-icons e-delete',
      text: 'Delete Column',
      target: '.e-headercontent',
      id: 'delete',
    },
    {
      iconCss: 'e-icons e-icon-edit',
      text: 'Choose Column',
      target: '.e-headercontent',
      id: 'choose',
    },
    {
      iconCss: 'e-icons e-icon-filter',
      text: 'Freeze Column',
      target: '.e-headercontent',
      id: 'column_freeze',
    },
    { iconCss: 'e-icons e-icon-caret',
      text: 'Filter Column', target: '.e-headercontent', id: 'column_filter' },
    { iconCss: 'e-icons e-icon-caret',
     text: 'Multi-Sort', target: '.e-headercontent', id: 'multi_sort' },
    'Filter',
    'ColumnChooser',
  ];

  @ViewChild('treegrid')
  //@ts-ignore
  public treeGridObj: TreeGridComponent;

  // public tasks: Observable<DataStateChangeEventArgs>;

  constructor(private TaskService: TaskStoreService) {
    // this.tasks = TaskService;
  }

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.TaskService.execute(state);
  }

  async ngOnInit(): Promise<void> {
    this.data = new DataManager({
      url: "https://236c-110-36-226-234.ngrok.io/api/tasks",
      // url: "https://ej2services.syncfusion.com/production/web-services/api/SelfReferenceData",
      updateUrl: "https://236c-110-36-226-234.ngrok.io/api/update",
      insertUrl: "Home/Insert",
      removeUrl: "Home/Delete",
      batchUrl: "Home/Remove",
      adaptor: new WebApiAdaptor,
      // adaptor: new UrlAdaptor,
      crossDomain: true,
      // offline: true
    });

    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Row',
      showConfirmDialog: true,
      showDeleteConfirmDialog: true,
    };
    // this.sortSettings =  { columns: [{ field: 'taskID', direction: 'Ascending'  },
    //   { field: 'taskName', direction: 'Ascending' }]
    // }
    // this.filterSettings = { type: 'Menu'};
    // this.toolbar = ['ColumnChooser', 'Delete'];
    // this.contextMenuItems = this.contextMenuRowItems;
    // this.pageSettings = { pageSize: 12, pageSizeMode: 'Root' };
    // const state: any = { skip: 0, take: 1 };
    await this.TaskService.getTasksTableConfigurations().subscribe((data: any) => {
      data.result.map((column: any) => {
        let conf = {
          field: column.field,
          isPrimaryKey: column.is_primary,
          headerText: column.name,
          width: column.width,
          type: column.type,
          displayAsCheckBox: column.type === 'Boolean',
        };
        this.treegridColumns.push(conf);
      });
    });
    // debugger
    // this.TaskService.execute(state);
  }

  public sort (args: SortEventArgs ): void {
    if (args.requestType === 'sorting') {
        for (let columns of this.treeGridObj.getColumns()) {
            for (let sortcolumns of this.treeGridObj.sortSettings.columns!) {
                if (sortcolumns.field === columns.field) {
                    // this.check(sortcolumns.field, true); break;
                } else {
                    // this.check(columns.field, false);
                    // this.treegrid.grid.removeSortColumn('units');
                    // this.treegrid.sortByColumn('orderDate', 'Ascending', true);
                }
            }
        }
    }

  }

  contextMenuClick(args?: MenuEventArgs): void {
    console.log('contextMenuClick', args);
    // this.treeGridObj.getColumnByField('taskID');
    // debugger;
    // if (args?.item.id === 'collapserow') {
    //   this.treeGridObj.collapseRow(
    //     <HTMLTableRowElement>this.treeGridObj.getSelectedRows()[0]
    //   );
    // } else {
    //   this.treeGridObj.expandRow(
    //     <HTMLTableRowElement>this.treeGridObj.getSelectedRows()[0]
    //   );
    // }
  }

  contextMenuOpen(arg: BeforeOpenCloseEventArgs): void {
    console.log('contextMenuOpen', arg);
  }

  columnContextMenuOpen(args: any): void {
    console.log('columnContextMenuOpen', args);
    //handle selection of context menu items here
    if (args.item.properties.id === 'edit') {
      this.editDialog.show();
    }
  }

  rowContextMenuOpen(arg: BeforeOpenCloseEventArgs): void {
    console.log('rowContextMenuOpen', arg);
  }

  rowContextMenuClick(args: MenuEventArgs): void {
    console.log('rowContextMenuClick', args);
    if (args.item.id === 'next') {
      this.treeGridObj.addRecord(
        this.treeGridObj.getSelectedRecords()[0],
        undefined,
        'Below'
      );
    }
    // if (args.item.id === 'child') {
    //   //@ts-ignore
    //   this.treeGridObj.addRecord(this.treeGridObj.getSelectedRecords()[0], 'Child');
    // }
    if (args.item.id === 'multi') {
      this.multiSelectToggle();
    }
    if (args.item.id === 'copy') {
      this.treeGridObj.copy();
    }
    // if (args.item.id === 'cut') {
    //   this.treeGridObj.cut();
    // }
    // if (args.item.id === 'paste-next') {
    //   this.treeGridObj.paste('Next');
    // }
    // if (args.item.id === 'paste-child') {
    //   this.treeGridObj.paste('Child');
    // }
  }

  multiSelectToggle(): void {
    if (this.selectionType == 'Multiple') {
      this.selectionType = 'Single';
      this.treeGridObj.selectionSettings.type = 'Single';
      return;
    }
    this.selectionType = 'Multiple';
    this.treeGridObj.selectionSettings.type = 'Multiple';
  }
}
