// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
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

let newCustomer
let bookingsData
let roomsData
let desiredRoom

window.addEventListener('load', () => {
    fetchBookings()
    fetchRooms()
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
    console.log(newCustomer.id, newCustomer.dateDesired, parseInt(desiredRoom))
    fetch('http://localhost:3001/api/v1/bookings', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ "userID": newCustomer.id, "date": newCustomer.dateDesired, "roomNumber": parseInt(desiredRoom) })
    })
    .then(response => response.json())
    // .then(data => data)
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
        let i = Math.floor(Math.random() * 50) + 1
        newCustomer = new Customer(data.customers[i].id, data.customers[i].name)
        populateBookings(newCustomer)
})}

function populateBookings(currentCust) {
    welcomeMessage.innerText = `Welcome to Overlook, ${currentCust.name}`
    currentCust.bookings = bookingsData.filter(booking => booking.userID === currentCust.id)
    currentCust.bookings.sort((a, b) => a.date.charAt(6) - b.date.charAt(6)) // <--- not sorting
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

function hide(element) {
element.classList.add('hidden')
}

function show(element) {
    element.classList.remove('hidden')
    }