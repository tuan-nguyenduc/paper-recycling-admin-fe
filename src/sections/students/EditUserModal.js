import {Button, Col, Form, Input, InputNumber, Modal, Row, Select, Upload} from 'antd';
import {Checkbox} from "@mui/material";
import ImgCrop from 'antd-img-crop';
import {BsPlusLg} from 'react-icons/bs';
import {useCallback, useEffect, useState} from "react";
import paperRecyclingApis from "../../services/paperRecyclingApis";
import toast from "react-hot-toast";
import _debounce from "lodash/debounce";
import {useQuery} from 'react-query';

const EditUserModal = ({open, setOpen, reloadOrders, editData}) => {
    const [form] = Form.useForm();
    const [isLoadingUpdateUser, setIsLoadingUpdateUser] = useState(false)
    const [dataSearch, setDataSearch] = useState({
        page: 0,
        limit: 10,
        schoolClassId: null,
        sortBy: '',
        sortDirection: '',
        status: null,
        schoolId: null
    })

    useEffect(() => {
        if (editData && open) {
            form.setFieldsValue({
                name: editData?.name,
                studentId: editData?.studentId,
                email: editData?.email,
                phone: editData?.phone,
                age: editData?.age,
                avatar: editData?.avatar,
                schoolId: editData?.schoolId,
                schoolClassId: editData?.schoolClass?.id,
            });
        }
    }, [editData, open]);

    const {data: schoolData = {}} = useQuery({
        queryKey: ['allSchool', dataSearch],
        queryFn: ({queryKey}) => paperRecyclingApis.allSchools(queryKey[1])
    })

    const {data: classData = {}} = useQuery({
        queryKey: ['allClass',dataSearch],
        queryFn: ({queryKey}) => paperRecyclingApis.getClasses(queryKey[1])
    })

    const {data: {contents: allSchools = []} = {}} = schoolData
    const {data: {contents: allClass = []} = {}} = classData

    console.log(schoolData);

    const handleUpdateUser = async (values) => {
        try {
            setIsLoadingUpdateUser(true)
            const data = {...values, schoolClass: {...editData.schoolClass, id: values.schoolClassId}}
            const updateUserData = await paperRecyclingApis.updateUserById(editData?.id, data)
            console.log(updateUserData)
            await reloadOrders()
            setOpen(false)
        } catch (err) {
            throw new Error(err.message)
        } finally {
            setIsLoadingUpdateUser(false)
        }
    }

    const onSubmitUpdateUser = async (values) => {
        toast.promise(handleUpdateUser(values), {
            success: () => `Update user ${editData?.name} successfully!`,
            loading: () => "Updating...",
            error: (err) => `${err.message}`
        })
    }


    return (<>
            <Modal
                title="Edit User"
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={1000}
                okText={"OK"}
                cancelText={"Cancel"}
                style={{paddingLeft: 100}}
                footer={[
                    <Button key="back" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={form.submit} disabled={isLoadingUpdateUser}>
                        {isLoadingUpdateUser ? 'Saving...' : 'Save'}
                    </Button>
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => onSubmitUpdateUser(values)}
                >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item

                                name="name"
                                label="Name"
                                rules={[{required: true, message: 'Please enter user name'}]}
                            >
                                <Input placeholder="User Name"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="studentId"
                                label="Student ID"
                                rules={[{required: true, message: 'Please enter student ID'}]}
                            >
                                <Input placeholder="Student ID"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{required: true, message: 'Please enter user email'}]}
                            >
                                <Input placeholder="Email"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>

                            <Form.Item
                                name="phone"
                                label="Phone"
                                rules={[{required: true, message: 'Please enter phone number'}]}
                            >
                                <Input placeholder="Phone"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item

                                name="age"
                                label="Age"
                                rules={[{required: true, message: 'Please enter user age'}]}
                            >
                                <InputNumber
                                    placeholder="Age"
                                    style={{
                                        width: '100%'
                                    }}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="avatar"
                                label="Avatar"
                            >
                                <Input placeholder="Avatar"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item

                                name="schoolId"
                                label="School ID"
                                rules={[{required: true, message: 'Please enter school ID'}]}
                            >
                                {/*<InputNumber*/}
                                {/*  placeholder="School ID"*/}
                                {/*  style={{*/}
                                {/*    width: '100%'*/}
                                {/*  }}/>*/}
                                <Select placeholder="Select school"
                                onChange={(value) => {
                                    console.log("school ID value:", value)
                                    if (!value) {
                                        setDataSearch({
                                            ...dataSearch,
                                            schoolId: null,
                                            schoolClassId: null
                                        })
                                        return
                                    }
                                    form.setFieldValue("schoolClassId", null)
                                    setDataSearch({
                                        ...dataSearch,
                                        schoolId: value,
                                        schoolClassId: null
                                    })
                                }}
                                >
                                    {
                                        allSchools.map(school => {
                                            return (
                                                <Select.Option key={school?.id} value={school?.id}>
                                                    {school?.name}
                                                </Select.Option>
                                            )
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="schoolClassId"
                                label="School Class ID"
                                rules={[{required: true, message: 'Please enter School Class ID'}]}
                            >
                                {/*<InputNumber*/}
                                {/*    placeholder="School Class ID"*/}
                                {/*    style={{*/}
                                {/*        width: '100%'*/}
                                {/*    }}/>*/}
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
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}

export default EditUserModal