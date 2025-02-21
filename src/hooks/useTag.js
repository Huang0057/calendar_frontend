// src/hooks/useTag.js
import { useState, useEffect } from 'react';
import { message } from 'antd';
import TagService from '../services/tagService';

export const useTag = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const data = await TagService.getAllTags();
      setTags(data);
    } catch (err) {
      setError(err);
      message.error('Failed to fetch tags');
    } finally {
      setIsLoading(false);
    }
  };

  const createTag = async (tagData) => {
    try {
      const newTag = await TagService.createTag(tagData);
      setTags(prev => [...prev, newTag]);
      message.success('Tag created successfully');
      return newTag;
    } catch (err) {
      message.error('Failed to create tag');
      throw err;
    }
  };

  const updateTag = async (id, tagData) => {
    try {
      await TagService.updateTag(id, tagData);
      setTags(prev => 
        prev.map(tag => tag.id === id ? { ...tag, ...tagData } : tag)
      );
      message.success('Tag updated successfully');
    } catch (err) {
      message.error('Failed to update tag');
      throw err;
    }
  };

  const deleteTag = async (id) => {
    try {
      await TagService.deleteTag(id);
      setTags(prev => prev.filter(tag => tag.id !== id));
      message.success('Tag deleted successfully');
    } catch (err) {
      message.error('Failed to delete tag');
      throw err;
    }
  };

  // 初始加載標籤
  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    isLoading,
    error,
    createTag,
    updateTag,
    deleteTag,
    refreshTags: fetchTags
  };
};

export default useTag;