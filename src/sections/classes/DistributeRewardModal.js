import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import paperRecyclingApis from '../../services/paperRecyclingApis';
import { useQuery } from 'react-query';
import { formatPrice } from '../../utils';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';

const DistributeRewardModal = ({ open, setOpen, toDistribute, refetchClasses }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { data: studentData = {} } = useQuery({
    queryKey: ['allStudents', toDistribute], queryFn: () => paperRecyclingApis.allUsers({
      schoolClassId: toDistribute?.id
    })
  });
  const { data: { contents: allStudents = [] } = {} } = studentData;

  useEffect(() => {
    form.resetFields();
  }, [toDistribute]);

  const handleDistributeReward = async (values) => {
    try {
      setLoading(true);
      const entries = Object.entries(values);
      console.log(entries);
      let request = [];
      entries.map(([key, value]) => {
        if (value) {
          request.push({
            userId: parseInt(key),
            paperPoint: value
          });
        }

      });
      console.log(request);
      const distributeData = await paperRecyclingApis.distributeReward(toDistribute?.id, request);
      refetchClasses();
      setOpen(false);
      form.resetFields();
    } catch (e) {
      throw new Error(e.message);
    } finally {
      setLoading(false);
    }

  };

  const submitDistributeReward = async (values) => {
    toast.promise(handleDistributeReward(values), {
      success: () => 'Distribute successfully!',
      loading: () => 'Distributing reward...',
      error: (e) => `${e}`
    });
  };

  return <Modal
    title="Distribute Reward"
    width={600}
    open={open}
    onOk={() => setOpen(false)}
    onCancel={() => setOpen(false)}
    footer={[
      <Button key="cancel" onClick={() => setOpen(false)}>
        Cancel
      </Button>,
      <Button key="submit" type="primary" onClick={() => {
        form.submit();
      }} loading={loading}>
        Save
      </Button>
    ]}
  >
    <div style={{ marginBottom: 10 }}><b>Class:
    </b> {toDistribute?.name}
    </div>
    <div style={{ marginBottom: 10 }}><b>Total Reward:
    </b> {formatPrice(toDistribute?.rewardPaperPoint)} Paper Point
    </div>
    <Form
      name="dynamic_form_nest_item"
      form={form}
      onFinish={(values) => submitDistributeReward(values)}
      style={{
        maxWidth: 600
      }}
      autoComplete="off"
      layout="vertical"
    >
      <div style={{
        overflow: 'auto',
        height: 400
      }}>
        <Row>
          <Form.Item>
            <Button type="primary"
                    style={{ color: '#FFF', backgroundColor: '#07BFA5', marginRight: 230 }}
                    onClick={() => {
                      if (allStudents.length === 0) {
                        toast.error('Class have no students!');
                      }
                      form.resetFields();
                      allStudents.map((student) => {

                        form.setFieldValue(`${student?.id}`,
                          Math.round(toDistribute?.rewardPaperPoint / allStudents.length));
                      });
                    }}>
              Distribute fairly to everyone
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary"
                    style={{ color: '#FFF', backgroundColor: '#DC3545' }}
                    onClick={() => form.resetFields()}
            >
              Reset Field
            </Button>
          </Form.Item>
        </Row>
        {
          allStudents.length === 0 ? <p>No students found...</p> :
            allStudents.map((student) => {
              return (
                <Form.Item key={student.id} label={<b>{student.name}</b>} name={student.id}>
                  <InputNumber placeholder="Reward" defaultValue={0} min={0}
                               style={{ width: '100%' }}/>
                </Form.Item>
              );
            })
        }
      </div>
    </Form>
  </Modal>;
};

export default DistributeRewardModal;