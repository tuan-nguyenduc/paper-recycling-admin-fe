import {Button, Modal, Popconfirm} from "antd";
import {formatOrderStatus, formatPrice, formatStatus} from "../../utils";
import {Scrollbar} from "../../components/scrollbar";
import {Box} from "@mui/material";
import {red} from "@mui/material/colors";
import paperRecyclingApis from "../../services/paperRecyclingApis";
import toast from "react-hot-toast";

const EditOrderModal = ({open, setOpen, reloadOrders, editData}) => {

    const handleConfirmOrder = async (id) => {
        try {
            const confirmOrderData = await paperRecyclingApis.confirmOrder(id)
            await reloadOrders();
        } catch (err) {
            throw new Error(err)
        }
    }

    const submitConfirmOrder = async (id) => {
        toast.promise(handleConfirmOrder(id), {
            success: () => "Confirm order successfully!",
            loading: () => "Confirming order...",
            error: (err) => `${err.message}`
        })
        setOpen(false);
    }


    const handleCancelOrder = async () => {
        try {
            const cancelOrderData = await paperRecyclingApis.cancelOrder(editData.id)
            await reloadOrders();
        } catch (err) {
            throw new Error(err)
        }

    }

    const submitCancelOrder = async (id) => {
        toast.promise(handleCancelOrder(id), {
            success: () => "Cancel order successfully!",
            loading: () => "Cancelling order...",
            error: (err) => `${err.message}`
        })
        setOpen(false);
    }

    return (editData && <>
        <Modal
            title="Order Information"
            centered
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            width={600}
            okText={"OK"}
            cancelText={"Cancel"}
            footer={editData.status === 2 ? [
                <Popconfirm key={1}
                    title="Cancel this order"
                    description="Are you sure to cancel this order?"
                    onConfirm={() => submitCancelOrder(editData?.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button style={{color: '#FFF', backgroundColor: '#DC3545'}}
                    >
                        Cancel Order
                    </Button>
                </Popconfirm>,
                <Button key={2} style={{margin: 20, color: '#FFF', backgroundColor: '#07BFA5'}}
                        onClick={() => submitConfirmOrder(editData?.id)}>
                    Confirm Order
                </Button>
            ] : [
                <Button key="back" onClick={() => setOpen(false)}>
                    Cancel
                </Button>,
                <Button key="ok" type='primary' onClick={() => setOpen(false)}>
                    OK
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
                    border: 'none'
                }}
                type="button"
            >
                Order Code: {editData?.id}
            </button>
            <div style={{
                overflow: "auto",
                height: 300,
            }}>
                {editData?.orderDetails.map((orderItem) => {
                    {
                        return (<>
                            <div style={{margin: 20, backgroundColor: '#FAFAFA', borderRadius: 20}}
                                 key={orderItem.id}>
                                <img src={orderItem.product.images} alt={orderItem.product.name}
                                     width={70} height={70}/>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "400",
                                        color: "#01221D",
                                        marginLeft: "20px",
                                        display: "inline-block",
                                    }}
                                >
                                    {orderItem.product.name} <b>{` x${orderItem.quantity}`}</b>
                                </p>
                            </div>
                        </>)
                    }
                })}
            </div>

            <p
                style={{
                    fontSize: "14px", fontWeight: "400", color: "#01221D", margin: '20px'
                }}
            >
                Quantity: <b>{editData?.orderDetails.length} products </b>
            </p>
            <p
                style={{
                    fontSize: "14px", fontWeight: "400", color: "#01221D", margin: '20px'
                }}
            >
                Total amount: <b>{formatPrice(editData?.amount)} Paper Point </b>
            </p>
            <p
                style={{
                    fontSize: "14px", fontWeight: "400", color: "#01221D", margin: '20px'
                }}
            >
                Status: <b>{formatOrderStatus(editData?.status)}</b>
            </p>
        </Modal>
    </>)
}

export default EditOrderModal