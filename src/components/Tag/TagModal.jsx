import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Modal, ColorPicker } from 'antd';

function TagModal({ tag, open, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(tag);
  const modalTitle = isEditMode ? 'Edit Tag' : 'Add Tag';

  const handleSubmit = async (values) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const submitData = {
        ...values,
        color: values.color.toHexString() // 將顏色對象轉換為十六進制字符串
      };

      if (isEditMode) {
        // 編輯模式
        await onSubmit({ ...tag, ...submitData });
      } else {
        // 新增模式
        await onSubmit(submitData);
      }
      
      onCancel(); // 關閉modal
    } catch (error) {
      console.error('Failed to submit tag:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
 
  useEffect(() => {
    if (open) {
      if (isEditMode) {
        // 編輯模式：設置表單初始值
        form.setFieldsValue({
          name: tag.name,
          color: tag.color
        });
      } else {
        // 新增模式：重置表單
        form.resetFields();
        // 設置預設顏色
        form.setFieldValue('color', '#1677ff');
      }
    }
  }, [open, tag, form, isEditMode]);

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: 'Please input tag name!' },
            { max: 50, message: 'Tag name cannot be longer than 50 characters!' }
          ]}
        >
          <Input placeholder="Enter tag name" />
        </Form.Item>

        <Form.Item
          name="color"
          label="Color"
          rules={[{ required: true, message: 'Please select a color!' }]}
        >
          <ColorPicker />
        </Form.Item>

        <Form.Item className="mb-0">
          <div className="flex justify-end gap-2">
            <Button onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={isSubmitting}
            >
              {isEditMode ? 'Save Changes' : 'Add'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

TagModal.propTypes = {
  tag: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  }),
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default TagModal;