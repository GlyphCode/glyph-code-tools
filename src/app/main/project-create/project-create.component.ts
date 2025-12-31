import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventBusServiceService } from 'src/app/services/event-bus-service.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss']
})
export class ProjectCreateComponent implements OnInit {
validateForm!: FormGroup;
  constructor(private fb: FormBuilder,
    private eventBus:EventBusServiceService,
    private projectService:ProjectService) { }
  submitForm(): void {
    console.log("----------------",this.validateForm.value,this.validateForm.valid)
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid){
        this.projectService.createProject(this.validateForm.value).subscribe(response=>{
            this.eventBus.emitToChild(response.data)
        })
    }

  }

 ngOnInit(): void {
    this.validateForm = this.fb.group({
      project: [null, [Validators.required]],
      git_url: [null, [Validators.required]],
      image_url: [null, [Validators.required]],
      language:[null,[Validators.required]]
    });
  }
}
