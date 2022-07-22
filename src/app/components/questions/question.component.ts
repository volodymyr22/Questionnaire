import { Component, Input } from '@angular/core';
import { Question } from '../../../interface/question';
import { QuestionService } from '../../question.service';

@Component({
  selector: 'app-questions',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent {
  @Input() question: Question;
  public selectedAnswer: string[] = [];

  constructor(private questionService: QuestionService) {}

  public answer(elem: Question): void {
    elem.isOpen = false;
    elem.your_answer = this.selectedAnswer;
    const data = JSON.parse(localStorage.getItem('questions') || '[]');
    const index = data.findIndex(
      (question: Question) => question.id === elem.id
    );
    data.splice(index, 1, elem);
    localStorage.setItem('questions', JSON.stringify(data));
    this.questionService.questionArray$.next(data);
  }

  public toUnAnswered(elem: Question): void {
    elem.isOpen = true;
    elem.your_answer = [];
    const data = JSON.parse(localStorage.getItem('questions') || '[]');
    const index = data.findIndex(
      (question: Question) => question.id === elem.id
    );
    data.splice(index, 1, elem);
    localStorage.setItem('questions', JSON.stringify(data));
    this.questionService.questionArray$.next(data);
  }

  public checkCheckBoxValue(option: string, event: any): void {
    if (!this.selectedAnswer.includes(option)) {
      this.selectedAnswer.push(option);
    }

    if (!event.checked && this.selectedAnswer.includes(option)) {
      this.selectedAnswer = this.selectedAnswer.filter(
        (answer: string) => answer !== option
      );
    }
  }

  public checkRadioValue(option: string): void {
    this.selectedAnswer = [option];
  }

  public checkInput(event: Event): void {
    this.selectedAnswer.push((event.target as HTMLInputElement).value);
  }
}
