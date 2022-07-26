import { Component, OnInit, VERSION } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  singupForm: FormGroup;
  ngOnInit() {
    this.singupForm = new FormGroup({
      userdata: new FormGroup({
        username: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
      }),
      gender: new FormControl(null, Validators.required),
      classmates: new FormArray([
        new FormControl('', [Validators.required]),
        new FormControl('', [Validators.required]),
      ]),

      addresses: new FormArray([
        new FormGroup({
          street: new FormControl(null, Validators.required),
          city: new FormControl(null, Validators.required),
        }),
      ]),
    });
  }

  onSubmit() {
    console.log(this.singupForm.value);
    if (this.singupForm.valid) {
      console.log('form submitted');
    } else {
      this.validateAllFormFields(this.singupForm);
    }
  }

  classMate(i) {
    return (<FormArray>this.singupForm.get('classmates')).controls[i];
  }

  city(i) {
    return (<FormArray>this.singupForm.get('addresses')).controls[i].get(
      'city'
    );
  }

  street(i) {
    return (<FormArray>this.singupForm.get('addresses')).controls[i].get(
      'street'
    );
  }

  get classmates() {
    return this.singupForm.get('classmates') as FormArray;
  }

  get addresses() {
    return this.singupForm.get('addresses') as FormArray;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else if (control instanceof FormArray) {
        this.validateFormArray(control);
      }
    });
  }

  validateFormArray(control: FormArray) {
    for (let c of control.controls) {
      if (c instanceof FormControl) {
        c.markAsTouched({ onlySelf: true });
      } else if (c instanceof FormGroup) {
        this.validateAllFormFields(c);
      } else if (c instanceof FormArray) {
        this.validateFormArray(c);
      }
    }
  }

  resetForm(formGroup: FormGroup) {
    //formGroup.reset();
    //return  reset only work but sometimes need
    // extra effort
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        this.resetControl(control);
      } else if (control instanceof FormGroup) {
        this.resetForm(control);
      } else if (control instanceof FormArray) {
        this.resetFormArray(control);
      }
    });
  }

  resetFormArray(control: FormArray) {
    for (let c of control.controls) {
      if (c instanceof FormControl) {
        this.resetControl(c);
      } else if (c instanceof FormGroup) {
        this.resetForm(c);
      } else if (c instanceof FormArray) {
        this.resetFormArray(c);
      }
    }
  }

  resetControl(control: FormControl) {
    control.markAsPristine();
    control.markAsUntouched();
    //control.setErrors(null);
  }
}
