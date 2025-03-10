import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Repository {
  id: string;
  name: string;
  url: string;
  project: {
    id: string;
    name: string;
    description: string;
    url: string;
    state: string;
    revision: number;
    visibility: string;
    lastUpdateTime: string;
  };
  defaultBranch: string;
  size: number;
  remoteUrl: string;
  sshUrl: string;
  webUrl: string;
  isDisabled: boolean;
  isInMaintenance: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private azureDevOpsApiUrl =
    'https://dev.azure.com/erainfotechbd/_apis/git/repositories?api-version=7.1-preview.1';
  private pat = 'E79Gtu3nmCoJngrXnYIH6ZcMcpxeOniJTs5nqvwPTRZp8R9m7T8pJQQJ99BCACAAAAAFARBvAAASAZDO3D84'; // Replace with your PAT

  constructor(private http: HttpClient) {}

  // Method to fetch repositories from Azure DevOps
  getRepositories(): Observable<{value:Repository[]}> {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`:${this.pat}`)}`, // Encode PAT for Basic Auth
    });

    return this.http.get< { value:Repository[]}>(this.azureDevOpsApiUrl, { headers }).pipe(
      tap((data) => console.log('API response:', data)), // Log the response
      catchError((error) => {
        console.error('API error:', error); // Log any errors
        return of({value:[]}); // Return an empty array in case of error
      })
    );
  }

  // Add other API methods here if needed
}