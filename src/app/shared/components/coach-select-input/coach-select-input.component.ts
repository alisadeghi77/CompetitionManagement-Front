import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, filter, map, switchMap, of } from 'rxjs';
import { UserService } from '../../../core/http-services/user.service';

interface Coach {
  id: string | null;
  phoneNumber: string;
  fullName: string | null;
}

@Component({
  selector: 'app-coach-select-input',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbTypeaheadModule],
  templateUrl: './coach-select-input.component.html',
})
export class CoachSelectInputComponent implements OnInit {
  @Output() coachSelected = new EventEmitter<Coach>();

  model: any;
  searchTerm = '';

  private userService = inject(UserService);

  ngOnInit(): void { }

  formatter = (coach: Coach) => {
    if (!coach) return '';
    return coach.fullName ? `${coach.fullName} (${coach.phoneNumber})` : coach.phoneNumber;
  };

  search: OperatorFunction<string, readonly Coach[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => this.isNumberOnly(term)),
      switchMap(term => {
        if (!this.isNumberOnly(term)) {
          return of([]);
        }
        return this.userService.getCoaches(term).pipe(
          map(response => {
            const coaches = response.data as any[];
            if (coaches && coaches.length > 0) {
              return coaches as Coach[];
            } else {
              return [{ id: null, phoneNumber: term, fullName: null }] as Coach[];
            }
          })
        );
      })
    );

  isNumberOnly(text: string): boolean {
    return /^09\d{3,}$/.test(text);
  }

  onSelectCoach(event: any): void {
    if (event && event.item) {
      console.log("event.item", event.item);
      this.coachSelected.emit(event.item);
    }
  }

  resetInput(): void {
    this.model = null;
    this.searchTerm = '';
  }
}
