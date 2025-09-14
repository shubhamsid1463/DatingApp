import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { MemberList } from '../features/members/member-list/member-list';
import { MemberDetailed } from '../features/members/member-detailed/member-detailed';
import { list } from 'postcss';
import { Messages } from '../features/messages/messages';
import { Lists } from '../features/lists/lists';
import { authGuard } from '../core/guards/auth-guard';

export const routes: Routes = [
    {path:'',component:Home},
    {path:'members',component:MemberList,canActivate:[authGuard]},
    {path:'members/:id',component:MemberDetailed},
    {path:'messages',component:Messages},
    {path:'lists',component:Lists},
    {path:'**',component:Home}
];
