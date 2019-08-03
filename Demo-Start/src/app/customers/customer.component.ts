import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Customer } from './customer';

function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if ((c.value != null && (isNaN(c.value) || c.value < min || c.value > max))) {
      return { 'range': true };
    }
    return null;
  };
}

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null   {
  const emailControl = c.get('email');
  const confirmemailControl = c.get('confirmemail');
  console.log('Checking that email matches');
  if (emailControl.pristine || confirmemailControl.pristine) {
    return null;
  }
  if (emailControl.value != null && confirmemailControl.value != null && emailControl.value !== confirmemailControl.value) {
    return { mismatchEmail: true };
  }
  return null;
}




@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();
  emailMessage: string;

  private validationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email'
  };

  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
    // this.customerForm = new FormGroup({
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   email: new FormControl(),
    //   sendCatalog: new FormControl(true)
    // });
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(4)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      phone: '',
      rating: [null, [ratingRange(1, 5)]],
      notification: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmemail: ['', [Validators.required]],
      }, {validator: emailMatcher}),
      sendCatalog: true,
      addressType: 'home',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: ''
    });

    this.customerForm.get('notification').valueChanges.subscribe(value =>
      this.setNotification(value));

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges.pipe(debounceTime(1000)).subscribe((value => this.setMessage(emailControl)))
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      // debugger
      this.emailMessage = Object.keys(c.errors).map(
        key => this.emailMessage += this.validationMessages[key]).join(' ');
    }
  }


  setNotification(notifiyVia: string): void {
    //console.log('Setting up validation rules for phone');
    const phoneControl = this.customerForm.get('phone');
    console.log(`NotifyVia: ${notifiyVia}`);
    // console.log(notifiyVia);
    if (notifiyVia === 'text') {
      // debugger
     phoneControl.setValidators(Validators.required);
    } else {
     phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  populateTestData() {
    this.customerForm.patchValue({
      firstName: 'Jack',
      lastName: 'Harkness',
      sendCatalog: false
    });
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));

  }
}
