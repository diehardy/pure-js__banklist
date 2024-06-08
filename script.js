'use strict';

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

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

let inputLoginUsername = document.querySelector('.login__input--user');
let inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
let inputCloseUsername = document.querySelector('.form__input--user');
let inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function (movements) {
  containerMovements.innerHTML = ''

  const movementsToInsert = movements.map((mov, i) => {
    return `        
        <div class="movements__row">
          <div class="movements__type movements__type--${mov > 0 ? 'deposit' : 'withdrawal'}">
          ${i + 1} ${mov > 0 ? 'deposit' : 'withdrawal'}
          </div>
          <div class="movements__value">${mov}$</div>
        </div>
      `;
  })
  movementsToInsert.reverse()
  containerMovements.insertAdjacentHTML('afterbegin', movementsToInsert)


}



const createUsernames = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('')
  })

}
createUsernames(accounts);

// const movements = [25, -150, 252, 66, -1]
// const deposits = movements.filter(mov => mov > 0)

// const withrawals = movements.filter(mov => mov < 0)


const calcPrintBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov, i) => {
    return acc + mov
  }, 0)
  labelBalance.innerHTML = account.balance + "$"
}




const calcPrintSummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur)
  labelSumIn.textContent = `${incomes}$`;

  const withdrawals = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur)
  labelSumOut.textContent = `${withdrawals}$`.slice(1);

  const interest = acc.movements.filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100)
    .filter(deposit => deposit > 1)
    .reduce((acc, cur) => acc + cur)
  labelSumInterest.textContent = `${interest}$`;

}



let authorizedAccount = ''


const findAccount = function (login, pin) {
  console.log('login:', login);
  console.log('pin:', pin);

  const user = accounts.find(acc => acc.username === login)
  const isCorrectPIN = accounts.find(acc => acc.pin === pin)
  console.log(user);
  if (user && isCorrectPIN) {

    authorizedAccount = user
    inputLoginUsername.value = inputLoginPin.value = '';
    labelWelcome.textContent = `Welcome back, ${authorizedAccount.owner.split(' ')[0]}!`;
    containerApp.style.opacity = 1;




    updateUI()

  }
  else console.log(`nope, you didn't make it!`);

}



btnLogin.addEventListener('click', function (e) {
  e.preventDefault()
  findAccount(inputLoginUsername.value, Number(inputLoginPin.value))
})



btnTransfer.addEventListener('click', function (e) {
  e.preventDefault()
  let transferMoney = Number(inputTransferAmount.value)
  let accountTo = accounts.find(acc => acc.username === inputTransferTo.value)
  if (accountTo && authorizedAccount.balance >= transferMoney && transferMoney > 0 && accountTo !== authorizedAccount) {
    authorizedAccount.movements.push(-transferMoney)
    accountTo.movements.push(transferMoney)
    transferMoney = 0
    accountTo = '';
    inputTransferAmount.value = '';
    inputTransferTo.value = '';
    alert('you sent money successfully!')
  }
  else {
    alert('something went wrong!')
  }
  updateUI()

})



const updateUI = function () {
  calcPrintSummary(authorizedAccount)
  calcPrintBalance(authorizedAccount)
  displayMovements(authorizedAccount.movements)
}



// console.log('account 1 movements:', account1.movements)
// let toEUR = 1.1
// const depositsEUR = account1.movements
//   .filter((mov) => mov > 0)
//   .map(mov => mov * toEUR)
//   .reduce((acc, cur, i, arr) => acc + cur)



// console.log('Deposits EUROS:', depositsEUR);