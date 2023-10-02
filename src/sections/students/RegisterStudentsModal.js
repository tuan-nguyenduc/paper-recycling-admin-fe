import {Button, Form, Input, Modal, Popconfirm, Space} from "antd";
import {formatPrice, formatStatus} from "../../utils";
import {useState} from "react";
import paperRecyclingApis from "../../services/paperRecyclingApis";
import toast from "react-hot-toast";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {SvgIcon} from "@mui/material";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";

const RegisterStudentsModal = ({open, setOpen}) => {
    const [isLoadingRegister, setIsLoadingRegister] = useState(false);
    const [form] = Form.useForm();
    const handleRegisterStudents = async (values) => {
        try {
            setIsLoadingRegister(true)
            const RegisterData = await paperRecyclingApis.registerStudents(values)
        } catch (err) {
            throw new Error(err.message)
        } finally {
            setIsLoadingRegister(false)
        }
    }

    const onSubmitRegister = (values) => {
        console.log("values", values?.users)
        toast.promise(handleRegisterStudents(values?.users), {
            success: () => "Register Students Success!",
            loading: () => "Registering Students...",
            error: (err) => `${err.message}`
        })
    }

    return (<>
        <Modal
            title="Register Students"
            centered
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            width={1000}
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
                    disabled={isLoadingRegister}
                    onClick={() => form.submit()}
                >
                    {isLoadingRegister ? 'Registering...' : 'Register'}
                </Button>
            ]}
        >
            <Form
                name="dynamic_form_nest_item"
                onFinish={onSubmitRegister}
                form={form}
                style={{
                    maxWidth: 1000,
                }}
                autoComplete="off"
            >
                <div style={{
                    overflow: "auto",
                    height: 500,
                }}>
                    <Form.List name="users">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(({key, name, ...restField}) => (
                                    <Space
                                        key={key}
                                        style={{
                                            display: 'flex',
                                            marginBottom: 8,
                                        }}
                                        align="baseline"
                                    >
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'studentId']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Missing Id',
                                                },
                                            ]}
                                            label='Id'
                                            style={{width: 120}}
                                        >
                                            <Input placeholder="Id"/>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'name']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Missing student name',
                                                },
                                            ]}
                                            label='Name'
                                        >
                                            <Input placeholder="Name"/>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'phone']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Missing student phone number',
                                                },
                                            ]}
                                            label='Phone'
                                        >
                                            <Input placeholder="Phone Number"/>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'email']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Missing student email',
                                                },
                                            ]}
                                            label='Email'
                                        >
                                            <Input placeholder="Email"/>
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)}/>
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button
                                        onClick={() => add()}
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <PlusIcon/>
                                            </SvgIcon>
                                        )}
                                        icon={<PlusOutlined/>}

                                    >
                                        Add more students
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </div>
            </Form>
        </Modal>
    </>)
}

export default RegisterStudentsModal