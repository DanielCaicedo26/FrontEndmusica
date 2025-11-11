import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-album-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss']
})
export class AlbumListComponent implements OnInit {
  ngOnInit(): void {
    // Minimal placeholder; real implementation should list albums
  }
}
