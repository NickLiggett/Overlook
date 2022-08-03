
import Booking from "./Booking"

class Customer {
    constructor(id, name) {
        this.id = id
        this.name = name
        this.bookings = []
        this.dateDesired = ''
    }
    selectDate(date, bookingData, roomsData) {
        this.dateDesired = date
        let numsOfUnavailableRooms = bookingData.reduce((list, booking) => {
            if (booking['date'] === date) {
                list.push(booking.roomNumber)
            }
            return list
        }, [])
        let availableRooms = roomsData.reduce((list, room) => {
            if (!numsOfUnavailableRooms.includes(room.number)) {
                list.push(room)
            }
            return list
        }, [])
        return availableRooms
    }

    filterByRoomType(type, availableRooms) {
        return availableRooms.filter(room => room.roomType === type)
    }

    selectRoomForBooking(room) {
        let getBookingID = () => {
            let keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9']
            let id = ''
            for (let i = 0; i < 17; i++) {
                id += keys[Math.floor(Math.random() * keys.length)]
            }
            return id
        }
        let newBooking = new Booking(getBookingID(), this.id, this.dateDesired, room.number)
        this.bookings.unshift(newBooking)
        return newBooking
    }
}

export default Customer