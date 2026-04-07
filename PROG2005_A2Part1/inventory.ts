// inventory.ts - Enhanced Inventory System with dialog, validation, localStorage
// Author: Yitong Wu
// Date: 2026-04-07

// ---------- 1. Data Model ----------
interface InventoryItem {
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

// ---------- 2. Global State ----------
let inventory: InventoryItem[] = [];

// ---------- 3. DOM Elements ----------
const tbody = document.getElementById('tableBody') as HTMLTableSectionElement;
const messageDiv = document.getElementById('message') as HTMLDivElement;

const idInput = document.getElementById('itemId') as HTMLInputElement;
const nameInput = document.getElementById('itemName') as HTMLInputElement;
const categorySelect = document.getElementById('category') as HTMLSelectElement;
const quantityInput = document.getElementById('quantity') as HTMLInputElement;
const priceInput = document.getElementById('price') as HTMLInputElement;
const supplierInput = document.getElementById('supplier') as HTMLInputElement;
const stockSelect = document.getElementById('stockStatus') as HTMLSelectElement;
const popularSelect = document.getElementById('popular') as HTMLSelectElement;
const commentInput = document.getElementById('comment') as HTMLInputElement;

const addBtn = document.getElementById('addBtn') as HTMLButtonElement;
const updateBtn = document.getElementById('updateBtn') as HTMLButtonElement;
const searchBtn = document.getElementById('searchBtn') as HTMLButtonElement;
const showAllBtn = document.getElementById('showAllBtn') as HTMLButtonElement;
const showPopularBtn = document.getElementById('showPopularBtn') as HTMLButtonElement;
const searchInput = document.getElementById('searchName') as HTMLInputElement;
const clearStorageBtn = document.getElementById('clearStorageBtn') as HTMLButtonElement;

// Dialog elements
const deleteDialog = document.getElementById('deleteDialog') as HTMLDialogElement;
const deleteDialogMessage = document.getElementById('deleteDialogMessage') as HTMLParagraphElement;
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn') as HTMLButtonElement;
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn') as HTMLButtonElement;
let pendingDeleteName: string | null = null;

// ---------- 4. Helper Functions ----------
function showMessage(msg: string, isError: boolean = false) {
    messageDiv.innerText = msg;
    messageDiv.style.background = isError ? '#ffe0db' : '#e0f2e9';
    setTimeout(() => {
        if (messageDiv.innerText === msg) messageDiv.innerText = '';
    }, 3000);
}

function escapeHtml(str: string): string {
    return str.replace(/[&<>]/g, (m) => {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function saveToLocalStorage() {
    localStorage.setItem('inventoryData', JSON.stringify(inventory));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('inventoryData');
    if (saved) {
        inventory = JSON.parse(saved);
    } else {
        // Default sample data
        inventory = [
            { id: 101, name: "Gaming Laptop", category: "Electronics", quantity: 8, price: 1299.99, supplier: "Dell", stockStatus: "In Stock", popular: "Yes", comment: "High performance" },
            { id: 102, name: "Office Chair", category: "Furniture", quantity: 15, price: 189.50, supplier: "IKEA", stockStatus: "In Stock", popular: "No", comment: "" },
            { id: 103, name: "Wireless Mouse", category: "Electronics", quantity: 2, price: 25.99, supplier: "Logitech", stockStatus: "Low Stock", popular: "Yes", comment: "Last units" }
        ];
    }
}

function clearForm() {
    idInput.value = '';
    nameInput.value = '';
    categorySelect.value = 'Electronics';
    quantityInput.value = '';
    priceInput.value = '';
    supplierInput.value = '';
    stockSelect.value = 'In Stock';
    popularSelect.value = 'No';
    commentInput.value = '';
}

function getItemFromForm(): Omit<InventoryItem, 'id'> {
    return {
        name: nameInput.value.trim(),
        category: categorySelect.value as InventoryItem['category'],
        quantity: parseInt(quantityInput.value) || 0,
        price: parseFloat(priceInput.value) || 0,
        supplier: supplierInput.value.trim(),
        stockStatus: stockSelect.value as InventoryItem['stockStatus'],
        popular: popularSelect.value as InventoryItem['popular'],
        comment: commentInput.value.trim() || undefined
    };
}

// Enhanced validation
function validateForm(isUpdate: boolean = false): boolean {
    const name = nameInput.value.trim();
    if (!name) { showMessage('Item Name is required', true); return false; }
    if (!isUpdate && inventory.some(item => item.name === name)) {
        showMessage('Item Name must be unique. This name already exists.', true);
        return false;
    }
    if (!supplierInput.value.trim()) { showMessage('Supplier Name is required', true); return false; }
    
    const qty = parseFloat(quantityInput.value);
    if (isNaN(qty) || !Number.isInteger(qty) || qty < 0) {
        showMessage('Quantity must be a non-negative integer', true);
        return false;
    }
    
    const price = parseFloat(priceInput.value);
    if (isNaN(price) || price < 0) {
        showMessage('Price must be a non-negative number', true);
        return false;
    }
    if (price * 100 !== Math.floor(price * 100)) {
        showMessage('Price can have at most 2 decimal places', true);
        return false;
    }
    
    const idVal = parseInt(idInput.value);
    if (isNaN(idVal) || !Number.isInteger(idVal) || idVal <= 0) {
        showMessage('Item ID must be a positive integer', true);
        return false;
    }
    return true;
}

// ---------- 5. Rendering ----------
function renderInventory(items: InventoryItem[]) {
    if (!tbody) return;
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10">📭 No items to display</td></tr>';
        return;
    }
    let html = '';
    for (const item of items) {
        html += `<tr>
            <td>${item.id}</td>
            <td>${escapeHtml(item.name)}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${escapeHtml(item.supplier)}</td>
            <td>${item.stockStatus}</td>
            <td>${item.popular}</td>
            <td>${escapeHtml(item.comment || '')}</td>
            <td>
                <button class="edit-btn" data-name="${escapeHtml(item.name)}">✏️ Edit</button>
                <button class="delete-btn" data-name="${escapeHtml(item.name)}">🗑️ Delete</button>
            </td>
        </tr>`;
    }
    tbody.innerHTML = html;

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            if (name) fillFormForEdit(name);
        });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            if (name) deleteItemByName(name);
        });
    });
}

// ---------- 6. Business Logic ----------
function addItem() {
    if (!validateForm(false)) return;
    const newId = parseInt(idInput.value);
    if (inventory.some(item => item.id === newId)) {
        showMessage(`ID ${newId} already exists! Use a unique ID.`, true);
        return;
    }
    const newItemData = getItemFromForm();
    const newItem: InventoryItem = { id: newId, ...newItemData };
    inventory.push(newItem);
    saveToLocalStorage();
    renderInventory(inventory);
    clearForm();
    showMessage(`Item "${newItem.name}" added successfully.`);
}

function fillFormForEdit(name: string) {
    const item = inventory.find(i => i.name === name);
    if (!item) {
        showMessage('Item not found', true);
        return;
    }
    idInput.value = item.id.toString();
    nameInput.value = item.name;
    categorySelect.value = item.category;
    quantityInput.value = item.quantity.toString();
    priceInput.value = item.price.toString();
    supplierInput.value = item.supplier;
    stockSelect.value = item.stockStatus;
    popularSelect.value = item.popular;
    commentInput.value = item.comment || '';
    showMessage(`Now editing "${item.name}". You can change values and click UPDATE.`);
}

function updateItemByName() {
    const oldName = nameInput.value.trim();
    if (!oldName) { showMessage('Item Name cannot be empty for update', true); return; }
    const existingIndex = inventory.findIndex(i => i.name === oldName);
    if (existingIndex === -1) {
        showMessage(`Item "${oldName}" not found, cannot update.`, true);
        return;
    }
    if (!validateForm(true)) return;
    const newId = parseInt(idInput.value);
    if (newId !== inventory[existingIndex].id && inventory.some(i => i.id === newId)) {
        showMessage(`ID ${newId} already used by another item.`, true);
        return;
    }
    const updatedData = getItemFromForm();
    const updatedItem: InventoryItem = { id: newId, ...updatedData };
    inventory[existingIndex] = updatedItem;
    saveToLocalStorage();
    renderInventory(inventory);
    clearForm();
    showMessage(`Item "${updatedItem.name}" updated.`);
}

function deleteItemByName(name: string) {
    pendingDeleteName = name;
    deleteDialogMessage.innerText = `⚠️ Are you sure you want to delete "${name}"?`;
    deleteDialog.showModal();
}

function performDelete() {
    if (pendingDeleteName) {
        const newInventory = inventory.filter(item => item.name !== pendingDeleteName);
        if (newInventory.length === inventory.length) {
            showMessage(`Item "${pendingDeleteName}" not found.`, true);
        } else {
            inventory = newInventory;
            saveToLocalStorage();
            renderInventory(inventory);
            showMessage(`Deleted "${pendingDeleteName}".`);
        }
        pendingDeleteName = null;
    }
    deleteDialog.close();
}

function cancelDelete() {
    pendingDeleteName = null;
    deleteDialog.close();
}

function searchItems() {
    const keyword = searchInput.value.trim().toLowerCase();
    if (!keyword) {
        renderInventory(inventory);
        return;
    }
    const filtered = inventory.filter(item => item.name.toLowerCase().includes(keyword));
    renderInventory(filtered);
    showMessage(`Found ${filtered.length} item(s) matching "${keyword}".`);
}

function showAll() {
    renderInventory(inventory);
    searchInput.value = '';
}

function showPopular() {
    const populars = inventory.filter(item => item.popular === 'Yes');
    renderInventory(populars);
    showMessage(`⭐ ${populars.length} popular item(s).`);
}

function clearAllData() {
    if (confirm('⚠️ This will delete ALL inventory data. Are you sure?')) {
        inventory = [];
        saveToLocalStorage();
        renderInventory(inventory);
        clearForm();
        showMessage('All data cleared.');
    }
}

// ---------- 7. Event Binding & Initialization ----------
addBtn.addEventListener('click', addItem);
updateBtn.addEventListener('click', updateItemByName);
searchBtn.addEventListener('click', searchItems);
showAllBtn.addEventListener('click', showAll);
showPopularBtn.addEventListener('click', showPopular);
clearStorageBtn.addEventListener('click', clearAllData);
confirmDeleteBtn.addEventListener('click', performDelete);
cancelDeleteBtn.addEventListener('click', cancelDelete);
searchInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') searchItems(); });

loadFromLocalStorage();
renderInventory(inventory);
clearForm();