import { MessagesService } from './../messages/messages.service';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';
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
        private messagesService: MessagesService
    ) {
        this.loadAllCourses();
    }

    private loadAllCourses() {
        const loadCourses$ = this.http.get<Course[]>('/api/courses')
            .pipe(
                map(response => response["payload"]),
                catchError(err => {
                    const message = "There was a problem loading courses."
                    this.messagesService.showErrors(message);
                    console.log(message, err);
                    return throwError(err);
                }),
                tap(courses => this.subject.next(courses) )
            );
        this.loadingService.showLoaderUntilCompleted(loadCourses$)
            .subscribe();
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        const courses = this.subject.getValue();
        const index = courses.findIndex(course => course.id === courseId)
        // create a new object that includes the changes
        const newCourse: Course = {
            ...courses[index],
            ...changes
        };
        const updatedCourses: Course[] = courses.slice(0);
        updatedCourses[index] = newCourse;
        
        this.subject.next(updatedCourses);

        // write changes to the database
        return this.http.put(`/api/courses/${courseId}`, changes)
            .pipe(
                catchError(err => {
                    const message = "There was an error saving the changes."
                    console.log(err, message);
                    this.messagesService.showErrors(message);
                    return throwError(err);
                }),
                shareReplay()
            )
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