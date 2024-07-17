// import http from '../utils/http-common'

import { API_URL } from "../constans";

const dataService = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/todos`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  get: async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create data');
      }

      const createdData = await response.json();

      return createdData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update data');
      }

      const updatedData = await response.json();

      return updatedData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete data');
      }

      const deletedData = await response.json();

      return deletedData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default dataService
