import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  VirtualScrollService,
  TreeGridComponent,
  DataStateChangeEventArgs,
  ColumnChooserService,
  ToolbarService,
  ColumnMenuService,
  FilterService,
  FreezeService,
  InfiniteScrollService,
  ReorderService,
  RowDDService,
} from '@syncfusion/ej2-angular-treegrid';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { RowDataBoundEventArgs, BeginEditArgs } from '@syncfusion/ej2-grids';
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
import { TaskModel } from './services/task-model';

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
    FreezeService,
    InfiniteScrollService,
    ReorderService,
    ResizeService,
    RowDDService,
  ],
})
export class AppComponent implements OnInit {
  // public data: Object[] = [{}];

  public data!: DataManager;

  public selectedColumnId: string = '';
  public multiSelectColumnSwitch: boolean = false;
  public freezeColumnSwitch: boolean = false;
  public filterColumnSwitch: boolean = false;
  public editSettings: object = {};
  public filterSettings!: Object;
  public pageSettings: Object = {};
  public sortSettings!: Object;
  public contextMenuItems: any = [];
  public toolbar: string[] = [];
  public selectionType: string = 'Single';
  public copiedRecords: TaskModel[] = [];
  public copiedElements: Element[] = [];
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
    // { text: 'Add Next', target: '.e-content', id: 'next' },
    // { text: 'Add Child', target: '.e-content', id: 'child' },
    {
      text: 'Add',
      target: '.e-content',
      id: 'add-row',
      items: [
        { text: 'Add Next', id: 'next' },
        { text: 'Add Child', id: 'child' },
      ],
    },
    { text: 'Multi Select', target: '.e-content', id: 'multi' },
    { text: 'Copy Rows', target: '.e-content', id: 'copy' },
    { text: 'Cut Rows', target: '.e-content', id: 'cut' },
    // { text: 'Paste Next', target: '.e-content', id: 'paste-next' },
    // { text: 'Paste Child', target: '.e-content', id: 'paste-child' },
    {
      text: 'Paste',
      target: '.e-content',
      id: 'paste-row',
      items: [
        { text: 'Paste Next', id: 'paste-next' },
        { text: 'Paste Child', id: 'paste-child' },
      ],
    },
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
    this.contextMenuItems = [
      ...this.contextMenuRowItems,
      ...this.headermenuItems,
    ];
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
    this.filterSettings = {
      type: 'FilterBar',
      hierarchyMode: 'Parent',
      mode: 'Immediate',
    };
    this.treeGridObj.enableVirtualization = true;
    // this.sortSettings =  { columns: [{ field: 'taskID', direction: 'Ascending'  },
    //   { field: 'taskName', direction: 'Ascending' }]
    // }
    // this.toolbar = ['Add', 'Delete'];
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
            // this.treegrid.sortByColumn('orderDate', 'Ascending', true);
          }
        }
      }
    }
  }

  contextMenuClick(args?: MenuEventArgs): void {
    console.log('contextMenuClick', args);
    this.columnContextMenuClick(args);
    this.rowContextMenuClick(args);
  }

  contextMenuOpen(arg: BeforeOpenCloseEventArgs): void {
    console.log('contextMenuOpen', arg);
    this.rowContextMenuOpen(arg);
  }

  columnContextMenuClick(args: any): void {
    console.log('columnContextMenuClick', args);
    //handle selection of context menu items here
    if (args.item.properties.id === 'newColumn') {
      this.editDialog.show();
    } else if (args.item.properties.id === 'editColumn') {
      this.editDialog.show();
    } else if (args.item.properties.id === 'deleteColumn') {
      this.treeGridObj.hideColumns(this.selectedColumnId, 'field');
      // delete column request to server
    } else if (args.item.properties.id === 'chooseColumn') {
      this.treeGridObj.openColumnChooser();
    } else if (args.item.properties.id === 'freezeColumn') {
      if (!this.filterColumnSwitch) {
        this.filterColumnSwitch = true;
        // this.treeGridObj.rowHeight = 40;
        this.treeGridObj.enableInfiniteScrolling = true;
        this.treeGridObj.frozenColumns =
          this.treeGridObj.getColumnIndexByField(this.selectedColumnId) + 1;
      } else {
        this.filterColumnSwitch = false;
        this.treeGridObj.frozenColumns = 0;
        this.treeGridObj.enableVirtualization = true;
      }
    } else if (args.item.properties.id === 'filterColumn') {
      if (this.filterColumnSwitch) {
        this.treeGridObj.clearFiltering();
      }
      this.filterColumnSwitch = !this.filterColumnSwitch;
      this.treeGridObj.allowFiltering = this.filterColumnSwitch;
    } else if (args.item.properties.id === 'multiSortColumn') {
      this.multiSelectColumnSwitch = !this.multiSelectColumnSwitch;
      this.treeGridObj.allowMultiSorting = this.multiSelectColumnSwitch;
    }
  }

  rowContextMenuOpen(arg: any): void {
    console.log('rowContextMenuOpen', arg);
    if (arg.hasOwnProperty('column') && arg.column) {
      this.selectedColumnId = arg.column.field;
    }
  }

  rowContextMenuClick(args: any): void {
    console.log('rowContextMenuClick', args);
    if (args.item.id === 'next') {
      const selectedRowNumber = this.treeGridObj.getSelectedRowIndexes();
      if (selectedRowNumber.length > 1) {
        alert('please Select single record');
      }
      this.treeGridObj.addRecord(undefined, selectedRowNumber[0] + 1, 'Below');
    }
    if (args.item.id === 'child') {
      const selectedRowNumber = this.treeGridObj.getSelectedRowIndexes();
      if (selectedRowNumber.length > 1) {
        alert('please Select single record');
      }
      this.treeGridObj.addRecord(undefined, undefined, 'Child');
    }
    if (args.item.id === 'multi') {
      this.multiSelectToggle();
    }
    if (args.item.id === 'copy') {
      this.treeGridObj.copyHierarchyMode = 'Both';
      this.treeGridObj.copy();
      this.highlightRecords();
    }
    if (args.item.id === 'cut') {
      this.copiedRecords = this.treeGridObj.getSelectedRecords() as TaskModel[];
      this.highlightRecords();
    }
    if (args.item.id === 'paste-next') {
      const selectedRowNumber = this.treeGridObj.getSelectedRowIndexes();
      console.log(selectedRowNumber);
      // this.treeGridObj.deleteRecord('taskID', this.copiedRecords);
      // this.treeGridObj.paste('Next');
      this.lowlightRecords();
    }
    if (args.item.id === 'paste-child') {
      const selectedRowNumber = this.treeGridObj.getSelectedRowIndexes();
      if (selectedRowNumber.length > 1) {
        alert('please Select single record');
      }
      this.copiedRecords = this.treeGridObj.getSelectedRecords() as TaskModel[];
      const selectedRow = (
        this.treeGridObj.getSelectedRecords() as TaskModel[]
      )[0];
      console.log(selectedRowNumber, selectedRow);

      // make child parent node
      // if(!selectedRow.isParent && this.copiedRows.length > 0) {
      //   console.log('child update');
      //   this.treeGridObj.updateRow(selectedRowNumber[0], {isParent:true})
      // }

      for (let newRow of this.copiedRecords) {
        newRow.isParent = false;
        newRow.parentItem = selectedRow.taskID;
        this.treeGridObj.addRecord(newRow);
      }
      this.lowlightRecords();
    }
  }

  highlightRecords() {
    this.copiedElements = this.treeGridObj.getSelectedRows();
    addClass(this.treeGridObj.getSelectedRows(), 'disableRow');
  }

  lowlightRecords() {
    removeClass(this.copiedElements, 'disableRow');
    this.copiedElements = [];
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
