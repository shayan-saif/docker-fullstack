import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/IPost';
import { PostService } from 'src/app/post.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  title: string;
  content: string;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
  }

  onCreatePost() {
    const post: IPost = {
      title: this.title,
      content: this.content
    } 

    this.postService.createPost(post);

    this.resetForm();
    
  }

  resetForm() {
    this.title = "", this.content = "";
  }

}
