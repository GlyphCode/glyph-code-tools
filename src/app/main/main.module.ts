import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LinebreakPipe } from '../pipline/linebreak.pipe';
import { StatusPipe } from '../pipline/status.pipe';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
// import { MonacoEditorModule } from 'ngx-monaco';
import { HttpClient } from '@angular/common/http';
// import { MonacoEditorService } from 'ngx-monaco';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MonacoEditorModule ,NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { CodingComponent } from './coding/coding.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { ProjectListComponent } from './project-list/project-list.component';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { PannelComponent } from './pannel/pannel.component';

@NgModule({
  declarations: [MainComponent, LinebreakPipe, StatusPipe,CodingComponent, ProjectCreateComponent, ProjectListComponent, PannelComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    NzGridModule,
    NzSpinModule,
    NzTableModule,
    NzLayoutModule,
    NzButtonModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzEmptyModule,
    NzSelectModule,
    NzIconModule,
    NzMenuModule,
    NzTabsModule,
    NzModalModule,
    NzFormModule,
    NzTreeModule,
    NzAvatarModule,
    NzPopoverModule,
    NzAutocompleteModule,
    NzPopconfirmModule,
    NzListModule,
    MonacoEditorModule.forRoot({
      baseUrl: 'assets', // 重要：设置 Monaco 文件的基础路径
      defaultOptions: {
        scrollBeyondLastLine: false,
        automaticLayout: true // 自动调整布局
      }
    }),
    MarkdownModule.forChild()
  ],
  providers:[
    NzMessageService,
    MarkdownService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class MainModule { }
