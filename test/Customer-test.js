import chai from 'chai';
const expect = chai.expect;

import customersData from '../src/data/customersData'
import roomsData from '../src/data/roomsData'
import bookingsData from '../src/data/bookingsData'
import Customer from '../src/Classes/Customer'
import Booking from '../src/Classes/Booking';

describe('Customer', function() {
let customersInfo
let roomsInfo
let bookingsInfo
let newCustomer

  beforeEach(() => {
    customersInfo = customersData.customers
    roomsInfo = roomsData.rooms
    bookingsInfo = bookingsData.bookings
    newCustomer = new Customer(customersInfo[0].id, customersInfo[0].name, bookingsInfo)
  })

  it('Upon selecting a date, I should be shown a list of room details for only rooms that are available on that date', function() {
    let e = newCustomer.selectDate("2022/04/22", bookingsInfo, roomsInfo)
    expect(e).to.deep.equal([
      {
        number: 1,
        roomType: 'residential suite',
        bidet: true,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 358.4
      },
      {
        number: 2,
        roomType: 'suite',
        bidet: false,
        bedSize: 'full',
        numBeds: 2,
        costPerNight: 477.38
      },
      {
        number: 3,
        roomType: 'single room',
        bidet: false,
        bedSize: 'king',
        numBeds: 1,
        costPerNight: 491.14
      },
      {
        number: 4,
        roomType: 'single room',
        bidet: false,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 429.44
      },
      {
        number: 5,
        roomType: 'single room',
        bidet: true,
        bedSize: 'queen',
        numBeds: 2,
        costPerNight: 340.17
      },
      {
        number: 6,
        roomType: 'junior suite',
        bidet: true,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 397.02
      },
      {
        number: 7,
        roomType: 'single room',
        bidet: false,
        bedSize: 'queen',
        numBeds: 2,
        costPerNight: 231.46
      },
      {
        number: 8,
        roomType: 'junior suite',
        bidet: false,
        bedSize: 'king',
        numBeds: 1,
        costPerNight: 261.26
      },
      {
        number: 9,
        roomType: 'single room',
        bidet: true,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 200.39
      },
      {
        number: 10,
        roomType: 'suite',
        bidet: false,
        bedSize: 'twin',
        numBeds: 1,
        costPerNight: 497.64
      },
      {
        number: 11,
        roomType: 'single room',
        bidet: true,
        bedSize: 'twin',
        numBeds: 2,
        costPerNight: 207.24
      },
      {
        number: 12,
        roomType: 'single room',
        bidet: false,
        bedSize: 'twin',
        numBeds: 2,
        costPerNight: 172.09
      },
      {
        number: 13,
        roomType: 'single room',
        bidet: false,
        bedSize: 'queen',
        numBeds: 2,
        costPerNight: 423.92
      },
      {
        number: 14,
        roomType: 'residential suite',
        bidet: false,
        bedSize: 'twin',
        numBeds: 1,
        costPerNight: 457.88
      },
      {
        number: 16,
        roomType: 'single room',
        bidet: false,
        bedSize: 'full',
        numBeds: 2,
        costPerNight: 325.6
      },
      {
        number: 17,
        roomType: 'junior suite',
        bidet: false,
        bedSize: 'twin',
        numBeds: 2,
        costPerNight: 328.15
      },
      {
        number: 18,
        roomType: 'junior suite',
        bidet: false,
        bedSize: 'king',
        numBeds: 2,
        costPerNight: 496.41
      },
      {
        number: 19,
        roomType: 'single room',
        bidet: false,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 374.67
      },
      {
        number: 20,
        roomType: 'residential suite',
        bidet: false,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 343.95
      },
      {
        number: 21,
        roomType: 'single room',
        bidet: false,
        bedSize: 'full',
        numBeds: 2,
        costPerNight: 429.32
      },
      {
        number: 22,
        roomType: 'single room',
        bidet: false,
        bedSize: 'full',
        numBeds: 2,
        costPerNight: 350.31
      },
      {
        number: 24,
        roomType: 'suite',
        bidet: false,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 327.24
      },
      {
        number: 25,
        roomType: 'single room',
        bidet: true,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 305.85
      }
    ]);
  });

  it('should be able to filter the list of available rooms by their room type', function() {
    let availableRooms = newCustomer.selectDate("2022/04/22", bookingsInfo, roomsInfo)
    let e = newCustomer.filterByRoomType('suite', availableRooms)
    expect(e).to.deep.equal([
      {
        number: 2,
        roomType: 'suite',
        bidet: false,
        bedSize: 'full',
        numBeds: 2,
        costPerNight: 477.38
      },
      {
        number: 10,
        roomType: 'suite',
        bidet: false,
        bedSize: 'twin',
        numBeds: 1,
        costPerNight: 497.64
      },
      {
        number: 24,
        roomType: 'suite',
        bidet: false,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 327.24
      }
    ])
  })

  it('should be able to select a room for booking', function () {
    let availableRooms = newCustomer.selectDate("2022/04/22", bookingsInfo, roomsInfo)
    let e = newCustomer.selectRoomForBooking(availableRooms[0])
    expect(e).to.be.an.instanceOf(Booking)
    expect(newCustomer.bookings[0]).to.deep.equal(
      {
        id: newCustomer.bookings[0].id,
        userID: 1,
        date: '2022/04/22',
        roomNumber: 1
      }
    )
   })
});
