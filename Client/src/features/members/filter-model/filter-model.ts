import { Component, ElementRef, input, model, output, ViewChild, viewChild } from '@angular/core';
import { MemberParams } from '../../../types/member';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-model',
  imports: [FormsModule],
  templateUrl: './filter-model.html',
  styleUrl: './filter-model.css'
})
export class FilterModel {
@ViewChild('filterModal') modalref!:ElementRef<HTMLDialogElement>;
closeModal=output();
submitData=output<MemberParams>();
memberParams=model(new MemberParams());
constructor()
{
  const filters=localStorage.getItem('filters');
    if(filters){
      this.memberParams.set(JSON.parse(filters));
    }
}
open(){
  this.modalref.nativeElement.showModal();  
}
close(){
  this.modalref.nativeElement.close();
  this.closeModal.emit();
}
submit(){
  this.submitData.emit(this.memberParams());
  this.close();
}
onMinAgeChange()
{
  if(this.memberParams().minAge<18)
  {
    this.memberParams().minAge=18;
  }
}
onMaxAgeChange()
{
  if(this.memberParams().maxAge<this.memberParams().minAge)
  {
    this.memberParams().maxAge=this.memberParams().minAge;
  }
}
}
