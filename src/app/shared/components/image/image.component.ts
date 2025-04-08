import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../../../core/http-services/file.service';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img
      [src]="imageUrl"
      [alt]="altText"
      [class]="className"
      (error)="onError()"
      style="object-fit: cover; width: 100%; height: 100%;"
    />
  `
})
export class ImageComponent implements OnInit {
  @Input() fileId: number | null = null;
  @Input() altText: string = '';
  @Input() className: string = '';
  @Input() defaultImage: string = 'assets/images/default-competition.jpg';

  imageUrl: string = '';

  constructor(private fileService: FileService) { }

  ngOnInit() {
    this.loadImage();
  }

  loadImage() {
    if (this.fileId) {
      this.imageUrl = `http://localhost:5054/api/Files/${this.fileId}`;

    }
  }

  onError() {
    this.imageUrl = this.defaultImage;
  }
}
