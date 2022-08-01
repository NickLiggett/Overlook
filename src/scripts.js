// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';
import Customer from './Classes/Customer'
import { fetchAllCustomers, fetchAllRooms, fetchAllBookings } from './api-calls'
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'

const calendar = document.querySelector('.calendar')

window.addEventListener('load', () => {
    fetchAllCustomers()
    fetchAllRooms()
    fetchAllBookings()
    populateCalendar()
})

function populateCalendar() {
    for (let i = 0; i < 35; i++) {
        calendar.innerHTML += `<div class="calendar-day"></div>`
    }
}