import { InMemoryDbService } from 'angular-in-memory-web-api';
import { mockItems } from './mock-items';
import { mockCategories } from './mock-category';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    return { items: mockItems, categories: mockCategories };
  }
}
