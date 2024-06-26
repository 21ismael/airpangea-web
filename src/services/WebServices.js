export default class WebServices {
    SERVER = "http://localhost:5081/api";

    async auth(data) {
        try {
            const response = await fetch(`${this.SERVER}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const apiResponse = await response.json();

            return apiResponse;
        } catch (error) {
            console.error('Error authentification:', error);
            throw error;
        }
    }

    async signup(data) {
        try {
            const response = await fetch(`${this.SERVER}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to add a user');
            }

            console.log("User added successfully");
            const apiResponse = await response.json();

            return apiResponse;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    }

    async getScheduledFlights() {
        const response = await fetch(`${this.SERVER}/flight`);

        if (!response.ok) {
            throw new Error('Failed to get all the flights');
        }

        return response.json();
    }

    async addPassenger(passenger) {
        try {
            const response = await fetch(`${this.SERVER}/passenger`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passenger),
            });

            if (!response.ok) {
                throw new Error('Failed to add a passenger');
            }

            console.log("Passenger added successfully");
            const apiResponse = await response.json();

            return apiResponse;
        } catch (error) {
            console.error('Error adding passenger:', error);
            throw error;
        }
    }

    async addBooking(booking) {
        try {
            const response = await fetch(`${this.SERVER}/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(booking),
            });

            if (!response.ok) {
                throw new Error('Failed to add a booking');
            }

            console.log("Booking added successfully");
            const apiResponse = await response.json();

            return apiResponse;
        } catch (error) {
            console.error('Error adding booking:', error);
            throw error;
        }
    }

    async updateFlight(flight) {
        try {
            const response = await fetch(`${this.SERVER}/flight/${flight.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(flight),
            });

            if (!response.ok) {
                throw new Error('Failed to update flight');
            }

            return { success: true, message: 'Flight updated successfully' };
        } catch (error) {
            console.error('Error updating flight:', error);
            throw error;
        }
    }
}