import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFlexModule } from 'ng-zorro-antd/flex';

interface IPopulateResponse {
  data: IPopulateResponseData[];
  response: boolean;
}

interface IPopulateResponseData {
  id: number;
  actualSp: number;
  estimatedSp: number;
  developer: string;
  priority: string;
  status: string;
  title: string;
  type: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NzTableModule,
    NzSelectModule,
    NzButtonModule,
    FormsModule,
    NzIconModule,
    NzTabsModule,
    NzFlexModule,
  ],
  providers: [NzIconService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  data: IPopulateResponseData[] = [];
  developerOptions: any[] = [
    {
      label: 'Alice',
      value: 'alice',
    },
    {
      label: 'Bob',
      value: 'bob',
    },
  ];
  tabs = [
    {
      name: 'Main Table',
      disabled: false,
    },
    {
      name: 'Kanban',
      disabled: true,
    },
  ];
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  editId: number | null = null;
  editCol: string | null = null;

  constructor(private _httpClient: HttpClient) {}

  ngOnInit(): void {
    this.populateData();
  }

  createTask(): void {
    this.data.unshift({
      id: 0,
      actualSp: 0,
      estimatedSp: 0,
      developer: 'Alice',
      priority: '',
      status: 'In Progress',
      title: 'New Task',
      type: 'Other',
    });
  }

  populateData(): void {
    if (this.getDataFromLocalStorage()) {
      this.data = this.getDataFromLocalStorage();
    } else {
      this._httpClient
        .get<IPopulateResponse>(
          'https://mocki.io/v1/e5f26750-17e9-487b-93fe-2d1ff07c3da8'
        )
        .subscribe({
          next: (res: IPopulateResponse) => {
            this.data = res.data.map(
              (data: IPopulateResponseData, index: number) => {
                data = {
                  ...data,
                  id: index + 1,
                };

                // Make sure all keys using camelCase format
                data = Object.fromEntries(
                  Object.entries(data).map(([key, value]) => [
                    this.toCamelCase(key),
                    value,
                  ])
                ) as IPopulateResponseData;

                return data;
              }
            );
          },
        });
    }
  }

  updateCheckedSet(title: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(title);
    } else {
      this.setOfCheckedId.delete(title);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.data.every(({ title }) =>
      this.setOfCheckedId.has(title)
    );
    this.indeterminate =
      this.data.some(({ title }) => this.setOfCheckedId.has(title)) &&
      !this.checked;
  }

  onItemChecked(title: string, checked: boolean): void {
    this.updateCheckedSet(title, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.data.forEach(({ title }) => this.updateCheckedSet(title, checked));
    this.refreshCheckedStatus();
  }

  startEdit(id: number, colName: string): void {
    this.editId = id;
    this.editCol = colName;
  }

  stopEdit(): void {
    this.editId = null;
    this.editCol = null;
    this.saveToLocalStorage();
  }

  toCamelCase(str: string): string {
    return str
      .toLowerCase()
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  }

  saveToLocalStorage(): void {
    localStorage.setItem('data', JSON.stringify(this.data));
  }

  getDataFromLocalStorage(): IPopulateResponseData[] {
    return localStorage.getItem('data')
      ? JSON.parse(localStorage.getItem('data') || '')
      : null;
  }
}
