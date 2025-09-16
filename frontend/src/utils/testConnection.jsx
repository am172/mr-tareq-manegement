export const testServerConnection = async () => {
  try {
    const response = await fetch('https://mr-tareq-manegement-backend.onrender.com/api/test');
    const data = await response.json();
    console.log('Server connection test:', data);
    return true;
  } catch (error) {
    console.error('Server connection failed:', error);
    return false;
  }
};