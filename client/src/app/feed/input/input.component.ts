import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IPost } from 'src/app/IPost';
import { PostService } from 'src/app/post.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  postForm = new FormGroup({
    title: new FormControl(null, Validators.required),
    content: new FormControl(null, Validators.required)
  })

  constructor(private postService: PostService) { }

  ngOnInit(): void {
  }

  onCreatePost() {
    if(this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const post: IPost = {
      title: this.postForm.get(['title']).value,
      content: this.postForm.get(['content']).value
    }

    this.postService.createPost(post);

    this.postForm.reset();
  }
}
