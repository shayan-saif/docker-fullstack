import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { IPost } from './IPost';

const backend = 'http://localhost:3000';

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
        post_id: res.post_id,
        created_at: new Date(),
        title: res.title,
        content: res.content
      }

      let updatedPosts = [...this.posts.value, newPost];
      this.posts.next(updatedPosts);
    });

  }

  deletePost(post_id: number) {
    this.http.delete(backend + '/posts/delete/' + post_id).subscribe(() => {
      let updatedPosts = this.posts.value.filter((post) => {
        return post.post_id != post_id;
      });
      this.posts.next(updatedPosts);
    });

  }


}
