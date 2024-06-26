'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2024-06-11T12:01:20.894Z',
    '2024-06-11T12:01:20.894Z',
    '2024-06-11T12:01:20.894Z',
    '2024-06-09T12:01:20.894Z',
    '2024-06-11T12:01:20.894Z',
    '2024-06-11T12:01:20.894Z',
    '2024-06-11T12:01:20.894Z',
    '2024-06-12T12:01:20.894Z',
  ],
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90, 500, +1000, 1760],
  interestRate: 1,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
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

let isSorted = false
let timer = ''
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ''
  if (sort) {
    isSorted = true
    acc.movements = [...acc.movements].sort((a, b) => a - b)
  } else isSorted = false
  const movementsToInsert = acc.movements.map((mov, i) => {
    let dateToDisplay = ''
    if (7 < Math.abs(new Date(calcDaysPassed(new Date(), new Date(acc.movementsDates[i]))))) {
      dateToDisplay = new Date(acc.movementsDates[i]).toLocaleDateString()
    } else if (Math.abs(new Date(calcDaysPassed(new Date(), new Date(acc.movementsDates[i])))) === 0) { dateToDisplay = 'today' }
    else {
      dateToDisplay = Math.abs(new Date(calcDaysPassed(new Date(), new Date(acc.movementsDates[i])))) + ' days ago';
    }

    return `        
        <div class="movements__row">
          <div class="movements__type movements__type--${mov > 0 ? 'deposit' : 'withdrawal'}">
          ${i + 1} ${mov > 0 ? 'deposit' : 'withdrawal'}
          </div>
          <div class="movements__date">${dateToDisplay}</div>
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
  //console.log(user);
  if (user && isCorrectPIN) {


    authorizedAccount = user
    inputLoginUsername.value = inputLoginPin.value = '';
    labelWelcome.textContent = `Welcome back, ${authorizedAccount.owner.split(' ')[0]}!`;
    containerApp.style.opacity = 1;
    updateTimer()





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
    authorizedAccount.movementsDates.push(new Date().toISOString())
    accountTo.movements.push(transferMoney)
    accountTo.movementsDates.push(new Date().toISOString())
    transferMoney = 0
    accountTo = '';
    inputTransferAmount.value = '';
    inputTransferTo.value = '';
    updateTimer()
    alert('you sent money successfully!')

  }
  else {
    updateTimer()
    alert('something went wrong!')
  }

})



const updateUI = function (acc) {
  calcPrintSummary(acc)
  calcPrintBalance(acc)
  displayMovements(acc)
}


btnClose.addEventListener('click', function (e) {
  e.preventDefault()

  const userLoginToDelete = inputCloseUsername.value;
  const userPinToDelete = Number(inputClosePin.value);

  const indexToDelete = accounts.findIndex((el) => el.username === userLoginToDelete)

  if (
    accounts[indexToDelete] === authorizedAccount && userPinToDelete === accounts[indexToDelete].pin
  ) { accounts.splice(indexToDelete, 1) }


  containerApp.style.opacity = 0
  inputCloseUsername.value = inputClosePin.value = ''
})



btnLoan.addEventListener('click', function (e) {
  e.preventDefault()
  updateTimer()
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && authorizedAccount.movements.some(mov => mov >= amount * 0.1)) {
    alert('Money will arrive soon!')
    setTimeout(() => {
      authorizedAccount.movements.push(amount)
      authorizedAccount.movementsDates.push(new Date().toISOString())
      inputLoanAmount.value = ''
    }, 200)

  }
})


let flag = 0

btnSort.addEventListener('click', function (e) {
  e.preventDefault()
  updateTimer()
  displayMovements(authorizedAccount, !isSorted)
})

const options = {
  hour: 'numeric',
  minute: 'numeric',
  weekday: 'long'
}
labelDate.textContent = new Intl.DateTimeFormat('en-US', options).format(new Date())


const calcDaysPassed = (date1, date2) => (date2 - date1) / (1000 * 60 * 60 * 24)






const setLogOutTimer = function () {
  let time = 300
  const tick = () => {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0)
    const seconds = String(Math.trunc(time % 60)).padStart(2, 0)
    if (time === 0) {
      clearInterval(timer)
      containerApp.style.opacity = 0
      authorizedAccount = ''
      labelWelcome.textContent = 'Log in to get started'
    }
    // console.log('timer is ticking');
    if (authorizedAccount) updateUI(authorizedAccount)
    labelTimer.textContent = minutes + ':' + seconds
    --time;
  }

  let timer = setInterval(tick, 1000)
  return timer
}






const updateTimer = function () {
  if (timer) clearInterval(timer)
  timer = setLogOutTimer()
}