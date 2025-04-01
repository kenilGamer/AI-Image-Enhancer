import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = `https://techhk.aoscdn.com/`;

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image_file', file);

    try {
        const response = await axios.post(`${apiUrl}/api/tasks/visual/scale/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-API-KEY': apiKey,
            },
        });

        const taskId = response?.data?.data?.task_id; // Fixed typo: `taks_id` -> `task_id`
        if (!taskId) {
            throw new Error('Image upload failed: Task ID not found');
        }

        console.log('Task ID:', taskId);
        return taskId;
    } catch (error) {
        console.error('Error uploading image:', error.message);
        throw error;
    }
};

const fetchEnhancedImage = async (taskId) => {
    try {
        const response = await axios.get(`${apiUrl}/api/tasks/visual/scale/${taskId}`, {
            headers: {
                'X-API-KEY': apiKey,
            },
        });

        const enhancedImage = response?.data?.data?.result_url;
        if (!response?.data) {
            console.log('Failed to fetch enhanced image');
        }

        console.log(response.data);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching enhanced image:', error.message);
    }
};

const PollForEnhancedImage = async (taskId, retries = 0) => {
    try {
        const enhancedImageData = await fetchEnhancedImage(taskId);
        if(enhancedImageData.state ===  4) {
            console.log('processing...');
            if (retries >= 20) {
                throw new Error('Max retries reached');
            }
            await new Promise(resolve => setTimeout(resolve, 6000));
            return PollForEnhancedImage(taskId,retries + 1);
        }
        return enhancedImageData;
    } catch (error) {
        console.error('Error fetching enhanced image:', error.message);
    }
    }

export const enhancedImageApi = async (file) => {
    try {
        const taskId = await uploadImage(file);
        const enhancedImageData = await PollForEnhancedImage(taskId);
        console.log('Enhanced Image Data:', enhancedImageData);
        return enhancedImageData;
    } catch (error) {
        console.error('Error in enhancedImageApi:', error.message);
        throw error;
    }
};

