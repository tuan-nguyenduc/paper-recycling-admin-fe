import {Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space} from "antd";
import {formatPrice, formatStatus} from "../../utils";
import {useEffect, useState} from "react";
import paperRecyclingApis from "../../services/paperRecyclingApis";
import toast from "react-hot-toast";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {SvgIcon} from "@mui/material";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {useQuery} from "react-query";
import {paperCollectStatus} from "../../constants";

const AddOrEditMaterialCollectModal = ({open, setOpen, refetchHistories, editData}) => {
    const [isShowClassSelect, setIsShowClassSelect] = useState(false)
    const [isShowExchangeMaterial, setIsShowExchangeMaterial] = useState(false)
    const [dataSearch, setDataSearch] = useState({
        page: 0,
        limit: 5,
        schoolClassId: null,
        schoolId: null
    })

    const [dataSearchPost, setDataSearchPost] = useState({
        page: 0,
        limit: 10,
        status: paperCollectStatus['CREATED']
    })
    const {data: schoolData = {}} = useQuery({
        queryKey: ["allSchools"],
        queryFn: ({queryKey}) => paperRecyclingApis.allSchools(queryKey[1])
    })
    const {data: classData = {}} = useQuery({
        queryKey: ["allClass", dataSearch],
        queryFn: ({queryKey}) => paperRecyclingApis.getClasses(queryKey[1])
    })

    const {data: campaignsData = {}} = useQuery({
        queryKey: ["allCampaigns", dataSearchPost],
        queryFn: ({queryKey}) => paperRecyclingApis.getAllCampaigns(queryKey[1])
    })

    const {data: exchangeMaterialsData = {}} = useQuery({
        queryKey: ["allExchangeMaterial", dataSearchPost],
        queryFn: ({queryKey}) => paperRecyclingApis.getAllExchangeMaterial(queryKey[1])
    })

    const {data: {contents: allClass = []} = {}} = classData
    const {data: {contents: allSchools = []} = {}} = schoolData
    const {data: {contents: allCampaigns = []} = {}} = campaignsData;
    const {data: {contents: allExchangeMaterials = []} = {}} = exchangeMaterialsData;
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    useEffect(() => {
        if (editData && open) {
            setDataSearchPost({
                ...dataSearchPost,
                postId: editData?.post?.id
            })
            let exchangeRewardWeights = {};
            editData?.materialCollectDetails.map((detail) => {
                const entries = Object.entries(detail);
                let exchangeRewardId;
                let weight;
                for (let i = 0; i < entries.length; i++) {
                    if (entries[i][0] === 'exchangeRewardId') {
                        exchangeRewardId = entries[i][1];
                    }
                    if (entries[i][0] === 'weight') {
                        weight = entries[i][1];
                    }
                }
                exchangeRewardWeights = {
                    ...exchangeRewardWeights,
                    [exchangeRewardId.toString()]: weight,
                }
            })
            form.setFieldsValue({
                schoolClassId: editData?.schoolClassId,
                schoolId: editData?.schoolClass?.school?.id,
                postId: editData?.post?.id,
                ...exchangeRewardWeights,

            });
        }
    }, [editData, open]);
    const handleAddOrEditMaterialCollect = async (values) => {
        try {
            setIsLoading(true);
            let count = 0;
            for (let i = 0; i < Object.keys(values).length; i++) {
                if (!isNaN(Object.getOwnPropertyNames(values)[i])) {
                    count++;
                }
            }
            let data = Object.entries(Object.fromEntries(
                Object.entries(values).slice(0, count)
            ));
            let request = Object.fromEntries(
                Object.entries(values).slice(count)
            );

            let exchangeMaterial = [];
            for (let i = 0; i < data.length; i++) {
                exchangeMaterial[i] = await paperRecyclingApis.getExchangeMaterialById(parseInt(data[i][0]));
            }
            let details = [];
            // console.log(data)
            for (let i = 0; i < data.length; i++) {
                details.push({
                    exchangeRewardId: exchangeMaterial[i]?.data?.id,
                    weight: data[i][1],
                    reward: exchangeMaterial[i]?.data?.reward,
                });

            }
            const req = {
                ...request,
                details
            }
            console.log(req)
            let resp;
            if (editData) {
                resp = await paperRecyclingApis.updateCollectMaterial(editData.id, req);
            } else {
                resp = await paperRecyclingApis.createCollectMaterial(req);
            }
            return resp.data;
        } catch (e) {
            throw new Error(e.message)
        } finally {
            form.resetFields()
            setOpen(false);
            refetchHistories()
            setIsLoading(false)
        }


    }

    const onSubmit = (values) => {
        toast.promise(handleAddOrEditMaterialCollect(values), {
          success: () => editData ? "Update Material Collect Successfully" : "Add Material Collect Successfully!",
          loading: () => editData ? "Updating Material Collect..." : "Adding Material Collect...",
          error: (err) => `${err.message}`
        })
    }

    return (<>
        <Modal
            title= {editData ? "Update Material Collects" : "Add Material Collect"}
            centered
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => {
                form.resetFields()
                // setIsShowClassSelect(false)
                setIsShowExchangeMaterial(false)
                setOpen(false)
            }}

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
                    loading={isLoading}
                >
                    {editData ? isLoading ? 'Updating...' : 'Update' : isLoading ? 'Adding...' : 'Add'}
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
                        rules={[{required: true, message: 'Please select school'}]}
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
                    {
                        <Form.Item
                            name="schoolClassId"
                            label="Class"
                            style={{
                                width: '100%',
                            }}
                            rules={[{required: true, message: 'Please select class'}]}
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
                        name="postId"
                        label="Campaign"
                        style={{
                            width: '100%',
                        }}
                        rules={[{required: true, message: 'Please select class'}]}
                    >
                        <Select
                            placeholder="Select campaign"
                            onChange={(value) => {
                                setDataSearchPost({
                                    ...dataSearchPost,
                                    postId: value
                                })
                                setIsShowExchangeMaterial(true);
                            }}
                            // onClear={() => setIsShowExchangeMaterial(false)
                            // }
                            // allowClear
                        >
                            {
                                allCampaigns.map((campaign) => (
                                    <Select.Option key={campaign?.id}
                                                   value={campaign?.id}>
                                        {campaign?.name}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    {isShowExchangeMaterial || editData ?
                        allExchangeMaterials.length === 0 ? <p>No exchange material found...</p> :
                            allExchangeMaterials.map((exchangeMaterial) => {
                                return (
                                    <Form.Item key={exchangeMaterial.id} label={<b>{exchangeMaterial?.material}</b>}
                                               name={exchangeMaterial.id}>
                                        <InputNumber placeholder="Weight" defaultValue={0} min={0}
                                                     style={{width: '100%'}}/>
                                    </Form.Item>
                                );
                            }) : <div></div>
                    }
                </div>

            </Form>
        </Modal>
    </>)
}


export default AddOrEditMaterialCollectModal