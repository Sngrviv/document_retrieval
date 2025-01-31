import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';  // Changed from localhost to 127.0.0.1

export const uploadAndQuery = async (file, query) => {
    try {
        console.log('Starting API call...');
        console.log('File:', file);
        console.log('Query:', query);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('query', query);

        // Test if the server is reachable
        try {
            const testResponse = await axios.get(`${API_URL}/api/`);
            console.log('Server is reachable:', testResponse.data);
        } catch (error) {
            console.error('Server connection test failed:', error);
            throw new Error('Cannot connect to server. Please check if Django server is running on port 8000');
        }

        // Make the actual request
        const response = await axios.post(`${API_URL}/api/upload-and-query/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Full error:', error);
        
        if (error.code === 'ERR_NETWORK') {
            throw new Error('Network error: Please check if the Django server is running on port 8000');
        }
        
        if (error.response) {
            // The server responded with an error
            const errorMessage = error.response.data.error || error.response.statusText;
            throw new Error(`Server error: ${errorMessage}`);
        }
        
        // Re-throw the error with a more specific message
        throw error;
    }
}; 