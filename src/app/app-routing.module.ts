import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { QuestionListComponent } from './components/question-list/question-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/questions',
    pathMatch: 'full',
  },
  {
    path: 'questions',
    component: QuestionListComponent,
  },
  {
    path: 'admin',
    component: AdminPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
