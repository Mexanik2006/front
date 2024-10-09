import { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Axios from './api/Api';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const [data, setData] = useState(null); // Set initial data to null
  const { user } = useAuthContext();

  const fetchData = async () => {
    try {
      const response = await Axios.get('/api/meget', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setData(response.data); // Set the fetched user data
    } catch (error) {
      console.error('Error occurred while fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.token]); // Add user.token as a dependency to refetch if token changes

  return (
    <div className="App">
      <div className="app_title">
        {data ? ( // Conditional rendering based on fetched data
          <h1>{`Hello ${data.userName}, welcome to the your server`}</h1>
        ) : (
          <h1>Hello friend welcome to the server</h1> // Loading state
        )}
      </div>
      <div className="app_sidebar">
        <Sidebar />
      </div>
    </div>
  );
}

export default App;


