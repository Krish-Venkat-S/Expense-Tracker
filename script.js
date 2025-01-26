class ExpenseTracker {
  constructor() {
      this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      this.initializeElements();
      this.setupEventListeners();
      this.updateUI();
      this.loadTheme();
  }

  initializeElements() {
      this.balanceEl = document.getElementById('balance');
      this.incomeEl = document.getElementById('income-amount');
      this.expenseEl = document.getElementById('expense-amount');
      this.transactionList = document.getElementById('transaction-list');
      this.transactionForm = document.getElementById('transaction-form');
      this.nameInput = document.getElementById('transaction-name');
      this.amountInput = document.getElementById('transaction-amount');
      this.typeInput = document.getElementById('transaction-type');
      this.categoryInput = document.getElementById('transaction-category');
      this.themeToggle = document.getElementById('theme-toggle');
      this.filterButtons = document.querySelectorAll('.filter-btn');
  }

  setupEventListeners() {
      this.transactionForm.addEventListener('submit', this.addTransaction.bind(this));
      this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
      this.filterButtons.forEach(btn => {
          btn.addEventListener('click', this.filterTransactions.bind(this));
      });
  }

  addTransaction(e) {
      e.preventDefault();
      const transaction = {
          id: Date.now(),
          name: this.nameInput.value,
          amount: parseFloat(this.amountInput.value),
          type: this.typeInput.value,
          category: this.categoryInput.value
      };

      if (transaction.amount === 0 || isNaN(transaction.amount)) {
          alert('Please enter a valid amount');
          return;
      }

      this.transactions.push(transaction);
      this.saveTransactions();
      this.updateUI();
      this.resetForm();
  }

  saveTransactions() {
      localStorage.setItem('transactions', JSON.stringify(this.transactions));
  }

  updateUI() {
      this.transactionList.innerHTML = '';
      const income = this.calculateTotalByType('income');
      const expense = this.calculateTotalByType('expense');
      const balance = income - expense;

      this.balanceEl.textContent = `$${balance.toFixed(2)}`;
      this.incomeEl.textContent = `$${income.toFixed(2)}`;
      this.expenseEl.textContent = `$${expense.toFixed(2)}`;

      this.transactions.forEach(transaction => {
          const listItem = document.createElement('li');
          listItem.classList.add('transaction-item', transaction.type);
          listItem.innerHTML = `
              <div>
                  <strong>${transaction.name}</strong>
                  <small>${transaction.category}</small>
              </div>
              <div>
                  <span>$${Math.abs(transaction.amount).toFixed(2)}</span>
                  <button onclick="tracker.deleteTransaction(${transaction.id})">🗑️</button>
              </div>
          `;
          this.transactionList.appendChild(listItem);
      });
  }

  calculateTotalByType(type) {
      return this.transactions
          .filter(t => t.type === type)
          .reduce((total, transaction) => total + transaction.amount, 0);
  }

  deleteTransaction(id) {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.saveTransactions();
      this.updateUI();
  }

  filterTransactions(e) {
      const filter = e.target.dataset.filter;
      this.filterButtons.forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');

      const transactionItems = this.transactionList.querySelectorAll('.transaction-item');
      transactionItems.forEach(item => {
          if (filter === 'all') {
              item.style.display = 'flex';
          } else {
              item.style.display = item.classList.contains(filter) ? 'flex' : 'none';
          }
      });
  }

  toggleTheme() {
      const themeIcon = this.themeToggle.querySelector('i');
      document.body.classList.toggle('light-theme');
      document.body.classList.toggle('dark-theme');
      
      if (document.body.classList.contains('dark-theme')) {
          themeIcon.classList.remove('fa-moon');
          themeIcon.classList.add('fa-sun');
          localStorage.setItem('theme', 'dark');
      } else {
          themeIcon.classList.remove('fa-sun');
          themeIcon.classList.add('fa-moon');
          localStorage.setItem('theme', 'light');
      }
  }

  loadTheme() {
      const savedTheme = localStorage.getItem('theme');
      const themeIcon = this.themeToggle.querySelector('i');

      if (savedTheme === 'dark') {
          document.body.classList.remove('light-theme');
          document.body.classList.add('dark-theme');
          themeIcon.classList.remove('fa-moon');
          themeIcon.classList.add('fa-sun');
      } else {
          document.body.classList.remove('dark-theme');
          document.body.classList.add('light-theme');
          themeIcon.classList.remove('fa-sun');
          themeIcon.classList.add('fa-moon');
      }
  }

  resetForm() {
      this.nameInput.value = '';
      this.amountInput.value = '';
      this.typeInput.value = 'expense';
      this.categoryInput.value = 'other';
  }
}

const tracker = new ExpenseTracker();