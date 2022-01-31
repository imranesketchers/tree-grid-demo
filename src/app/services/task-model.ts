export class TaskModel {
  [key : string]: any;
  taskID: Number | undefined;
  taskName: String | undefined;
  isParent: Boolean | undefined;
  parentItem: Number | undefined;
}
