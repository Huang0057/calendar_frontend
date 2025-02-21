import { useState } from 'react';
import { Card, Button, Tooltip, Modal, Spin } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { useTagContext } from '../../contexts/TagContext';
import TagModal from './TagModal';

const TagList = () => {
  const { tags, createTag, updateTag, deleteTag, isLoading } = useTagContext();
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null,  // 'edit' or 'add'
    currentTag: null
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (tag) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      currentTag: tag
    });
  };

  const handleAdd = () => {
    setModalState({
      isOpen: true,
      mode: 'add',
      currentTag: null
    });
  };

  const handleDelete = async () => {
    if (!tagToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteTag(tagToDelete.id);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete tag:', error);
    } finally {
      setIsDeleting(false);
      setTagToDelete(null);
    }
  };

  const showDeleteConfirm = (tag) => {
    setTagToDelete(tag);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: null,
      currentTag: null
    });
  };

  const handleSubmit = async (data) => {
    try {
      if (modalState.mode === 'edit') {
        await updateTag(modalState.currentTag.id, data);
      } else {
        await createTag(data);
      }
      closeModal();
    } catch (error) {
      console.error('Failed to submit tag:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-64 shadow-sm">
        <div className="flex justify-center items-center h-32">
          <Spin />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-64 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Tags</h3>
            <Tooltip title="Add new tag">
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                className="text-gray-500 hover:text-gray-700"
              />
            </Tooltip>
          </div>
          
          <div className="space-y-2">
            {tags.map(tag => (
              <div 
                key={tag.id} 
                className="flex items-center justify-between group hover:bg-gray-50 p-1 rounded"
              >
                <div className="flex items-center gap-2 px-3 py-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="text-sm">{tag.name}</span>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Tooltip title="Edit tag">
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(tag)}
                      className="text-gray-500 hover:text-blue-500"
                    />
                  </Tooltip>
                  
                  <Tooltip title="Delete tag">
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => showDeleteConfirm(tag)}
                      className="text-gray-500 hover:text-red-500"
                    />
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <TagModal
        tag={modalState.currentTag}
        open={modalState.isOpen}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
      
      <Modal
        title="Delete Tag"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setTagToDelete(null);
        }}
        okText="Yes"
        cancelText="No"
        okType="danger"
        confirmLoading={isDeleting}
        centered
      >
        <p>Are you sure you want to delete this tag?</p>
      </Modal>
    </>
  );
};

export default TagList;