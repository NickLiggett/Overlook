import Customer from "./Classes/Customer"

export const fetchAllCustomers = () => {
        fetch('http://localhost:3001/api/v1/customers')
        .then(response => response.json())
        .then(data => {
            let i = Math.floor(Math.random() * 50) + 1
            newCustomer = new Customer(data.customers[i].id, data.customers[i].name)
            console.log(newCustomer)
        })
    }

export const fetchAllRooms = () => {
    fetch('http://localhost:3001/api/v1/rooms')
    .then(response => response.json())
    .then(data => data.rooms)
}
export const fetchAllBookings = () => {
    fetch('http://localhost:3001/api/v1/bookings')
    .then(response => response.json())
    .then(data => data.bookings)
}



