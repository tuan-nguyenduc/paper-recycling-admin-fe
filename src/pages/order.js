import Head from 'next/head';
import {
    Box,
    Button,
    Card,
    Container, InputAdornment,
    OutlinedInput,
    Stack,
    SvgIcon,
    Typography
} from '@mui/material';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import {Button as AntdButton, Modal, Pagination, Popconfirm, Select, Table} from 'antd';
import {Scrollbar} from '../components/scrollbar';
import AddProductModal from '../sections/products/AddProductModal';
import {Layout as DashboardLayout} from '../layouts/dashboard/layout';
import Page from './products';
import {useCallback, useMemo, useState} from "react";
import {formatOrderStatus, formatPrice, formatStatus} from "../utils";
import {useQuery} from "react-query";
import paperRecyclingApis from "../services/paperRecyclingApis";
import moment from "moment";
import {orderStatus} from "../constants";
import {AiOutlineEdit} from "react-icons/ai";
import {BsFillTrashFill} from "react-icons/bs";
import toast from "react-hot-toast";
import EditOrderModal from '../sections/order/EditOrderModal';
import _debounce from "lodash/debounce";
import {CgMoreO} from "react-icons/cg";
import {LuMoreHorizontal} from "react-icons/lu";

const Order = () => {
    const [dataSearch, setDataSearch] = useState({
        page: 0,
        limit: 10,
        q: '',
        categoryId: '',
        sortBy: '',
        sortDirection: ''
    })
    const [openEditModal, setOpenEditModal] = useState(false)
    const [toEdit, setToEdit] = useState(null)
    const {
        data: ordersData = {},
        isLoading,
        refetch: refetchOrders
    } = useQuery(["allOrders", dataSearch], ({queryKey}) => paperRecyclingApis.allOrders(queryKey[1]), {
        keepPreviousData: true
    })
    const {data: {contents: allOrders = [], totalElements = 0} = {}} = ordersData


    const tableData = useMemo(() => {
        return allOrders.map((order) => ({
            ...order,
            userName: order.user.name,
            statusName: formatOrderStatus(order.status),
            key: order.id,
            createdAt: moment(order.createdAt).format('DD/MM/YYYY')
        }))

    }, [allOrders])

    const columns = useMemo(() => ([
        {
            title: 'Order Code',
            dataIndex: 'id',
            key: 'orderId',
            width: '10%',
        },
        {
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
            width: '20%',
        },
        {
            title: 'Status',
            dataIndex: 'statusName',
            key: 'statusName',
            width: '10%',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: '15%',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: (amount) => {
                return <div>{formatPrice(amount)} PP</div>
            }
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '10%',
            sorter: true,
            sortDirections: ['ascend', 'descend']
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (text, record) => (
                    <Stack direction="row"
                           spacing={1}>
                        <AntdButton onClick={() => {
                            setToEdit(record)
                            setOpenEditModal(true);
                        }}>
                            {record.status === 2 ? <AiOutlineEdit/> : <LuMoreHorizontal />}
                        </AntdButton>

                    </Stack>
            )
        }

    ]), [])

    const handeSearchDebounce = (value) => {
        setDataSearch({
            ...dataSearch,
            q: value
        });
    };

    const debounceFn = useCallback(_debounce(handeSearchDebounce, 500), [dataSearch]);

    return (
        <>
            <Head>
                <title>
                    Orders | Paper Recycling
                </title>
            </Head>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    Orders
                                </Typography>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >
                                    <Button
                                        color="inherit"
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <ArrowUpOnSquareIcon/>
                                            </SvgIcon>
                                        )}
                                    >
                                        Import
                                    </Button>
                                    <Button
                                        color="inherit"
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <ArrowDownOnSquareIcon/>
                                            </SvgIcon>
                                        )}
                                    >
                                        Export
                                    </Button>
                                </Stack>
                            </Stack>
                            <div>
                                {/*<Button*/}
                                {/*    onClick={() => {*/}
                                {/*        // setOpenAddModal(true);*/}
                                {/*        // setToEdit(null);*/}
                                {/*    }}*/}
                                {/*    startIcon={(*/}
                                {/*        <SvgIcon fontSize="small">*/}
                                {/*            <PlusIcon/>*/}
                                {/*        </SvgIcon>*/}
                                {/*    )}*/}
                                {/*    variant="contained"*/}
                                {/*>*/}
                                {/*    Add*/}
                                {/*</Button>*/}
                            </div>
                        </Stack>
                        <Card style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 16px'
                        }}>
                            <OutlinedInput
                                defaultValue=""
                                fullWidth
                                placeholder="Search Orders By Product Name"
                                onChange={(e) => {
                                    debounceFn(e.target.value);
                                }}
                                startAdornment={(
                                    <InputAdornment position="start">
                                        <SvgIcon
                                            color="action"
                                            fontSize="small"
                                        >
                                            <MagnifyingGlassIcon/>
                                        </SvgIcon>
                                    </InputAdornment>
                                )}
                                sx={{maxWidth: 500}}
                            />
                            <Select
                                size={'large'}
                                style={{
                                    width: 200
                                }}
                                placeholder="Select status"
                                onChange={(value) => {
                                    if (!value) {
                                        setDataSearch({
                                            ...dataSearch,
                                            page: 0,
                                            status: ''
                                        });
                                        return;
                                    }
                                    setDataSearch({
                                        ...dataSearch,
                                        status: value
                                    });
                                }}
                                allowClear
                            >
                                {
                                    orderStatus.map((status) => (
                                        <Select.Option key={status.code}
                                                       value={status.code}>
                                            {status.name}
                                        </Select.Option>
                                    ))
                                }
                            </Select>


                        </Card>
                        <Card>
                            <Scrollbar>
                                <Box sx={{minWidth: 800}}>
                                    <Table
                                        columns={columns}
                                        dataSource={tableData}
                                        onChange={(pagination, filters, sorter) => {
                                            setDataSearch({
                                                ...dataSearch,
                                                sortBy: sorter.field,
                                                sortDirection: !sorter.order ? '' : sorter.order === 'ascend' ? 'ASC' : 'DESC',
                                            })
                                        }}
                                        loading={false}
                                        pagination={false}
                                        scroll={{
                                            x: 'max-content',
                                            y: 500
                                        }}
                                    />
                                </Box>
                            </Scrollbar>
                            <Pagination
                                style={{
                                    marginTop: 16
                                }}
                                showSizeChanger
                                current={dataSearch.page + 1}
                                onChange={(page, pageSize) => {
                                    setDataSearch({
                                        ...dataSearch,
                                        page: page - 1,
                                        limit: pageSize
                                    });
                                }}
                                total={totalElements}
                                pageSize={dataSearch.limit}
                                defaultCurrent={1}
                            />
                        </Card>
                    </Stack>
                </Container>
            </Box>
            <EditOrderModal
                open={openEditModal}
                setOpen={setOpenEditModal}
                reloadOrders={refetchOrders}
                editData={toEdit}
            />
        </>
    );
};
Order.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Order;

