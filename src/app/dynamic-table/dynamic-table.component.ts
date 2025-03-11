import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { ApiService, Repository } from '../api.service'; // Update 
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
})
export class DynamicTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<any>(); // Dynamic data source
  displayedColumns: string[] = []; // Dynamic columns
  filterText: string = '';

  constructor(private apiService: ApiService) {} // Update constructor

  ngOnInit(): void {
    this.apiService.getRepositories().subscribe(
      (data) => {
        console.log('Data received:', data.value); // Log the data

        if (data.value && data.value.length > 0) {
          // Dynamically generate columns based on the first item in the data
          this.displayedColumns = Object.keys(data.value[0]);
          this.dataSource.data = data.value; // Set the data source
           // Enable pagination
           this.dataSource.paginator = this.paginator;
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  applyFilter(): void {
    this.dataSource.filter = this.filterText.trim().toLowerCase();
  }

  // Helper method to check if a value is an object
  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}