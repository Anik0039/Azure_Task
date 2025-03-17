import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ApiService, Repository } from '../api.service';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; 



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
    MatIconModule, 
  ],
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
})
export class DynamicTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<any>(); // Dynamic data source
  displayedColumns: string[] = []; // Dynamic columns
  filterText: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getRepositories().subscribe(
      (data) => {
        console.log('Data received:', data.value); // Log the data

        if (data.value && data.value.length > 0) {
          // Define the preferred column order
          const preferredOrder = [
            'id', // 1st column
            'projectName', // 2nd column
            'lastUpdated', // 3rd column
            'name', // 4th column
            'url', // 5th column
            'defaultBranch',
            'size',
            'remoteUrl',
            'isDisabled',
            'isInMaintenance',// Add other columns as needed
          ];
  
          // Dynamically generate all columns from the data
          const allColumns = Object.keys(data.value[0]);
  
          // Remove unwanted columns (e.g., 'sshUrl', 'webUrl', 'project')
          const filteredColumns = allColumns.filter(
            column => column !== 'sshUrl' && column !== 'webUrl' && column !== 'url' && column !== 'project'
          );
  
          // Add 'projectName' and 'lastUpdated' to the filtered columns
          const extendedColumns = [...filteredColumns, 'projectName', 'lastUpdated'];
  
          // Reorder the columns based on the preferred order
          this.displayedColumns = preferredOrder.filter(column => extendedColumns.includes(column));

        // Add serial number to the data and split the 'project' column
        this.dataSource.data = data.value.map((repo: any, index: number) => {
          return {
            ...repo,
            id: index + 1, // Add serial number
            projectName: repo.project.name, // Extract project name
            lastUpdated: repo.project.lastUpdateTime, // Extract last updated time
            size: this.formatSize(repo.size)
          };
        });

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
   // Helper method to convert bytes to gigabytes
   formatSize(sizeInMBytes: number): string {
    const sizeInGB = sizeInMBytes / (1024*1024) ; // Convert bytes to GB
    return `${sizeInGB.toFixed(2)} GB`; // Format to 2 decimal places
  }

}
