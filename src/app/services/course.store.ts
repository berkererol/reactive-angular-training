import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CourseStore {

    courses$: Observable<Course[]>;

    filterByCategory(courseCategory: string): Observable<Course[]> {
        return this.courses$
            .pipe(
                map(courses =>
                    courses.filter(course => course.category === courseCategory)
                        .sort(sortCoursesBySeqNo))
            )
    }

}