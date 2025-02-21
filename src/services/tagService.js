// src/services/tagService.js
import axios from 'axios';

const API_URL = '/api/tag';

export class TagService {
  static async getAllTags() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      throw error;
    }
  }

  static async getTagById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch tag with id ${id}:`, error);
      throw error;
    }
  }

  static async getTagByName(name) {
    try {
      const response = await axios.get(`${API_URL}/name/${name}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch tag with name ${name}:`, error);
      throw error;
    }
  }

  static async createTag(tagData) {
    try {
      const response = await axios.post(API_URL, tagData);
      return response.data;
    } catch (error) {
      console.error('Failed to create tag:', error);
      throw error;
    }
  }

  static async updateTag(id, tagData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, tagData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update tag with id ${id}:`, error);
      throw error;
    }
  }

  static async deleteTag(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Failed to delete tag with id ${id}:`, error);
      throw error;
    }
  }
}

export default TagService;