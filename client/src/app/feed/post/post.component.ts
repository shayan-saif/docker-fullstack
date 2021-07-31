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
  editMode: boolean = false;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
  }

  onEditPost() {
    this.editMode = true;
  }

  onCancelEdit() {
    this.editMode = false;
  }

  onEditSubmit() {
    this.postService.editPost(this.post);
    this.editMode = false;
  }

  onDeletePost() {
    this.postService.deletePost(this.post.post_id);
  }

}
