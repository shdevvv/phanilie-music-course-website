export interface TodoItem {
  id?: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt?: string;
}

// Default backend API port from launchSettings.json is 5013
const DEFAULT_API_BASE_URL = 'http://localhost:5013/api';

export class ApiService {
  private static getBaseUrl(): string {
    return localStorage.getItem('backend_api_url') || DEFAULT_API_BASE_URL;
  }

  public static setBaseUrl(url: string): void {
    localStorage.setItem('backend_api_url', url);
  }

  public static getEffectiveBaseUrl(): string {
    return this.getBaseUrl();
  }

  public static async getTodos(): Promise<TodoItem[]> {
    const response = await fetch(`${this.getBaseUrl()}/todos`);
    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.statusText}`);
    }
    return response.json();
  }

  public static async createTodo(todo: TodoItem): Promise<TodoItem> {
    const response = await fetch(`${this.getBaseUrl()}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error(`Failed to create todo: ${response.statusText}`);
    }
    return response.json();
  }

  public static async updateTodo(todo: TodoItem): Promise<void> {
    const response = await fetch(`${this.getBaseUrl()}/todos/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error(`Failed to update todo: ${response.statusText}`);
    }
  }

  public static async deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${this.getBaseUrl()}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete todo: ${response.statusText}`);
    }
  }
}
