import { Component, OnInit, ViewChild } from '@angular/core';
import {
  VirtualScrollService,
  TreeGridComponent,
  DataStateChangeEventArgs,
  ColumnChooserService,
  ToolbarService,
  ColumnMenuService,
  FilterService,
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
    ColumnMenuService,
    FilterService,
  ],
})
export class AppComponent implements OnInit {
  // public data: Object[] = [{}];

  public data!: DataManager;

  public selectedColumnId: string = '';
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
    // { text: 'Paste', target: '.e-content', id: 'paste-row', items:[
    //   { text: 'Paste Next', id: 'paste-next' },
    //   { text: 'Paste Child', id: 'paste-child' },
    // ] },
    'SortAscending',
    'SortDescending',
    'Edit',
    'Delete',
  ];
  public treegridColumns!: any[];

  public headermenuItems = [
    {
      iconCss: 'e-icons e-edit',
      // separator: true,
      text: 'Edit Column',
      target: '.e-headercontent',
      id: 'editColumn',
    },
    {
      iconCss: 'e-icons e-edit',
      // separator: true,
      text: 'New Column',
      target: '.e-headercontent',
      id: 'newColumn',
    },
    {
      iconCss: 'e-icons e-remove',
      // separator: true,
      text: 'Delete Column',
      target: '.e-headercontent',
      id: 'deleteColumn',
    },
    {
      iconCss: 'e-icons e-filter',
      // separator: true,
      text: 'Choose Column',
      target: '.e-headercontent',
      id: 'chooseColumn',
    },
    {
      iconCss: 'e-icons e-edit',
      // separator: true,
      text: 'Freeze Column',
      target: '.e-headercontent',
      id: 'freezeColumn',
    },
    {
      iconCss: 'e-icons e-filter',
      // separator: true,
      text: 'Filter Column',
      target: '.e-headercontent',
      id: 'filterColumn',
    },
    {
      iconCss: 'e-icons e-filter',
      // separator: true,
      text: 'Multi-Sort',
      target: '.e-headercontent',
      id: 'multiSortColumn',
    },
  ];

  @ViewChild('treegrid')
  //@ts-ignore
  public treeGridObj: TreeGridComponent;

  // public tasks: Observable<DataStateChangeEventArgs>;

  constructor(private TaskService: TaskStoreService) {
    // this.tasks = TaskService;
    this.TaskService.getTasksTableConfigurations().subscribe((data: any) => {
      this.treegridColumns = data.result.map((column: any) => {
        return {
          field: column.field,
          isPrimaryKey: column.is_primary,
          headerText: column.name,
          width: column.width,
          type: column.type,
          displayAsCheckBox: column.type === 'Boolean',
        };
      });
    });
  }

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.TaskService.execute(state);
  }

  async ngOnInit(): Promise<void> {
    this.data = new DataManager({
      url: this.TaskService.getTasksURL(),
      // url: "https://ej2services.syncfusion.com/production/web-services/api/SelfReferenceData",
      batchUrl: 'Home/Remove',
      adaptor: new WebApiAdaptor({requestType: 'JSON'}),
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
    this.filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent', mode: 'Immediate' };
    // this.sortSettings =  { columns: [{ field: 'taskID', direction: 'Ascending'  },
    //   { field: 'taskName', direction: 'Ascending' }]
    // }
    // this.filterSettings = { type: 'Menu'};
    // this.toolbar = ['ColumnChooser', 'Delete'];
    // this.contextMenuItems = this.contextMenuRowItems;
    // this.pageSettings = { pageSize: 12, pageSizeMode: 'Root' };
    // const state: any = { skip: 0, take: 1 };
    // debugger
    // this.TaskService.execute(state);
  }

  public sort(args: SortEventArgs): void {
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

  columnMenuOpen(arg: any): void {
    console.log('column Menu Open', arg);
  }

  columnContextMenuOpen(args: any): void {
    console.log('columnContextMenuOpen', args);
    //handle selection of context menu items here
    if (args.item.properties.id === 'newColumn') {
      this.editDialog.show();
    } else if (args.item.properties.id === 'editColumn') {
      this.editDialog.show();
    } else if (args.item.properties.id === 'deleteColumn') {
      console.log([this.selectedColumnId]);
      this.treeGridObj.hideColumns([this.selectedColumnId], this.selectedColumnId);
      console.log(this.treeGridObj.getVisibleColumns());
    } else if (args.item.properties.id === 'chooseColumn') {
      this.treeGridObj.openColumnChooser();
    } else if (args.item.properties.id === 'freezeColumn') {
      this.treeGridObj.frozenColumns;
      console.log(this.treeGridObj.getFrozenColumns());
    } else if (args.item.properties.id === 'filterColumn') {
      // const visibleColumns = this.treeGridObj.getVisibleColumns().map(column=>{
      //   return column.field
      // })
      // console.log(visibleColumns);
      this.treeGridObj.allowFiltering = true;
    } else if (args.item.properties.id === 'multiSortColumn') {
      this.treeGridObj.allowMultiSorting = false;
    }
  }

  rowContextMenuOpen(arg: any): void {
    console.log('rowContextMenuOpen', arg);
    if (arg.hasOwnProperty('column') && arg.column){
      this.selectedColumnId = arg.column.field;
    }
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
      this.treeGridObj.copyHierarchyMode = 'Both';
      this.treeGridObj.copy();
    }
    if (args.item.id === 'cut') {
      this.treeGridObj.copy();
      this.treeGridObj.addRecord();
    }
    if (args.item.id === 'paste-next') {
      const selectedRowNumber = this.treeGridObj.getSelectedRowIndexes();
      console.log(selectedRowNumber);
      // this.treeGridObj.paste('Next');
    }
    if (args.item.id === 'paste-child') {
      // const selectedRowNumber = this.treeGridObj.getSelectedRowIndexes();
      // const selectedRow = this.treeGridObj.getSelectedRecords()
      // console.log(selectedRowNumber, selectedRow);
      //@ts-ignore
      // this.data.insert().then(
      //   (res: any) =>{
      //     console.log(res.data)
      //   }
        this.treeGridObj.addRecord({ taskID: 'input', taskName: 'email.6', startDate: "Sun Jun 07 1992 05:00:00 GMT+0500 (Pakistan Standard Time)", isParent: true });

      // )
      // this.treeGridObj.paste('Child');
    }
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
