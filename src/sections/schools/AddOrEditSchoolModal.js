import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import paperRecyclingApis from '../../services/paperRecyclingApis';

const AddOrEditSchoolModal = ({ open, setOpen, editData, reload }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onCreateSchoolPromise = async (values) => {
    try {
      setLoading(true);
      let resp = {};
      if (editData) {
        resp = await paperRecyclingApis.ediiSchool(editData?.id, values);

      } else {
        resp = await paperRecyclingApis.addSchool(values);
      }
      await reload();
      form.resetFields();
      setOpen(false);
      return resp.data;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open]);

  useEffect(() => {
    if (editData && open) {
      form.setFieldsValue({ ...editData });
    }
  }, [editData, open]);

  const handleSubmit = (values) => {
    toast.promise(onCreateSchoolPromise(values), {
      loading: 'Processing...',
      success: newSchool => `School ${newSchool?.name} saved successfully`,
      error: err => 'Failed: ' + err.message
    });
  };
  return (
    <Modal
      title={editData ? 'Edit school' : 'Add school'}
      open={open}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      footer={[
        <Button
          key="back"
          onClick={() => setOpen(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={form.submit}>
          Save
        </Button>
      ]}
    >
      <Form
        onFinish={handleSubmit}
        form={form}
        layout="vertical"
        name="school-form"
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: 'Please enter school name'
                }
              ]}>
              <Input placeholder="School name"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label="Type"
              rules={[
                {
                  required: true,
                  message: 'Please pick school type'
                }
              ]}>
              <Select placeholder="Select school type" style={{
                width: '100%'
              }}>
                <Select.Option value="PRIMARY">Tiểu học</Select.Option>
                <Select.Option value="JUNIOR">Trung học cơ sở</Select.Option>
                <Select.Option value="HIGH">Trung học phổ thông</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="address"
              label="Address"
              rules={[
                {
                  required: true,
                  message: 'Please enter school address'
                }
              ]}
            >
              <Input.TextArea/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[
                {
                  required: true,
                  message: 'Please enter school phone'
                }
              ]}
            >
              <Input placeholder="School phone"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="principal"
              label="Principal"
            >
              <Input placeholder="School principal"/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddOrEditSchoolModal;