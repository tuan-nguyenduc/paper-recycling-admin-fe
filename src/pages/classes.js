import { Layout as DashboardLayout } from '../layouts/dashboard/layout';
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
import { Button as AntdButton, Pagination, Popconfirm, Select, Table } from 'antd';
import AddOrEditSchoolModal from '../sections/schools/AddOrEditSchoolModal';
import {useCallback, useMemo, useState} from 'react';
import AddClassesModal from '../sections/classes/AddClassesModal';
import { useQuery } from 'react-query';
import paperRecyclingApis from '../services/paperRecyclingApis';
import { AiOutlineEdit } from 'react-icons/ai';
import {BsFillShareFill, BsFillTrashFill} from 'react-icons/bs';
import EditClassModal from '../sections/classes/EditClassModal';
import {formatPrice} from "../utils";
import DistributeRewardModal from "../sections/classes/DistributeRewardModal";
import _debounce from "lodash/debounce";

const ClassesManagement = () => {
  const [dataSearch, setDataSearch] = useState({
    page: 0,
    limit: 10,
    schoolId: null,
    q: ""
  });
  const [toEdit, setToEdit] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [toDistribute, setToDistribute] = useState(null)
  const [openDistributeRewardModal, setOpenDistributeRewardModal] = useState(false)
  const {
    data: classesData = {},
    isFetching: isFetchingClasses,
    refetch: refetchClasses
  } = useQuery(['paperRecyclingApis.getClasses', dataSearch],
    ({ queryKey }) => paperRecyclingApis.getClasses(queryKey[1]));
  const { data: { contents: classes = [], totalElements = 1 } = {} } = classesData;

  const {
    data: { data: { contents: schools = [] } = {} } = {},
    isLoading: isLoadingSchools
  } = useQuery(['allSchools'], () => paperRecyclingApis.allSchools({
    page: 0,
    limit: 100 // all schools
  }));

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Class name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      width: 80
    },
    {
      title: 'School',
      dataIndex: 'schoolName',
      key: 'school'
    },
    {
      title: 'Total students',
      dataIndex: 'totalStudent',
      key: 'totalStudent',
      width: '10%'
    },
    {
      title: 'Paper Point Reward',
      dataIndex: 'rewardPaperPoint',
      width: '15%',
      key: 'rewardPaperPoint',
      render: (amount) => {
        return <div>{formatPrice(amount)} PP</div>
      }
    },
    // {
    //   title: 'Next Class Id',
    //   dataIndex: 'nextClassId',
    //   key: 'nextClassId',
    //   width: 100
    // },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <Stack direction="row"
               spacing={1}>
          <AntdButton onClick={() => {
            setToEdit(record);
            setOpenEditModal(true);
          }}>
            <AiOutlineEdit/>
          </AntdButton>
          <Popconfirm
            title="Delete category"
            description="Are you sure to delete this school?"
            onConfirm={async () => {
              // await deleteSchool(record.id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <AntdButton danger>
              <BsFillTrashFill/>
            </AntdButton>
          </Popconfirm>
          <AntdButton onClick={() => {
            setToDistribute(record);
            setOpenDistributeRewardModal(true);
          }}
          icon={<BsFillShareFill />}
          >
            Distribute Reward
          </AntdButton>
        </Stack>
      )
    }
  ];
  const tableData = useMemo((() => {
    const tableData = classes.map((classItem) => ({
      ...classItem,
      key: classItem.id,
      schoolName: classItem?.school?.name,
    }));
    return tableData;
  }), [classes]);

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
          Classes | Paper Recycling
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
                  Classes
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
                    // setToEdit(null);
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
              <OutlinedInput
                  defaultValue=""
                  fullWidth
                  placeholder="Search classes"
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
                  sx={{ maxWidth: 500 }}
              />
              <Select style={{ width: 350 }} size="large" allowClear onChange={(value) => {
                setDataSearch({
                  ...dataSearch,
                  page: 0,
                  schoolId: value
                });
              }}
              placeholder="Select school"
              >
                {
                  schools.map((school) => (
                    <Select.Option key={school.id} value={school.id}>
                      {school.name}
                    </Select.Option>
                  ))
                }
              </Select>
            </Card>
            <Card>
              <Scrollbar>
                <Box sx={{ minWidth: 800 }}>
                  <Table
                    columns={columns}
                    dataSource={tableData}
                    loading={isFetchingClasses}
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
      <AddClassesModal
        open={openModal}
        setOpen={setOpenModal}
        onSuccess={refetchClasses}
      />
      <EditClassModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        onSuccess={refetchClasses}
        toEdit={toEdit}
      />
      <DistributeRewardModal
          open={openDistributeRewardModal}
          setOpen={setOpenDistributeRewardModal}
          toDistribute={toDistribute}
          refetchClasses={refetchClasses}
      />
    </>
  );
};
ClassesManagement.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;
export default ClassesManagement;