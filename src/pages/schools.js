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
import { Scrollbar } from '../components/scrollbar';
import { Button as AntdButton, Pagination, Popconfirm, Table } from 'antd';
import { Layout as DashboardLayout } from '../layouts/dashboard/layout';
import { useQuery } from 'react-query';
import paperRecyclingApis from '../services/paperRecyclingApis';
import { useMemo, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import AddOrEditSchoolModal from '../sections/schools/AddOrEditSchoolModal';

export const Schools = () => {
  const [openModal, setOpenModal] = useState(false);
  const [toEdit, setToEdit] = useState(null);
  const [dataSearch, setDataSearch] = useState({
    page: 0,
    limit: 10
  });
  const {
    data: schoolsData = {},
    isLoading: isLoadingSchools,
    refetch: refetchSchools
  } = useQuery(['paperRecyclingApis.allSchools', dataSearch],
    ({ queryKey }) => paperRecyclingApis.allSchools(queryKey[1]));

  const { data: { contents: schools = [], totalElements = 1 } = {} } = schoolsData;

  const tableData = useMemo(() => {
    return schools.map((school) => ({
      ...school,
      key: school.id
    }));
  }, [schools]);
  const deleteSchool = async (id) => {
    try {
      await paperRecyclingApis.deleteSchool(id);
      await refetchSchools();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Principal',
      dataIndex: 'principal',
      key: 'principal'
    },
    {
      title: 'type',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <Stack direction="row"
               spacing={1}>
          <AntdButton onClick={() => {
            setToEdit(record);
            setOpenModal(true);
          }}>
            <AiOutlineEdit/>
          </AntdButton>
          <Popconfirm
            title="Delete category"
            description="Are you sure to delete this school?"
            onConfirm={async () => {
              await deleteSchool(record.id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <AntdButton danger>
              <BsFillTrashFill/>
            </AntdButton>
          </Popconfirm>

        </Stack>
      )
    }
  ];

  return (
    <>
      <Head>
        <title>
          Schools | Paper Recycling
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
                  Schools
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
                    setOpenModal(true);
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
            <Card sx={{ p: 2 }}>
              <OutlinedInput
                defaultValue=""
                fullWidth
                placeholder="Search schools"
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
                sx={{ maxWidth: 500 }}
              />
            </Card>
            <Card>
              <Scrollbar>
                <Box sx={{ minWidth: 800 }}>
                  <Table
                    loading={isLoadingSchools}
                    columns={columns}
                    dataSource={tableData}
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
                current={1}
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
      <AddOrEditSchoolModal
        open={openModal}
        setOpen={setOpenModal}
        editData={toEdit}
        reload={refetchSchools}
      />
    </>
  );
};

Schools.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Schools;