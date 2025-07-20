let stock = JSON.parse(localStorage.getItem('stock')) || [];
let sales = JSON.parse(localStorage.getItem('sales')) || [];

function saveData() {
  localStorage.setItem('stock', JSON.stringify(stock));
  localStorage.setItem('sales', JSON.stringify(sales));
}

function addToStock() {
  const name = document.getElementById('itemName').value.trim();
  const cost = parseFloat(document.getElementById('costPrice').value);
  const qty = parseInt(document.getElementById('quantity').value);

  if (!name || isNaN(cost) || isNaN(qty) || cost <= 0 || qty <= 0) return alert('Fill valid item data.');

  const existing = stock.find(i => i.name === name && i.cost === cost);
  if (existing) {
    existing.quantity += qty;
  } else {
    stock.push({ name, cost, quantity: qty });
  }

  saveData();
  document.getElementById('itemName').value = '';
  document.getElementById('costPrice').value = '';
  document.getElementById('quantity').value = '';
  render();
}

function deleteItem(name, cost) {
  stock = stock.filter(item => !(item.name === name && item.cost === cost));
  saveData();
  render();
}

function sellItem() {
  const name = document.getElementById('sellItemSelect').value;
  const sellPrice = parseFloat(document.getElementById('sellPrice').value);
  const sellQty = parseInt(document.getElementById('sellQuantity').value);
  const date = document.getElementById('sellDate').value || new Date().toISOString().split('T')[0];

  if (!name || isNaN(sellPrice) || isNaN(sellQty) || sellPrice <= 0 || sellQty <= 0) {
    return alert('Fill valid sale details.');
  }

  const item = stock.find(i => i.name === name);
  if (!item || item.quantity < sellQty) return alert('Not enough stock.');

  item.quantity -= sellQty;

  const profit = (sellPrice - item.cost) * sellQty;
  sales.push({ name, cost: item.cost, sell: sellPrice, quantity: sellQty, date, profit });

  saveData();
  document.getElementById('sellPrice').value = '';
  document.getElementById('sellQuantity').value = '';
  document.getElementById('sellDate').value = '';
  render();
}

function render() {
  const invTable = document.getElementById('inventoryTable');
  const selItem = document.getElementById('sellItemSelect');
  const salesTable = document.getElementById('salesTable');
  const totalProfitEl = document.getElementById('totalProfit');

  // Inventory Table
  invTable.innerHTML = '';
  stock.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>₹${item.cost}</td>
      <td>${item.quantity}</td>
      <td><button onclick="deleteItem('${item.name}', ${item.cost})">Delete</button></td>
    `;
    invTable.appendChild(row);
  });

  // Sell Item Dropdown
  selItem.innerHTML = '';
  stock.forEach(item => {
    if (item.quantity > 0) {
      const opt = document.createElement('option');
      opt.value = item.name;
      opt.text = item.name;
      selItem.add(opt);
    }
  });

  // Sales Table
  salesTable.innerHTML = '';
  let totalProfit = 0;
  sales.forEach(s => {
    totalProfit += s.profit;
    const row = `<tr>
      <td>${s.name}</td>
      <td>₹${s.cost}</td>
      <td>₹${s.sell}</td>
      <td>${s.quantity}</td>
      <td>${s.date}</td>
      <td>₹${s.profit}</td>
    </tr>`;
    salesTable.innerHTML += row;
  });

  totalProfitEl.textContent = `₹${totalProfit}`;
}

window.onload = render;
