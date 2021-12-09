import { PermissionTreeComponent } from './../../../../../share/components/operators/user-account/permission-tree/permission-tree.component';
import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { MatDialog } from '@angular/material/dialog';
import { EditRoleDialogComponent } from '../../../../../share/components/operators/user-account/edit-role-dialog/edit-role-dialog.component';
import { Subscription } from 'rxjs';
import {
  GroupEntity,
  ParentPermissionTypeResponse,
  PermissionTypeControllerService
} from '../../../../../../../open-api-modules/dashboard-api-docs';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss'],
})
export class UserRoleComponent implements OnInit {
  @Input() treeData: Array<ParentPermissionTypeResponse>;
  @Input() roleList: Array<GroupEntity>;
  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog,
    private permissionTypeControllerService: PermissionTypeControllerService
  ) {}

  @ViewChildren('tree') permissionTree: QueryList<PermissionTreeComponent>;

  ngOnInit(): void {}

  openUpdateDialog(roleTitle) {
    const updateDialogRef = this.dialog.open(EditRoleDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: {
        title: this.multiLanguageService.instant('system.user_role.edit_role'),
        roleName: roleTitle,
        TREE_DATA: this.treeData,
      },
    });
  }

  openCreateDialog() {
    const updateDialogRef = this.dialog.open(EditRoleDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: {
        title: this.multiLanguageService.instant('system.user_role.add_role'),
        hasDelete: true,
        TREE_DATA: this.treeData,
      },
    });
  }

  addRoleToUser() {
    const arrayPermissionTreeComponent = this.permissionTree.toArray();
    let arrayPermission = [];
    for (let i = 0; i < arrayPermissionTreeComponent.length; i++) {
      if (arrayPermissionTreeComponent[i].totalPermissionSelected().length > 0)
        arrayPermission.push(
          ...arrayPermissionTreeComponent[i].totalPermissionSelected()
        );
    }
    console.log(arrayPermission);
  }
}
