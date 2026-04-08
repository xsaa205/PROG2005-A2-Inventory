import { Injectable } from '@angular/core';

export interface InventoryItem {
  id: number;
  name: string;
  category: 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';
  quantity: number;
  price: number;
  supplier: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  popular: 'Yes' | 'No';
  comment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private items: InventoryItem[] = [];

  constructor() { }

  getItems(): InventoryItem[] {
    return this.items;
  }

  addItem(item: InventoryItem): void {
    this.items.push(item);
  }

  updateItem(oldName: string, newItem: InventoryItem): boolean {
    const index = this.items.findIndex(i => i.name === oldName);
    if (index !== -1) {
      this.items[index] = newItem;
      return true;
    }
    return false;
  }

  deleteItem(name: string): boolean {
    const lenBefore = this.items.length;
    this.items = this.items.filter(i => i.name !== name);
    return this.items.length !== lenBefore;
  }

  searchByName(keyword: string): InventoryItem[] {
    if (!keyword.trim()) return this.items;
    return this.items.filter(i => i.name.toLowerCase().includes(keyword.toLowerCase()));
  }

  getPopularItems(): InventoryItem[] {
    return this.items.filter(i => i.popular === 'Yes');
  }
}