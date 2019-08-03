import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();

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
      notification: ['email']
      //lastName: {value:'N/A', disabled:true},
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
      sendCatalog: true
    });

  }

  setNotification(notifiyVia: string): void {
    console.log('Setting up validation rules for phone');
    const phoneControl = this.customerForm.get('phone');
    console.log(notifiyVia);
    if (notifiyVia === 'text'){
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
