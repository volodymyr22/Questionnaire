import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Question } from '../../interface/question';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss'],
})
export class ModalFormComponent implements OnInit {
  public questionForm: FormGroup;
  public questionType: string[] = [
    'Single choice',
    'Multiple choice',
    'Open question',
  ];
  public answerOptions: string[] = [];
  public isOpenQuestion: boolean = false;
  public isEdit: boolean = false;
  public readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    public dialogRef: MatDialogRef<ModalFormComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.checkForm();
  }

  private initUserForm(): void {
    this.questionForm = this.fb.group({
      text: '',
      type: '',
      options: '',
      answer: '',
    });
  }

  private initUserFormWithValue(): void {
    if (this.data.type !== 'Open question') {
      this.isOpenQuestion = true;
    }
    this.data.options
      ? (this.answerOptions = this.data.options)
      : this.answerOptions;

    this.questionForm = this.fb.group({
      text: this.data.text,
      type: this.data.type,
      options: '',
      answer: this.data.answer,
      your_answer: [],
    });
  }

  public addNewQuestion(): void {
    this.questionForm.value.options = this.answerOptions;
    if (this.questionForm.valid) {
      const currentData = JSON.parse(localStorage.getItem('questions') || '[]');
      currentData.unshift({
        id: Math.floor(Math.random() * (1000 - 4)) + 4,
        creationDate: new Date().toLocaleDateString(),
        isOpen: true,
        ...this.questionForm.value,
      });
      this.dialogRef.close(currentData);
    }
  }

  public checkQuestionType(e?: any): void {
    if (e.target.innerHTML.trim() === 'Open question') {
      this.isOpenQuestion = false;
      return;
    }
    this.isOpenQuestion = true;
  }

  public removeOption(answerOptions: string): void {
    const index = this.answerOptions.indexOf(answerOptions);

    if (index >= 0) {
      this.answerOptions.splice(index, 1);
    }
  }

  public addOption(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.answerOptions.unshift(value);
    }
    event.chipInput!.clear();
  }

  public checkForm(): void {
    if (this.data) {
      this.initUserFormWithValue();
      this.isEdit = true;
      return;
    }
    this.initUserForm();
  }

  public editQuestion(): void {
    this.questionForm.value.options = this.answerOptions;
    const question = {
      id: this.data.id,
      creationDate: this.data.creationDate,
      ...this.questionForm.value,
      isOpen: this.data.isOpen,
    };
    const data = JSON.parse(localStorage.getItem('questions') || '[]');
    const currentQuestion = data.findIndex(
      (item: Question) => item.id === question.id
    );
    data.splice(currentQuestion, 1, question);
    this.dialogRef.close(data);
  }
}
