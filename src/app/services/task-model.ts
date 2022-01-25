export class TaskModel {
  id?: Number;
  [key : string]: any;
  TaskName: String | undefined;
  isParent: Boolean | undefined;
  ParentID: Number | undefined;
}
