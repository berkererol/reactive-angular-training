import { MessagesService } from './../messages/messages.service';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { map, catchError, tap } from 'rxjs/operators';
import { LoadingService } from '../loading/loading.service';

@Injectable({
    providedIn: 'root',
})
export class CourseStore {

    private subject = new BehaviorSubject<Course[]>([]);

    courses$: Observable<Course[]> = this.subject.asObservable();

    constructor(
        private http: HttpClient,
        private loadingService: LoadingService,
        private messages: MessagesService
    ) {
        this.loadAllCourses();
    }

    private loadAllCourses() {
        const loadCourses$ = this.http.get<Course[]>('/api/courses')
            .pipe(
                map(response => response["payload"]),
                catchError(err => {
                    const message = "There was a problem loading courses."
                    this.messages.showErrors(message);
                    console.log(message, err);
                    return throwError(err);
                }),
                tap(courses => this.subject.next(courses) )
            );
        this.loadingService.showLoaderUntilCompleted(loadCourses$)
            .subscribe();
    }

    filterByCategory(courseCategory: string): Observable<Course[]> {
        return this.courses$
            .pipe(
                map(courses =>
                    courses.filter(course => course.category === courseCategory)
                        .sort(sortCoursesBySeqNo))
            )
    }

}