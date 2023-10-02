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
import {Button as AntdButton, Form, Modal, Pagination, Popconfirm, Select, Table} from 'antd';
import {Scrollbar} from '../components/scrollbar';
import AddProductModal from '../sections/products/AddProductModal';
import {Layout as DashboardLayout} from '../layouts/dashboard/layout';
import Page from './products';
import {useCallback, useMemo, useState} from "react";
import {formatPaperCollectStatus, formatPrice, formatStatus} from "../utils";
import {useQuery} from "react-query";
import paperRecyclingApis from "../services/paperRecyclingApis";
import moment from "moment";
import {orderStatus, paperCollectStatus} from "../constants";
import {AiOutlineEdit} from "react-icons/ai";
import {BsFillTrashFill} from "react-icons/bs";
import toast from "react-hot-toast";
import EditOrderModal from '../sections/order/EditOrderModal';
import _debounce from "lodash/debounce";
import {CgMoreO} from "react-icons/cg";
import {LuMoreHorizontal} from "react-icons/lu";
import EditHistoryModal from "../sections/paper-collect-history/EditHistoryModal";
import AddPaperCollectModal from "../sections/paper-collect-history/AddPaperCollectModal";

const PaperCollectHistories = () => {
    const [isShowClassSelect, setIsShowClassSelect] = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false)
    const [openAddModal, setOpenAddModal] = useState(false)
    const [toEdit, setToEdit] = useState(null)
    const [dataSearch, setDataSearch] = useState({
        page: 0,
        limit: 10,
        schoolClassId: null,
        sortBy: '',
        sortDirection: '',
        status: null,
        schoolId: null
    })
    const [form] = Form.useForm()

    const {data: schoolData = {}} = useQuery({
        queryKey: ["allSchools", dataSearch],
        queryFn: ({queryKey}) => paperRecyclingApis.allSchools(queryKey[1])
    })

    const {data: classData = {}} = useQuery({
        queryKey: ["allClass", dataSearch],
        queryFn: ({queryKey}) => paperRecyclingApis.getClasses(queryKey[1])
    })

    const {data: paperCollectHistoryData = {}, refetch: refetchHistories} = useQuery({
        queryKey: ["allHistories", dataSearch],
        queryFn: ({queryKey}) => paperRecyclingApis.allPaperCollectHistories(queryKey[1])
    })


    const {data: {contents: allSchools = []} = {}} = schoolData
    const {data: {contents: allClass = []} = {}} = classData
    const {data: {contents: allHistories = [], totalElements = 0} = {}} = paperCollectHistoryData

    const tableData = useMemo(() => {
        return allHistories.map((history) => ({
            ...history,
            className: history?.schoolClass?.name,
            schoolName: history?.schoolClass?.school?.name,
            address: history?.schoolClass?.school?.address,
            totalStudent: history?.schoolClass?.totalStudent,
            statusName: formatPaperCollectStatus(history?.status)
        }))

    }, [allHistories])

    const columns = useMemo(() => ([
        {
            title: 'Code',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
        },
        {
            title: 'School',
            dataIndex: 'schoolName',
            key: 'schoolName',
            width: '20%',
        },
        {
            title: 'Class',
            dataIndex: 'className',
            key: 'className',
            width: '10%',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: '15%',
        },
        {
            title: 'Status',
            dataIndex: 'statusName',
            key: 'statusName',
            width: '10%',
        },
        {
            title: 'Weight',
            dataIndex: 'weight',
            key: 'weight',
            width: '10%',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: (amount) => {
                return <div>{formatPrice(amount)} KG</div>
            }
        },
        {
            title: 'Reward Paper Point',
            dataIndex: 'paperPointReward',
            key: 'paperPointReward',
            width: '15%',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: (amount) => {
                return <div>{formatPrice(amount)} PP</div>
            }
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (text, record) => (
                <Stack direction="row"
                       spacing={1}>
                    {record.status === 1 &&
                        <AntdButton onClick={() => {
                            setToEdit(record)
                            setOpenEditModal(true);
                        }}>
                            <AiOutlineEdit/>
                        </AntdButton>
                    }
                </Stack>
            )
        },


    ]), [])

    // const handeSearchDebounce = (value) => {
    //   setDataSearch({
    //     ...dataSearch,
    //     q: value
    //   });
    // };

    // const debounceFn = useCallback(_debounce(handeSearchDebounce, 500), [dataSearch]);

    return (
        <>
            <Head>
                <title>
                    Paper Collect History | Paper Recycling
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
                                    Paper Collect History
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
                                <Button
                                    onClick={() => {
                                        setOpenAddModal(true);
                                        setToEdit(null);
                                    }}
                                    startIcon={(
                                        <SvgIcon fontSize="small">
                                            <PlusIcon/>
                                        </SvgIcon>
                                    )}
                                    variant="contained"
                                >
                                    Add
                                </Button>
                            </div>
                        </Stack>
                        <Card style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 16px'
                        }}>
                            <Form
                                form={form}
                                layout='inline'
                            >
                                <Form.Item
                                    name="schoolId"
                                >
                                    <Select
                                        size={'large'}
                                        style={{
                                            width: 200
                                        }}
                                        placeholder="Select school"
                                        onChange={(value) => {
                                            if (!value) {
                                                setIsShowClassSelect(false)
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
                                    >
                                        <Select
                                            size={'large'}
                                            style={{
                                                width: 200
                                            }}
                                            placeholder="Select class"
                                            onChange={(value) => {
                                                if (!value) {
                                                    setDataSearch({
                                                        ...dataSearch,
                                                        page: 0,
                                                        schoolClassId: null
                                                    });
                                                    form.resetFields()
                                                    setIsShowClassSelect(false)
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
                            </Form>


                            <Select
                                size={'large'}
                                style={{
                                    width: 200
                                }}
                                placeholder="Select status"
                                allowClear
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
                            >
                                {
                                    paperCollectStatus.map((status) => (
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
            <EditHistoryModal
                open={openEditModal}
                setOpen={setOpenEditModal}
                reloadHistories={refetchHistories}
                editData={toEdit}
            />
            <AddPaperCollectModal
                open={openAddModal}
                setOpen={setOpenAddModal}
                refetchHistories={refetchHistories}
            />
        </>
    )
        ;
};
PaperCollectHistories.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default PaperCollectHistories;

