export const fetchAllCustomers = () => {
        fetch('http://localhost:3001/api/v1/customers')
        .then(response => response.json())
        .then(data => data.customers)   
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



