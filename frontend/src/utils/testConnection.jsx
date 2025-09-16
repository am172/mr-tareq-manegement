export const testServerConnection = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/test');
    const data = await response.json();
    console.log('Server connection test:', data);
    return true;
  } catch (error) {
    console.error('Server connection failed:', error);
    return false;
  }
};