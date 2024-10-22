// src/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Fetch data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.openbrewerydb.org/breweries');
        setData(response.data);
        setFilteredData(response.data); // Set the initial filtered data to all data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Handle search input changes
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  // Filter and search data whenever inputs change
  useEffect(() => {
    let filtered = data;

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter((brewery) =>
        brewery.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType) {
      filtered = filtered.filter((brewery) => brewery.brewery_type === filterType);
    }

    setFilteredData(filtered);
  }, [searchQuery, filterType, data]);

  // Calculate Summary Statistics
  const totalBreweries = data.length;
  const totalMicroBreweries = data.filter(b => b.brewery_type === 'micro').length;
  const citiesRepresented = [...new Set(data.map(b => b.city))].length;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Breweries Dashboard</h1>

      {/* Summary Statistics */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div>Total Breweries: {totalBreweries}</div>
        <div>Total Micro Breweries: {totalMicroBreweries}</div>
        <div>Cities Represented: {citiesRepresented}</div>
      </div>

      {/* Search and Filter Inputs */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearch}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <select onChange={handleFilterChange} style={{ padding: '5px' }}>
          <option value="">All Types</option>
          <option value="micro">Micro</option>
          <option value="regional">Regional</option>
          <option value="brewpub">Brewpub</option>
        </select>
      </div>

      {/* List View */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredData.map((brewery) => (
          <li key={brewery.id} style={{ marginBottom: '10px' }}>
            <strong>{brewery.name}</strong> ({brewery.brewery_type}) - {brewery.city}, {brewery.state}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
