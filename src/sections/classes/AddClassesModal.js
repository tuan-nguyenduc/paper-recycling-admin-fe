import { Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import paperRecyclingApis from '../../services/paperRecyclingApis';
import { useQuery } from 'react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

const AddClassesModal = ({ open, setOpen, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [classes, setClasses] = useState([]);
  const {
    data: schoolsData = {}
  } = useQuery(['paperRecyclingApis.allSchools'], () => paperRecyclingApis.allSchools({
    page: 0,
    limit: 100 // all schools
  }));
  const { data: { contents: schools = [] } = {} } = schoolsData;
  const handleAddClass = () => {
    const schoolId = form.getFieldValue('schoolId');
    if (!schoolId) {
      toast.error('Please select school');
      return;
    }
    //validate previous class
    const previousClass = classes[classes.length - 1];
    if (previousClass) {
      if (!previousClass.name) {
        toast.error('Please enter class name');
        return;
      }
      if (!previousClass.grade) {
        toast.error('Please enter grade');
        return;
      }
      if (!previousClass.totalStudents) {
        toast.error('Please enter total students');
        return;
      }
    }
    setClasses([
      ...classes, {
        _id: new Date().getTime(),
        schoolId: form.getFieldValue('schoolId'),
        name: null,
        grade: null,
        totalStudent: 0,
        nextClassId: null
      }
    ]);
  };
  const onSubmit = async (values) => {
    try {
      setLoading(true);
      if (classes.length === 0) {
        toast.error('Please add at least one class');
        return;
      }
      await paperRecyclingApis.addClassBulk(classes);
      await onSuccess();
      form.resetFields();
      setOpen(false);
      toast.success('Action success');
    } catch (err) {
      console.log(err);
      toast.error('Action failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      title="Add classes"
      open={open}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      width={900}
      footer={[
        <Button key="cancel" onClick={() => setOpen(false)}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={form.submit}>
          Save
        </Button>
      ]}
    >
      <Form
        name="add-classes-form"
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          name="schoolId"
          label="School"
          rules={[{ required: true, message: 'Please select school' }]}

        >
          <Select
            onChange={(value) => {
              classes.forEach(c => c.schoolId = value);
              setClasses([...classes]);
            }}
          >
            {
              schools.map((school) => (
                <Select.Option key={school.id} value={school.id}>
                  {school.name}
                </Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        {
          classes.map((classItem, index) => (
            <Row key={classItem._id} gutter={12} style={{ marginBottom: 16, alignItems: 'center' }}>
              <Col span={4}>
                <label>Grade</label>
                <InputNumber placeholder="Grade" style={{ width: '100%' }} onChange={(value) => {
                  classes[index].grade = value;
                  setClasses([...classes]);
                }}/>
              </Col>
              <Col span={6}>
                <label>Class</label>
                <Input placeholder="Class name" style={{ width: '100%' }} onChange={(e) => {
                  classes[index].name = e.target.value;
                  setClasses([...classes]);
                }}/>
              </Col>

              <Col span={6}>
                <label>Total students</label>
                <InputNumber placeholder="Total students" style={{ width: '100%' }}
                             onChange={(value) => {
                               classes[index].totalStudent = value;
                               setClasses([...classes]);
                             }}/>
              </Col>
              <Col span={6}>
                <label>Next class</label>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Next class" onChange={(value) => {
                  classes[index].nextClassId = value;
                  setClasses([...classes]);
                }}>
                  {
                    classes.filter(c => c._id !== classItem._id).map((currentClass) => (
                      <Select.Option key={currentClass._id} value={currentClass._id}
                                     style={{ width: '100%' }}>
                        {currentClass.name}
                      </Select.Option>
                    ))
                  }
                </Select>
              </Col>
              <Col span={2}>
                <label style={{ visibility: 'hidden' }}>delete</label>
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    classes.splice(index, 1);
                    setClasses([...classes]);
                  }}>
                  Delete
                </Button>
              </Col>

            </Row>
          ))
        }
        <Button type="primary" onClick={handleAddClass} loading={loading}>Add class</Button>
      </Form>

    </Modal>
  );
};

export default AddClassesModal;