import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog.component';
import { MainPageComponent } from '../main-page/main-page.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<MainPageComponent> {

  constructor(private dialog: MatDialog) {}

  canDeactivate(component: MainPageComponent): Observable<boolean> {
    if(component.isFormDirty){
      return this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            message: 'You have unsaved changes! If you leave, your changes will be lost.',
            ok: 'Leave',
            ko: 'Cancel'
          }
        })
        .afterClosed();
    }
    return of(true);
  }
}
