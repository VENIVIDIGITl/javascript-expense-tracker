const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(event) {
  event.preventDefault();
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: Number(amount.value)
    };

    transactions.push(transaction);
    // Update transactions in DOM
    addTransactionDOM(transaction);
    // Update Balance, Income and Expense in DOM
    updateValues();
    // Reset form
    text.value = '';
    amount.value = '';
    // Update localStorage
    updateLocalStorage();
  }
}


// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}


// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  // Update localStorage
  updateLocalStorage();
  // Init to update DOM
  init();
}


// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');
  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = /* html */`
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button 
      class="delete-btn" 
      title="Delete transaction"
      onclick="removeTransaction(${transaction.id})">
      x
    </button>
  `;

  list.appendChild(item);
}


// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);

  const expense = (amounts
    .filter(item => item < 0)
    .reduce((acc, item) => acc + item, 0) * -1)
    .toFixed(2);

  balance.textContent = `$${total}`;
  moneyPlus.textContent = `$${income}`;
  moneyMinus.textContent = `$${expense}`;
}


// Update localStorage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}


// Init app
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}


init();

form.addEventListener('submit', addTransaction);
