import { Component, OnInit } from '@angular/core';
import { IPost } from '../IPost';
import { PostService } from '../post.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  posts: IPost[];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getPosts();
    this.postService.posts.subscribe((posts) => this.posts = posts);
  }

}
