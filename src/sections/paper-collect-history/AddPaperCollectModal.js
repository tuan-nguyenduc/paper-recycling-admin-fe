import {Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space} from "antd";
import {formatPrice, formatStatus} from "../../utils";
import {useState} from "react";
import paperRecyclingApis from "../../services/paperRecyclingApis";
import toast from "react-hot-toast";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {SvgIcon} from "@mui/material";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {useQuery} from "react-query";

const AddPaperCollectModal = ({open, setOpen, refetchHistories}) => {
    const [isShowClassSelect, setIsShowClassSelect] = useState(false)
    const [dataSearch, setDataSearch] = useState({
        page: 0,
        limit: 5,
        schoolClassId: null,
        schoolId: null
    })
    const {data: schoolData = {}} = useQuery({
        queryKey: ["allSchools"],
        queryFn: ({queryKey}) => paperRecyclingApis.allSchools(queryKey[1])
    })
    const {data: classData = {}} = useQuery({
        queryKey: ["allClass", dataSearch],
        queryFn: ({queryKey}) => paperRecyclingApis.getClasses(queryKey[1])
    })
    const {data: {contents: allClass = []} = {}} = classData

    const {data: {contents: allSchools = []} = {}} = schoolData
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const handleAddPaperCollect = async (values) => {
      try {
      setIsLoading(true)
      const AddData = await paperRecyclingApis.createCollectPaper(values);
          refetchHistories()
          form.resetFields()
          setOpen(false)
    } catch (err) {
      throw new Error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = (values) => {
    toast.promise(handleAddPaperCollect(values), {
      success: () => "Add Paper Collect Success!",
      loading: () => "Adding Paper Collects...",
      error: (err) => `${err.message}`
    })
  }

  return (<>
    <Modal
      title="Add Paper Collects"
      centered
      open={open}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      width={800}
      okText={"OK"}
      cancelText={"Cancel"}
      style={{paddingLeft: 100}}
      footer={[
        <Button key={1} type='default'
                onClick={() => setOpen(false)}>
          Cancel
        </Button>,
        <Button
          key={2}
          type="primary"
          htmlType="submit"
          disabled={isLoading}
          onClick={() => form.submit()}
        >
          {isLoading ? 'Adding...' : 'Add'}
        </Button>
      ]}
    >
      <Form
        onFinish={(values) => onSubmit(values)}
        form={form}
        layout="vertical"
        style={{
          maxWidth: 1000,
        }}
        autoComplete="off"
      >
        <div style={{
          overflow: "auto",
          height: 500,
        }}>
            <Form.Item
                name='schoolId'
                label="School"
                style={{
                    width: '100%'
                }}
                rules={[{ required: true, message: 'Please select school' }]}
            >
            <Select
                placeholder="Select school"
                onChange={(value) => {
                    if (!value) {
                        setIsShowClassSelect(false)
                        return
                    }

                    setDataSearch({
                        ...dataSearch,
                        schoolId: value,
                    })
                    form.resetFields(['schoolClassId'])
                    setIsShowClassSelect(true)

                }}
                allowClear
            >
                {
                    allSchools.map((school) => (
                        <Select.Option key={school?.id}
                                       value={school?.id}>
                            {school?.name}
                        </Select.Option>
                    ))
                }
            </Select>
            </Form.Item>
            {isShowClassSelect &&
                <Form.Item
                    name="schoolClassId"
                    label="Class"
                    style={{
                        width: '100%',
                    }}
                    rules={[{ required: true, message: 'Please select class' }]}
                >
                <Select
                    placeholder="Select class"
                    onChange={(value) => {
                        if (!value) {
                            setDataSearch({
                                ...dataSearch,
                                page: 0,
                                schoolClassId: null
                            });
                            return;
                        }
                        setDataSearch({
                            ...dataSearch,
                            schoolClassId: value
                        });
                    }}
                    allowClear
                >
                    {
                        allClass.map((classItem) => (
                            <Select.Option key={classItem?.id}
                                           value={classItem?.id}>
                                {classItem?.name}
                            </Select.Option>
                        ))
                    }
                </Select>
                </Form.Item>
            }
            <Form.Item
                name="weight"
                label="Weight"
                style={{
                    width: '100%',
                }}
                rules={[{ required: true, message: 'Please enter weight' }]}
            >
            <InputNumber placeholder="Weight" title="Weight" />
            </Form.Item>
        </div>

      </Form>
    </Modal>
  </>)
}

export default AddPaperCollectModal