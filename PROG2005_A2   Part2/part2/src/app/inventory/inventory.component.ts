import { Component, OnInit } from '@angular/core';
import { InventoryService, InventoryItem } from '../inventory.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  standalone: false
})
export class InventoryComponent implements OnInit {
  items: InventoryItem[] = [];
  popularItems: InventoryItem[] = [];
  formModel: InventoryItem = this.getEmptyItem();
  editingItem: InventoryItem | null = null;
  message: string = '';

  constructor(private inventoryService: InventoryService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.items = this.inventoryService.getItems();
    this.popularItems = this.inventoryService.getPopularItems();
  }

  getEmptyItem(): InventoryItem {
    return {
      id: 0,
      name: '',
      category: 'Electronics',
      quantity: 0,
      price: 0,
      supplier: '',
      stockStatus: 'In Stock',
      popular: 'No',
      comment: ''
    };
  }

  saveItem() {
    // Basic validation
    if (!this.formModel.name.trim() || !this.formModel.supplier.trim()) {
      this.message = 'Name and Supplier are required.';
      return;
    }
    if (this.formModel.id <= 0 || isNaN(this.formModel.id)) {
      this.message = 'ID must be a positive number.';
      return;
    }
    if (this.formModel.quantity < 0 || isNaN(this.formModel.quantity)) {
      this.message = 'Quantity must be non-negative.';
      return;
    }
    if (this.formModel.price < 0 || isNaN(this.formModel.price)) {
      this.message = 'Price must be non-negative.';
      return;
    }

    if (this.editingItem) {
      // Update
      const success = this.inventoryService.updateItem(this.editingItem.name, { ...this.formModel });
      if (success) {
        this.message = `Item "${this.formModel.name}" updated.`;
        this.resetForm();
      } else {
        this.message = 'Update failed: item not found.';
      }
    } else {
      // Add
      if (this.items.some(i => i.id === this.formModel.id)) {
        this.message = `ID ${this.formModel.id} already exists.`;
        return;
      }
      if (this.items.some(i => i.name === this.formModel.name)) {
        this.message = `Name "${this.formModel.name}" already exists.`;
        return;
      }
      this.inventoryService.addItem({ ...this.formModel });
      this.message = `Item "${this.formModel.name}" added.`;
      this.resetForm();
    }
    this.loadData();
  }

  editItem(item: InventoryItem) {
    this.editingItem = item;
    this.formModel = { ...item };
    this.message = `Editing "${item.name}". Click Update to save.`;
  }

  deleteItem(name: string) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const success = this.inventoryService.deleteItem(name);
      if (success) {
        this.message = `Deleted "${name}".`;
        this.loadData();
        this.resetForm();
      } else {
        this.message = `Item "${name}" not found.`;
      }
    }
  }

  resetForm() {
    this.formModel = this.getEmptyItem();
    this.editingItem = null;
    this.message = '';
  }
}