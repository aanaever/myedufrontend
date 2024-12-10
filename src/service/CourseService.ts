import { httpUtil } from "@/util/http_util";
import type { AxiosResponse } from 'axios';
import type { Course, FullCourse } from "@/interfaces/myedu"; 

class CourseService {
  updateCourse(id: number, courseData: Course) {
    return httpUtil.put(`/courses/${id}`, courseData);
  }

  createCourse(courseData: Course) {
    return httpUtil.post('/courses', courseData);
  }

  getAllCourses() {
    return httpUtil.get("/courses");
  }

  deleteCourse(id: number) {
    return httpUtil.delete(`/courses/id/${id}`);
  }

  getTop() {
    return httpUtil.get("/courses/top");
  }

  getById(id: number) {
    return httpUtil.get(`/courses/id/${id}`);
  }

  getByCategory(category: string) {
    return httpUtil.get(`/courses/cat/${category}`);
  }

  findByTitle(title: string, page = 0) {
    return httpUtil.get("/courses/search", { params: { title, page } });
  }

  getObjectivesByCourse(id: number) {
    return httpUtil.get(`/objectives/course/${id}`);
  }

  getAllCategories() {
    return httpUtil.get("/courses/categories");
  }

  createFullCourse(fullCourseData: FullCourse) {
    return httpUtil.post('/courses/full', fullCourseData);
  }
  
  uploadVideo(videoFile: File): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('video', videoFile);
    console.log('Form Data:', formData.get('video'));
    return httpUtil.post('/courses/uploadVideo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  getVideoURL(videoKey: string): Promise<AxiosResponse> {
    return httpUtil.get(`/courses/video/${videoKey}`);
  }

  // New method to update course status
  updateCourseStatus(id: number, status: string) {
    return httpUtil.put(`/courses/${id}/status`, { status });
  }

  // New method to get courses by status
  getCoursesByStatus(status: string) {
    return httpUtil.get(`/courses/status/${status}`);
  }

  updateFullCourse(id: number, fullCourseData: FullCourse) {
    return httpUtil.put(`/courses/full/${id}`, fullCourseData);
  }

  getFullCourse(id: number): Promise<AxiosResponse> {
    return httpUtil.get(`/courses/full/${id}`);
  }


  getCoursesByAuthor(author: string): Promise<AxiosResponse<Course[]>> {
    return httpUtil.get(`/courses/author/${author}`);
  }
}

export default new CourseService();
