export default class WebServices{
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
}