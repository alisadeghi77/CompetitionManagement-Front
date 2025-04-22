import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, filter, map, switchMap, of } from 'rxjs';
import { UserService } from '../../../core/http-services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './dynamic-params.component.html'
})
export class DynamicFormComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  selectedParams: any[] = [];
  rootOptions: any[] = [];

  @Output() paramSelected = new EventEmitter<any>();

  private _data: any;
  @Input()
  get data(): any {
    return this._data;
  }
  set data(value: any) {
    this._data = value;
    if (value) {
      this.generateForm();
    }
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.data = {
    //   Key: "age",
    //   Title: "سن",
    //   Values: [
    //     {
    //       Key: "adult",
    //       Title: "بزرگسالان",
    //       Params: [
    //         {
    //           Key: "weight",
    //           Title: "وزن",
    //           Values: [
    //             { Key: "m75", Title: "-75", Params: null },
    //             { Key: "m80", Title: "-80", Params: null },
    //             { Key: "m90", Title: "-90", Params: null },
    //             { Key: "p90", Title: "90", Params: null }
    //           ]
    //         },
    //         {
    //           Key: "style",
    //           Title: "استایل",
    //           Values: [
    //             { Key: "k1", Title: "کی وان", Params: null },
    //             { Key: "lowkick", Title: "لوکیک", Params: null }
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       Key: "Teenagers",
    //       Title: "نوجوانان",
    //       Params: [
    //         {
    //           Key: "weight",
    //           Title: "وزن",
    //           Values: [
    //             { Key: "m45", Title: "-45", Params: null },
    //             { Key: "m50", Title: "-50", Params: null },
    //             { Key: "m60", Title: "-60", Params: null },
    //             { Key: "p60", Title: "60", Params: null }
    //           ]
    //         },
    //         {
    //           Key: "style",
    //           Title: "استایل",
    //           Values: [
    //             { Key: "lowkick", Title: "لوکیک", Params: null }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // };

    this.form.valueChanges.subscribe(value => {
      if (this.form.valid) {
        this.paramSelected.emit(value);
      }
    });

  }

  generateForm() {
    this.rootOptions = this.data.values.map((x: { key: string; title: string; }) => ({ key: x.key, title: x.title })) as any[];
    this.form = this.fb.group({
      [this.data.key]: [null, Validators.required]
    });

    this.form.get(this.data.key)?.valueChanges.subscribe(value => {
      this.handleRootChange(value);
    });
  }

  handleRootChange(value: string) {
    const selected = this.data.values.find((x: { key: string; }) => x.key === value);
    this.selectedParams = selected?.params || [];

    Object.keys(this.form.controls).forEach(key => {
      if (key !== this.data.key) {
        this.form.removeControl(key);
      }
    });

    this.selectedParams.forEach(param => {
      this.form.addControl(param.key, this.fb.control(null, Validators.required));
    });
  }
}