
import './css/styles.css';
import Customer from './Classes/Customer'
import Booking from './Classes/Booking'
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'

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

let newCustomer
let bookingsData
let roomsData
let desiredRoom

window.addEventListener('click', () => {
    // fetchBookings()
    // fetchRooms()
})

loginButton.addEventListener('click', (event) => {
    event.preventDefault()
    loginErrorHandler()
})

confirmBookingButton.addEventListener('click', () => {
    fetchPostBookings()
})

backToBookings.addEventListener('click', () => {
    fetchBookings()
    populateBookings(newCustomer)
    hide(filterWrapper)
    show(selectDateBox)
    show(mainDisplay)
})

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
                availableRoomsWapper.innerHTML += `<div class="available-rooms" id="${element.number}">Room ${element.number}: ${element.roomType} <br>Beds: ${element.numBeds} ${element.bedSize} <br>Cost per night: $${element.costPerNight}</div>`
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
        availableRoomsWapper.innerHTML += `<div class="available-rooms" id="${element.number}">Room ${element.number}: ${element.roomType} <br>Beds: ${element.numBeds} ${element.bedSize} <br>Cost per night: $${element.costPerNight}</div>`
        })
    } else {
        availableRoomsWapper.innerHTML = `<p class="filter-apology-message">We fiercely apologize! There are no rooms of this type available on this date.`
    }
}

function login(username, password) {

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

function loginErrorHandler() {
    if (usernameInput.value !== 'customer1' &&
        usernameInput.value !== 'customer2' &&
        usernameInput.value !== 'customer3' &&
        usernameInput.value !== 'customer4' &&
        usernameInput.value !== 'customer5' &&
        usernameInput.value !== 'customer6' &&
        usernameInput.value !== 'customer7' &&
        usernameInput.value !== 'customer8' &&
        usernameInput.value !== 'customer9' &&
        usernameInput.value !== 'customer10' &&
        usernameInput.value !== 'customer11' &&
        usernameInput.value !== 'customer12' &&
        usernameInput.value !== 'customer13' &&
        usernameInput.value !== 'customer14' &&
        usernameInput.value !== 'customer15' &&
        usernameInput.value !== 'customer16' &&
        usernameInput.value !== 'customer17' &&
        usernameInput.value !== 'customer18' &&
        usernameInput.value !== 'customer19' &&
        usernameInput.value !== 'customer20' &&
        usernameInput.value !== 'customer21' &&
        usernameInput.value !== 'customer22' &&
        usernameInput.value !== 'customer23' &&
        usernameInput.value !== 'customer24' &&
        usernameInput.value !== 'customer25' &&
        usernameInput.value !== 'customer26' &&
        usernameInput.value !== 'customer27' &&
        usernameInput.value !== 'customer28' &&
        usernameInput.value !== 'customer29' &&
        usernameInput.value !== 'customer30' &&
        usernameInput.value !== 'customer31' &&
        usernameInput.value !== 'customer32' &&
        usernameInput.value !== 'customer33' &&
        usernameInput.value !== 'customer34' &&
        usernameInput.value !== 'customer35' &&
        usernameInput.value !== 'customer36' &&
        usernameInput.value !== 'customer37' &&
        usernameInput.value !== 'customer38' &&
        usernameInput.value !== 'customer39' &&
        usernameInput.value !== 'customer40' &&
        usernameInput.value !== 'customer41' &&
        usernameInput.value !== 'customer42' &&
        usernameInput.value !== 'customer43' &&
        usernameInput.value !== 'customer44' &&
        usernameInput.value !== 'customer45' &&
        usernameInput.value !== 'customer46' &&
        usernameInput.value !== 'customer47' &&
        usernameInput.value !== 'customer48' &&
        usernameInput.value !== 'customer49' &&
        usernameInput.value !== 'customer50') {
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

function hide(element) {
element.classList.add('hidden')
}

function show(element) {
    element.classList.remove('hidden')
    }