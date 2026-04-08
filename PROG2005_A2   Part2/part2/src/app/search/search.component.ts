import { Component } from '@angular/core';
import { InventoryService, InventoryItem } from '../inventory.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  standalone: false
})
export class SearchComponent {
  keyword: string = '';
  searchResults: InventoryItem[] = [];

  constructor(private inventoryService: InventoryService) {
    this.searchResults = this.inventoryService.getItems();
  }

  search() {
    this.searchResults = this.inventoryService.searchByName(this.keyword);
  }

  clear() {
    this.keyword = '';
    this.searchResults = this.inventoryService.getItems();
  }
}