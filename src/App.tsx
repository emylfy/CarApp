import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ICar } from './types';

let API_URL = 'http://localhost:5000/api';

function App() {
  let [cars, setCars] = useState<ICar[]>([]);
  let [selectedCar, setSelectedCar] = useState<ICar | null>(null);
  let [mark, setMark] = useState('');
  let [model, setModel] = useState('');
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState<string | null>(null);
  let [successMessage, setSuccessMessage] = useState<string | null>(null);

  let showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  let showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  let fetchCars = async () => {
    try {
      setLoading(true);
      let response = await axios.get(`${API_URL}/cars`);
      setCars(response.data);
    } catch (error) {
      showError('Error fetching cars. Please try again.');
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  let fetchCarById = async (id: number) => {
    try {
      setLoading(true);
      let response = await axios.get(`${API_URL}/cars/${id}`);
      setSelectedCar(response.data);
    } catch (error) {
      showError('Error fetching car details. Please try again.');
      console.error('Error fetching car:', error);
    } finally {
      setLoading(false);
    }
  };

  let handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mark.trim() || !model.trim()) {
      showError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      if (selectedCar) {
        await updateCar(selectedCar.id);
        showSuccess('Car updated successfully!');
      } else {
        await axios.post(`${API_URL}/cars`, { mark, model });
        showSuccess('Car added successfully!');
        setMark('');
        setModel('');
      }
      fetchCars();
    } catch (error) {
      showError('Error submitting form. Please try again.');
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  let updateCar = async (id: number) => {
    try {
      setLoading(true);
      await axios.put(`${API_URL}/cars/${id}`, { mark, model });
      setSelectedCar(null);
      setMark('');
      setModel('');
      showSuccess('Car updated successfully!');
      fetchCars();
    } catch (error) {
      showError('Error updating car. Please try again.');
      console.error('Error updating car:', error);
    } finally {
      setLoading(false);
    }
  };

  let deleteCar = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/cars/${id}`);
      showSuccess('Car deleted successfully!');
      fetchCars();
    } catch (error) {
      showError('Error deleting car. Please try again.');
      console.error('Error deleting car:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="container">
      <h1 className="title">React + Axios + Express</h1>
      
      {error && (
      <div className="alert alert-error">
        {error}
      </div>
      )}
      
      {successMessage && (
      <div className="alert alert-success">
        {successMessage}
      </div>
      )}

      <div className="form-container">
        <h2 className="form-title">
          {selectedCar ? 'Edit Car' : 'Add New Car'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Mark</label>
              <input
                type="text"
                value={mark}
                onChange={(e) => setMark(e.target.value)}
                className="form-input"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Model</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>
          <div className="form-actions">
            {selectedCar && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCar(null);
                  setMark('');
                  setModel('');
                }}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : selectedCar ? 'Update Car' : 'Add Car'}
            </button>
          </div>
        </form>
      </div>

        {loading && <div className="loading">Loading...</div>}

        <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Mark</th>
            <th>Model</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>{car.id}</td>
              <td>{car.mark}</td>
              <td>{car.model}</td>
              <td>
                <div className="actions">
                  <button
                    onClick={() => {
                      fetchCarById(car.id);
                      setMark(car.mark);
                      setModel(car.model);
                    }}
                    className="icon-button edit"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCar(car.id)}
                    className="icon-button delete"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;