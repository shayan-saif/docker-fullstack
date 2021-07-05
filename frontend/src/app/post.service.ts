import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { IPost } from './IPost';

const backend = 'http://express:3000';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts = new BehaviorSubject<IPost[]>(null);

  constructor(private http: HttpClient) { }


  getPosts() {
    this.http.get<IPost[]>(backend + '/posts').subscribe((posts) => this.posts.next(posts));
  }

  createPost(post: IPost) {
    const payload = {
      title: post.title,
      content: post.content
    }
    this.http.post<any>(backend + '/posts/create', payload).subscribe((res) => {

      const newPost: IPost = {
        pid: res.pid,
        title: res.title,
        content: res.content
      }

      let updatedPosts = [...this.posts.value, newPost];
      this.posts.next(updatedPosts);
    });

  }

  deletePost(pid: number) {
    this.http.delete(backend + '/posts/delete/' + pid).subscribe(() => {
      let updatedPosts = this.posts.value.filter((post) => {
        return post.pid != pid;
      });
      this.posts.next(updatedPosts);
    });

  }


}
