import { Component, Input, OnInit } from '@angular/core';
import { IPost } from 'src/app/IPost';
import { PostService } from 'src/app/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: IPost;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
  }

  onDeletePost() {
    this.postService.deletePost(this.post.post_id);
  }

}
