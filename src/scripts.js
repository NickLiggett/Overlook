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
const datePicker = document.querySelector('#datePicker')
const mainDisplay = document.querySelector('.customers-bookings')
const availableRoomsWapper = document.querySelector('.available-rooms-wrapper')
const filterWrapper = document.querySelector('.filter-wrapper')
const backToBookings = document.querySelector('.back-to-bookings')
const filterButton = document.querySelector('.filter-button')
const suiteButton = document.querySelector('#suite')
const singleRoomButton = document.querySelector('#singleRoom')
const resSuiteButton = document.querySelector('#residentialSuite')
const junSuiteButton = document.querySelector('#juniorSuite')
const filterSection = document.querySelector('.filter-section')


let newCustomer
let bookingsData
let roomsData

window.addEventListener('load', () => {
    fetchBookings()
    fetchRooms()
    fetchCustomers()
})

backToBookings.addEventListener('click', () => {
    hide(filterWrapper)
    show(mainDisplay)
})

filterButton.addEventListener('click', () => {
    filterByRoomType()
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

function fetchRooms() {
    fetch('http://localhost:3001/api/v1/rooms')
    .then(response => response.json())
    .then(data => roomsData = data.rooms)
}

function fetchCustomers() {
    fetch('http://localhost:3001/api/v1/customers')
    .then(response => response.json())
    .then(data => {
        let i = Math.floor(Math.random() * 50) + 1
        newCustomer = new Customer(data.customers[i].id, data.customers[i].name)
        welcomeMessage.innerText += `, ${newCustomer.name}`
        newCustomer.bookings = bookingsData.filter(booking => booking.userID === newCustomer.id)
        let sortedBookings = newCustomer.bookings.sort((a, b) => b.date.charCodeAt(7) - a.date.charCodeAt(7))
        sortedBookings.forEach(element => {
            new Booking(element.id, element.userID, element.date, element.roomNumber)
            bookings.innerHTML += `<div class="single-booking">Room Number: ${element.roomNumber} Date: ${element.date}</div><br>`
            })
        let total = newCustomer.bookings.reduce((sum, booking) => {
            roomsData.forEach(room => {
             if (booking.roomNumber === room.number) {
                sum += room.costPerNight
            }   
            })
            return sum
        }, 0).toFixed(2)
        totalSpent.innerText = `You have spent $${total} on bookings with us.`
    })
}

function showAvailableRooms(input) {
    hide(mainDisplay)
    show(filterWrapper)
    let availableRooms = newCustomer.selectDate(input.split('-').join('/'), bookingsData, roomsData)
    availableRoomsWapper.innerHTML = ''
    availableRooms.forEach(element => {
        availableRoomsWapper.innerHTML += `<div class="available-rooms">Room ${element.number}: ${element.roomType} <br>Beds: ${element.numBeds} ${element.bedSize} <br>Cost per night: $${element.costPerNight}</div>`
    })
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
    }
    let availableRooms = newCustomer.selectDate(newCustomer.dateDesired, bookingsData, roomsData)
    let filteredRooms = availableRooms.filter(room => {
        if (types.includes(room.roomType)) {
            return room 
        }
    })
    availableRoomsWapper.innerHTML = ''
    filteredRooms.forEach(element => {
        availableRoomsWapper.innerHTML += `<div class="available-rooms">Room ${element.number}: ${element.roomType} <br>Beds: ${element.numBeds} ${element.bedSize} <br>Cost per night: $${element.costPerNight}</div>`
    })
}

function radioHandler(event) {
    if (event.target.id === 'singleRoom') {
        suiteButton.checked = false
        resSuiteButton.checked = false
        junSuiteButton.checked = false
    } else if (event.target.id === 'suite') {
        singleRoomButton.checked = false
        resSuiteButton.checked = false
        junSuiteButton.checked = false
    } else if (event.target.id === 'residentialSuite') {
        singleRoomButton.checked = false
        suiteButton.checked = false
        junSuiteButton.checked = false
    } else if (event.target.id === 'juniorSuite') {
        singleRoomButton.checked = false
        suiteButton.checked = false
        resSuiteButton.checked = false
    }
}

function hide(element) {
element.classList.add('hidden')
}

function show(element) {
    element.classList.remove('hidden')
    }