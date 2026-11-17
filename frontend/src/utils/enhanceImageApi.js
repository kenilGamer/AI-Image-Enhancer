import axios from "axios";

// All calls go through our own API — the enhancement provider's key never reaches the browser.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ai-image-enhancer-8rmp.onrender.com";

const uploadImage = async (file) => {
    try {
        const response = await axios.post(`${API_BASE}/api/enhance`, file, {
            headers: { 'Content-Type': file.type || 'application/octet-stream' },
        });

        const taskId = response?.data?.taskId;
        if (!taskId) {
            throw new Error('Image upload failed: Task ID not found');
        }
        return taskId;
    } catch (error) {
        console.error('Error uploading image:', error.message);
        throw error;
    }
};

const fetchEnhancedImage = async (taskId) => {
    try {
        const response = await axios.get(`${API_BASE}/api/enhance/${encodeURIComponent(taskId)}`);
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

