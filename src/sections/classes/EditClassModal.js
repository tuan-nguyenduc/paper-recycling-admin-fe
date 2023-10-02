import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import paperRecyclingApis from '../../services/paperRecyclingApis';

const EditClassModal = ({ open, setOpen, toEdit, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const handleUpdateClass = async (values) => {
    try {
      setLoading(true);
      await paperRecyclingApis.editClass(toEdit.id, values);
      await onSuccess();
      form.resetFields();
      setOpen(false);
      toast.success('Action success');
    } catch (err) {
      console.log(err);
      toast.error('Failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    form.setFieldsValue({ ...toEdit });
  }, [toEdit]);
  return (
    <Modal
      title="Edit class"
      open={open}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setOpen(false)}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={form.submit} loading={loading}>
          Save
        </Button>
      ]}
    >
      <Form
        onFinish={handleUpdateClass}
        form={form}
        name={'edit-class'}
        layout={'vertical'}
      >
        <Form.Item
          label="Grade"
          name="grade"
        >
          <InputNumber style={{ width: '100%' }}/>
        </Form.Item>


        <Form.Item
          label="Name"
          name="name"
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="Total student"
          name="totalStudent"
        >
          <InputNumber style={{ width: '100%' }}/>
        </Form.Item>

        <Form.Item
          label="Next class id"
          name="nextClassId"
        >
          <InputNumber style={{ width: '100%' }}/>
        </Form.Item>

      </Form>

    </Modal>
  );
};

export default EditClassModal;