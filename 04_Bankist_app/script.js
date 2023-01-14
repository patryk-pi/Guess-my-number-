'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const loginForm = document.querySelector(".login");
const transferForm = document.querySelector('.form--transfer');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
    containerMovements.innerHTML = "";

    const movs = sort ? movements.slice().sort((a,b) => a-b) : movements;
    movs.forEach(functicon (mov, i) {

        const type = mov > 0 ? "deposit" : "withdrawal"
        const html = `<div class="movements__row">
                    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                    <div class="movements__value">${mov}</div>
                  </div>`;

        containerMovements.insertAdjacentHTML("afterbegin", html)
    });
};

const calcDisplayBalance = function (account) {
    account.balance = account.movements.reduce(function (acc, mov) {
        return acc + mov;
    }, 0);
    labelBalance.textContent = `${account.balance}€`
};


const calcDisplaySummary = function (account) {
    const incomes = account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov);
    labelSumIn.textContent = `${incomes}€`

    const out = account.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov);
    labelSumOut.textContent = `${Math.abs(out)}€`;

    const interest = account.movements
        .filter(mov => mov > 0)
        .map(deposit => deposit * account.interestRate / 100)
        .filter((int, i, arr) => int > 1)
        .reduce((acc, int) => acc + int);
    labelSumInterest.textContent = `${interest}`;
}


const createUsernames = function (accs) {
    accs.forEach(function (acc) {

            acc.username = acc.owner.toLocaleLowerCase().split(" ").map(function (name) {
                return name[0];
            }).join("");

        }
    )
};

createUsernames(accounts);

const updateUI = acc => {
    displayMovements(acc.movements);
    calcDisplayBalance(acc);
    calcDisplaySummary(acc);
}

// Even handler

let currentAccount;

loginForm.addEventListener('submit', e => {
    e.preventDefault();

    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = '100';
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();
        updateUI(currentAccount)
    }
});

transferForm.addEventListener('submit', e => {
    e.preventDefault();

    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

    if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount) {
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);
        updateUI(currentAccount);
    }

    inputTransferAmount.value = inputTransferTo.value = '';
});

btnClose.addEventListener('click', e => {
    e.preventDefault();
    if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
        const index = accounts.findIndex(acc => acc.username === currentAccount.username)


        // Delete account
        accounts.splice(index, 1)

        // Hide UI
        containerApp.style.opacity = "0";
    }

    inputCloseUsername.value = inputClosePin.value = ""
});

btnLoan.addEventListener('click', e => {
    e.preventDefault();

    const amount = Number(inputLoanAmount.value);

    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

        currentAccount.movements.push(amount);
        updateUI(currentAccount);
    }
    inputLoanAmount.value = ''
});

let sorted = false;
btnSort.addEventListener('click', e => {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted


})


