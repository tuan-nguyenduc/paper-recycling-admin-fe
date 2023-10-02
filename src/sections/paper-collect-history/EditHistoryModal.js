import paperRecyclingApis from "../../services/paperRecyclingApis";
import toast from "react-hot-toast";
import {Button, Form, Input, InputNumber, Modal, Popconfirm} from "antd";
import {formatPrice, formatStatus} from "../../utils";
import {useState} from "react";

const EditHistoryModal = ({open, setOpen, reloadHistories, editData}) => {
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [form] = Form.useForm();
    const handleConfirmCollectPaper = async (id) => {
        try {
            const confirmCollectPaperData = await paperRecyclingApis.confirmCollectPaper(id)
            await reloadHistories();
        } catch (err) {
            throw new Error(err)
        }
    }

    const submitConfirmCollectPaper = async (id) => {
        toast.promise(handleConfirmCollectPaper(id), {
            success: () => "Confirm order successfully!",
            loading: () => "Confirming order...",
            error: (err) => `${err.message}`
        })
        setOpen(false);
    }


    const handleCancelCollectPaper = async () => {
        try {
            const cancelCollectPaperData = await paperRecyclingApis.cancelCollectPaper(editData.id)
            await reloadHistories();
        } catch (err) {
            throw new Error(err)
        } finally {

        }

    }

    const submitCancelCollectPaper = async (id) => {
        toast.promise(handleCancelCollectPaper(id), {
            success: () => "Cancel order successfully!",
            loading: () => "Cancelling order...",
            error: (err) => `${err.message}`
        })
        setOpen(false);
    }

    const handleUpdateWeight = async (data) => {
        try {
            setIsLoadingUpdate(true)
            const updateData = await paperRecyclingApis.updateCollectPaperById(editData?.id, {
                ...data,
                schoolClassId: editData?.schoolClassId
            })
            reloadHistories()
            form.resetFields()
        } catch (err) {
            throw new Error(err.message)
        } finally {
            setIsLoadingUpdate(false)
        }
    }

    const submitUpdateWeight = async (data) => {
        toast.promise(handleUpdateWeight(data), {
            success: () => "Update success!",
            loading: () => "Updating...",
            error: (e) => `${e}`
        })
    }


    return (editData && <>
        <Modal
            title="Edit Collect Paper"
            centered
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            width={600}
            okText={"OK"}
            cancelText={"Cancel"}
            footer={[
                <Popconfirm key={1}
                            title="Cancel collect paper"
                            description="Are you sure to cancel?"
                            onConfirm={() => submitCancelCollectPaper(editData?.id)}
                            okText="Yes"
                            cancelText="No"
                >
                    <Button style={{color: '#FFF', backgroundColor: '#DC3545'}}
                    >
                        Cancel Collect
                    </Button>
                </Popconfirm>,
                <Button key={2} style={{marginLeft: 8, color: '#FFF', backgroundColor: '#07BFA5'}}
                        onClick={() => submitConfirmCollectPaper(editData?.id)}>
                    Confirm Collect
                </Button>,
                <Button key={3}
                        type="primary"
                        onClick={() => form.submit()}
                        disabled={isLoadingUpdate}
                >
                    {isLoadingUpdate ? 'Updating...' : 'Update Weight'}
                </Button>
            ]}
        >
            <button
                style={{
                    padding: "6px 12px 6px 12px",
                    borderRadius: "8px",
                    background: "#07BFA51A",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#07BFA5",
                    border: 'none',
                    marginBottom: 10
                }}
                type="button"
            >
                Collect Paper Code: {editData?.id}
            </button>
             <Form
                    form={form}
                    onFinish={(values) => submitUpdateWeight(values)}
                    autoComplete='off'
                    layout="vertical"
                >
                    <Form.Item
                        label="Weight"
                        style={{marginTop: 10}}
                        name='weight'
                        rules={[{ required: true, message: 'Please enter weight' }]}

                    >
                        <InputNumber placeholder='Weight' style={{width: '100%'}}/>
                    </Form.Item>

                </Form>


        </Modal>
    </>)
}

export default EditHistoryModal