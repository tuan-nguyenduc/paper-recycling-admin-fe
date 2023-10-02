import {Layout as DashboardLayout} from '../layouts/dashboard/layout';
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
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import {Scrollbar} from '../components/scrollbar';
import {Button as AntdButton, Form, Input, Pagination, Space, Table} from 'antd';
import * as PropTypes from 'prop-types';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import {MinusCircleOutlined, PlusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import paperRecyclingApis from '../services/paperRecyclingApis';
import toast from 'react-hot-toast';
import {useCallback, useMemo, useState} from "react";
import RegisterStudentsModal from "../sections/students/RegisterStudentsModal";
import {useQuery} from "react-query";
import {formatPrice, formatStatus} from "../utils";
import {AiOutlineEdit} from "react-icons/ai";
import moment from "moment/moment";
import EditUserModal from "../sections/students/EditUserModal";
import _debounce from "lodash/debounce";

const Students = () => {
    const [isOpenRegisterModal, setIsOpenRegisterModal] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [toEdit, setToEdit] = useState(null)
    const [dataSearch, setDataSearch] = useState({
        page: 0,
        limit: 10,
    })

    const {
        data: usersData = {},
        isLoading,
        refetch: refetchUsers
    } = useQuery(["allUsers", dataSearch], ({queryKey}) => paperRecyclingApis.allUsers(queryKey[1]), {
        keepPreviousData: true
    })
    const {data: {contents: allUsers = [], totalElements = 0} = {}} = usersData

    const columns = useMemo(() => ([
        {
            title: 'User ID',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
        },
        {
            title: 'User Name',
            dataIndex: 'name',
            key: 'name',
            width: '15%',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: '10%',
        },
        {
            title: 'Student ID',
            dataIndex: 'studentId',
            key: 'studentId',
            width: '10%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '10%',
        },
        {
            title: 'Paper Point',
            dataIndex: 'paperPoint',
            key: 'amount',
            width: '20%',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: (amount) => {
                return <div>{formatPrice(amount)} PP</div>
            }
        },
        // {
        //     title: 'Created At',
        //     dataIndex: 'createdAt',
        //     key: 'createdAt',
        //     width: 70,
        //     sorter: true,
        //     sortDirections: ['ascend', 'descend']
        // },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            width: '15%',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: '15%',
            render: (text, record) => (
                <Stack direction="row"
                       spacing={1}>
                    <AntdButton onClick={() => {
                        setToEdit(record)
                        setIsOpenEditModal(true);
                    }}>
                        <AiOutlineEdit/>
                    </AntdButton>
                </Stack>
            )
        }

    ]), [])

    const tableData = useMemo(() => {
        return allUsers.map((user) => ({
            ...user,
            key: user.id,
        }))

    }, [allUsers])

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
                    Students | Paper Recycling
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
                                    Students
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
                                        setIsOpenRegisterModal(true)
                                        console.log(isOpenRegisterModal)
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
                        <Card sx={{p: 2}}>
                            <OutlinedInput
                                defaultValue=""
                                fullWidth
                                placeholder="Search Students By Name"
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
                                onChange={(e) => debounceFn(e.target.value)}
                            />
                        </Card>
                    </Stack>
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
                </Container>
            </Box>
            <RegisterStudentsModal
                open={isOpenRegisterModal}
                setOpen={setIsOpenRegisterModal}
            />
            <EditUserModal
                open={isOpenEditModal}
                setOpen={setIsOpenEditModal}
                reloadOrders={refetchUsers}
                editData={toEdit}
            />
        </>
    )
};

Students.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Students;