
import './css/styles.css';
import Customer from './Classes/Customer'
import Booking from './Classes/Booking'
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'
import customersData from './data/customersData';

const bookings = document.querySelector('.bookings')
const welcomeMessage = document.querySelector('.welcome-message')
const totalSpent = document.querySelector('.total-amount-spent')
const searchButton = document.querySelector('.search-button')
const datePicker = document.querySelector('#date-picker')
const mainDisplay = document.querySelector('.customers-bookings')
const availableRoomsWapper = document.querySelector('.available-rooms-wrapper')
const filterWrapper = document.querySelector('.filter-wrapper')
const backToBookings = document.querySelector('.back-to-bookings')
const filterButton = document.querySelector('.filter-button')
const suiteButton = document.querySelector('#suite')
const singleRoomButton = document.querySelector('#singleRoom')
const resSuiteButton = document.querySelector('#residentialSuite')
const junSuiteButton = document.querySelector('#juniorSuite')
const allButton = document.querySelector('#all')
const filterSection = document.querySelector('.filter-section')
const bookRoomPage = document.querySelector('.book-room-page')
const selectDateBox = document.querySelector('.select-date')
const roomDetails = document.querySelector('.room-details')
const backToAvailableRoomsButton = document.querySelector('#backButton')
const confirmBookingButton = document.querySelector('#confirmButton')
const selectDateMessage = document.querySelector('.select-message')
const availableRoomsMesssage = document.querySelector('.available-rooms-message')
const loginPage = document.querySelector('.login-form-wrapper')
const usernameInput = document.querySelector('#usernameInput')
const passwordInput = document.querySelector('#passwordInput')
const loginButton = document.querySelector('.login-button')
const loginErrorMessage = document.querySelector('.login-error-message')
const showPasswordBox = document.querySelector('.show-password')
const backToLoginButton = document.querySelector('.back-to-login-button')
const managerAvailableRooms = document.querySelector('.manager-available-rooms')
const managerScreenWrapper = document.querySelector('.manager-screen-wrapper')
const managerDatePicker = document.querySelector('#manager-date-picker')
const managerScreenMessage = document.querySelector('#manager-dash-message')
const managerStats = document.querySelector('.manager-stats')
const managerDateSearchButton = document.querySelector('#manager-date-search-button')
const managerCustomerSearchButton = document.querySelector('#search-customer-button')
const customerSearchInput = document.querySelector('#customer-name-search')

let newCustomer
let bookingsData
let roomsData
let desiredRoom

let userNames = ['customer1', 'customer2', 'customer3', 'customer4', 'customer5', 'customer6', 'customer7', 'customer8', 'customer9', 'customer10', 'customer11', 'customer12', 'customer13', 'customer14', 'customer15', 'customer16', 'customer17', 'customer18', 'customer19', 'customer20', 'customer21', 'customer22', 'customer23', 'customer24', 'customer25', 'customer26', 'customer27', 'customer28', 'customer29', 'customer30', 'customer31', 'customer32', 'customer33', 'customer34', 'customer35', 'customer36', 'customer37', 'customer38', 'customer39', 'customer40', 'customer41', 'customer42', 'customer43', 'customer44', 'customer45', 'customer46', 'customer47', 'customer48', 'customer49', 'customer50']


loginButton.addEventListener('click', (event) => {
    event.preventDefault()
    let year = new Date().getFullYear()
    let month = new Date().getMonth() + 1
    let day = new Date().getDate()
    if (day.toString().length === 1) {
        day = `0${day}`
    }
    if (month.toString().length === 1) {
        month = `0${month}`
    }
    let today = `${year}/${month}/${day}`
    if (usernameInput.value === 'manager' && passwordInput.value === 'overlook2021') {
        managerLogin(today)
    } else {
        loginHandler()
    }
})

managerDateSearchButton.addEventListener('click', () => {
    populateManagerAvailableRooms(managerDatePicker.value.split('-').join('/'))
})

managerCustomerSearchButton.addEventListener('click', () => {

    let custName = customerSearchInput.value.toLowerCase()
    let theCustomer = customersData.customers.find(customer => customer.name.toLowerCase() === custName)
    let theBookings = bookingsData.filter(booking => booking.userID === theCustomer.id).sort((a, b) => a.date.charAt(6) - b.date.charAt(6))
    managerAvailableRooms.style = `border-style: solid; border-width: 2px; height: 60%; width: 80%; overflow: auto; background-color: #7500ff;`
    managerAvailableRooms.innerHTML = `<div class="customer-details"><p id="customers-name">${theCustomer.name}</p></div>`
    theBookings.forEach(booking => {
        document.querySelector('.customer-details').innerHTML += `<div class="customers-booking"><p>Room: ${booking.roomNumber}</p><p>Date: ${booking.date}</p></div>`
    })
    let totalSpent = roomsData.reduce((sum, room) => {
        theBookings.forEach(booking => {
            if (booking.roomNumber === room.number) {
                sum += room.costPerNight
            }
        })
        return sum
    }, 0).toFixed(2)
    document.querySelector('#revenue').innerHTML = `Total Spent: $${totalSpent}`
    document.querySelector('#percent-occupied').innerHTML = ``
})

confirmBookingButton.addEventListener('click', () => {
    fetchPostBookings()
})

backToLoginButton.addEventListener('click', () => {
    hide(mainDisplay)
    hide(filterWrapper)
    hide(selectDateBox)
    hide(bookRoomPage)
    hide(backToLoginButton)
    hide(managerScreenWrapper)
    show(loginPage)
    usernameInput.value = ''
    passwordInput.value = ''
    welcomeMessage.innerText = 'Welcome to Overlook'
    loginErrorMessage.innerText = ''
})

backToBookings.addEventListener('click', () => {
    fetchBookings()
    populateBookings(newCustomer)
    hide(filterWrapper)
    show(selectDateBox)
    show(mainDisplay)
})

showPasswordBox.addEventListener('click', toggleShowPassword)

availableRoomsWapper.addEventListener('click', (event) => {
    showBookRoomPage(event)
})

filterButton.addEventListener('click', () => {
    filterByRoomType()
})

backToAvailableRoomsButton.addEventListener('click', () => {
    hide(bookRoomPage)
    show(selectDateBox)
    showAvailableRooms(datePicker.value)
})

filterSection.addEventListener('click', (event) => {
    radioHandler(event)
})

searchButton.addEventListener('click', () => {
    showAvailableRooms(datePicker.value)
})

function fetchBookings() {
        fetch('http://localhost:3001/api/v1/bookings')
        .then(response => response.json())
        .then(data => bookingsData = data.bookings)
}

function fetchPostBookings() {
    fetch('http://localhost:3001/api/v1/bookings', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ "userID": newCustomer.id, "date": newCustomer.dateDesired, "roomNumber": parseInt(desiredRoom) })
    })
    .then(response => response.json())
    .then(() => {
        fetch('http://localhost:3001/api/v1/bookings')
        .then(response => response.json())
        .then(data => {
          bookingsData = data.bookings
          let theRoom = roomsData.filter(room => room.number === parseInt(desiredRoom))
          newCustomer.selectRoomForBooking(theRoom[0])
          hide(filterWrapper)
          hide(bookRoomPage)
          show(mainDisplay)
          show(selectDateBox)
          populateBookings(newCustomer)
        })
    })
}


function fetchRooms() {
    fetch('http://localhost:3001/api/v1/rooms')
    .then(response => response.json())
    .then(data => {
        roomsData = data.rooms
        fetchCustomers()
    })

}

function fetchCustomers() {
    fetch('http://localhost:3001/api/v1/customers')
    .then(response => response.json())
    .then(data => {
        let customerID = usernameInput.value.split('customer')[1]
        let customerName = data.customers.filter(customer => {
          if (customer.id === parseInt(customerID)) {
            return customer
          }
        })[0].name
        newCustomer = new Customer(parseInt(customerID), customerName)
        populateBookings(newCustomer)
    }
)}

function populateBookings(currentCust) {
    show(backToLoginButton)
    welcomeMessage.innerText = `Welcome to Overlook, ${currentCust.name}`
    currentCust.bookings = bookingsData.filter(booking => booking.userID === currentCust.id)
    currentCust.bookings.sort((a, b) => a.date.charAt(6) - b.date.charAt(6))
    bookings.innerHTML = ''
        currentCust.bookings.forEach(element => {
            new Booking(element.id, element.userID, element.date, element.roomNumber)
            bookings.innerHTML += `<div class="single-booking"><p class="single-booking-details">Room Number: ${element.roomNumber} Date: ${element.date}</p></div><br>`
            })
        let total = currentCust.bookings.reduce((sum, booking) => {
            roomsData.forEach(room => {
             if (booking.roomNumber === room.number) {
                sum += room.costPerNight
            }   
            })
            return sum
        }, 0).toFixed(2)
        totalSpent.innerText = `You have spent $${total} on bookings with us.`
}

function populateManagerAvailableRooms(input) {
    fetch('http://localhost:3001/api/v1/bookings')
    .then(response => response.json())
    .then(data => {
        bookingsData = data.bookings
        fetch('http://localhost:3001/api/v1/rooms')
        .then(response => response.json())
        .then(data => {
        roomsData = data.rooms
        managerAvailableRooms.innerHTML = ''
        
        let todaysBookings = bookingsData.reduce((list, booking) => {
            if (booking.date === input) {
                list.push(booking.roomNumber)
            }
            return list
        }, [])
        
        let rooms = roomsData.reduce((list, room) => {
            if (!todaysBookings.includes(room.number)) {
                list.push(room)
            }
            return list
        }, [])

        rooms.forEach(room => {
            managerAvailableRooms.innerHTML += `<div class="single-manager-available-room" id="m${room.number}"><p class="sub-stat">Room: ${room.number}</p><p class="sub-stat">Type: ${room.roomType}</p><p class="sub-stat">Bidet: ${room.bidet}</p><p class="sub-stat">Beds: ${room.numBeds} ${room.bedSize}</p><p class="sub-stat">Price: $${room.costPerNight}</p></div>`
        })

        let totalRev = roomsData.reduce((sum, room) => {
            if (todaysBookings.includes(room.number)) {
                sum += room.costPerNight
            }
            return sum
        }, 0).toFixed(2)
        
        let percentBooked = (todaysBookings.length/25) * 100

        managerStats.innerHTML = `<div class="stat" id="revenue">Total Revenue: $${totalRev}</div><br><div class="stat" id="percent-occupied">Percent Booked: ${percentBooked}%</div>`
    })
    })
}

function showBookRoomPage(event)  {
    desiredRoom = event.target.id
    if (event.target.classList.contains('available-rooms')) {
    hide(mainDisplay)
    hide(filterWrapper)
    hide(selectDateBox)
    show(bookRoomPage)
    let bidetMessage
    let selectedRoom = roomsData.find(room => {
        if (room.number === parseInt(event.target.id)) {
            if (room.bidet) {
                bidetMessage = 'Includes bidet.'
            } else {
                bidetMessage = 'Does not include bidet.'
            }
            return room
        }
    })
    roomDetails.innerHTML = `<div class="booking-room-details">Room: ${selectedRoom.number}<br>Room Type: ${selectedRoom.roomType}<br>Price: $${selectedRoom.costPerNight}<br>Beds: ${selectedRoom.numBeds} ${selectedRoom.bedSize}<br>${bidetMessage}</div>`
}
}

function showAvailableRooms(input) {
    allButton.checked = true
    singleRoomButton.checked = false
    suiteButton.checked = false
    resSuiteButton.checked = false
    junSuiteButton.checked = false
    if (input !== '') {
        hide(mainDisplay)
        hide(selectDateBox)
        show(filterWrapper)
        selectDateMessage.innerText = 'Select a date to book your stay!'
        let availableRooms = newCustomer.selectDate(input.split('-').join('/'), bookingsData, roomsData)
        availableRoomsMesssage.innerText = `Available Rooms on ${newCustomer.dateDesired}`
        availableRoomsWapper.innerHTML = ''
        if (availableRooms.length !== 0) {
            availableRooms.forEach(element => {
                availableRoomsWapper.innerHTML += `<button class="available-rooms" id="${element.number}">Room ${element.number}: ${element.roomType} <br>Beds: ${element.numBeds} ${element.bedSize} <br>Cost per night: $${element.costPerNight}</button>`
            })
        } else {
            availableRoomsWapper.innerHTML = `<p class="filter-apology-message">We fiercely apologize! There are no rooms available on this date.`
        }
    } else {
        selectDateMessage.innerText = 'Please select a date to book your stay.'
    }
}

function filterByRoomType() {
    let types = []
    if (suiteButton.checked) {
        types.push('suite')
    } else if (singleRoomButton.checked) {
        types.push('single room')
    } else if (resSuiteButton.checked) {
        types.push('residential suite')
    } else if (junSuiteButton.checked) {
        types.push('junior suite')
    } else if (allButton.checked) {
        types.push('suite', 'single room', 'residential suite', 'junior suite')
    }
    let availableRooms = newCustomer.selectDate(newCustomer.dateDesired, bookingsData, roomsData)
    let filteredRooms = availableRooms.filter(room => {
        if (types.includes(room.roomType)) {
            return room 
        }
    })
    availableRoomsWapper.innerHTML = ''
    if (filteredRooms.length !== 0) {
    filteredRooms.forEach(element => {
        availableRoomsWapper.innerHTML += `<button class="available-rooms" id="${element.number}">Room ${element.number}: ${element.roomType} <br>Beds: ${element.numBeds} ${element.bedSize} <br>Cost per night: $${element.costPerNight}</button>`
        })
    } else {
        availableRoomsWapper.innerHTML = `<p class="filter-apology-message">We fiercely apologize! There are no rooms of this type available on this date.`
    }
}

function radioHandler(event) {
    if (event.target.id === 'singleRoom') {
        suiteButton.checked = false
        resSuiteButton.checked = false
        junSuiteButton.checked = false
        allButton.checked = false
    } else if (event.target.id === 'suite') {
        singleRoomButton.checked = false
        resSuiteButton.checked = false
        junSuiteButton.checked = false
        allButton.checked = false
    } else if (event.target.id === 'residentialSuite') {
        singleRoomButton.checked = false
        suiteButton.checked = false
        junSuiteButton.checked = false
        allButton.checked = false
    } else if (event.target.id === 'juniorSuite') {
        singleRoomButton.checked = false
        suiteButton.checked = false
        resSuiteButton.checked = false
        allButton.checked = false
    } else if (event.target.id === 'all') {
        singleRoomButton.checked = false
        suiteButton.checked = false
        resSuiteButton.checked = false
        junSuiteButton.checked = false
    }
}

function loginHandler() {
    if (!userNames.some(userName => userName === usernameInput.value) && usernameInput.value !== 'manager') {
        loginErrorMessage.innerText = 'Incorrect Username, try again.'
    } else if (passwordInput.value !== 'overlook2021') {
        loginErrorMessage.innerText = 'Incorrect Password, try again.'
    } else {
        hide(loginPage)
        show(mainDisplay)
        show(selectDateBox)
        fetchBookings()
        fetchRooms()
        
    }
}

function managerLogin(today) {
    hide(loginPage)
    show(backToLoginButton)
    show(managerScreenWrapper)
    managerScreenMessage.innerText = `Total Available Rooms for: ${today}`
    populateManagerAvailableRooms(today)
}

function toggleShowPassword() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'
    } else {
        passwordInput.type = 'password'
    }
}

function hide(element) {
element.classList.add('hidden')
}

function show(element) {
    element.classList.remove('hidden')
    }


