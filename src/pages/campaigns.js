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
import { Button as AntdButton, Image, Pagination, Popconfirm, Table } from 'antd';
import AddProductModal from '../sections/products/AddProductModal';
import { useQuery } from 'react-query';
import paperRecyclingApis from '../services/paperRecyclingApis';
import {useCallback, useMemo, useState} from 'react';
import { AiOutlineEdit, AiOutlineEye } from 'react-icons/ai';
import { BsEyeFill, BsFillCheckCircleFill, BsFillTrashFill } from 'react-icons/bs';
import AddOrEditCategoryModal from '../sections/categories/AddOrEditCategoryModal';
import toast from 'react-hot-toast';
import { post } from 'axios';
import AddOrEditCampaignModal from '../sections/campaigns/AddOrEditCampaignModal';
import { campaignStatus } from '../constants';
import { formatCampaignStatus } from '../utils';
import { ref } from 'yup';
import _debounce from "lodash/debounce";

const Campaigns = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [toEdit, setToEdit] = useState(null);
  const [dataSearch, setDataSearch] = useState({
    page: 0,
    limit: 10,
    q: '',
  });
  const {
    data: campaignsData = {},
    isLoading: isLoadingCampaigns,
    refetch: refetchCampaigns
  } = useQuery(['paperRecyclingApis.allPosts', dataSearch], ({queryKey}) => paperRecyclingApis.getAllCampaigns(queryKey[1]));

  const { data: { contents: campaigns = [] } = {} } = campaignsData;
  const tableData = useMemo(() => {
    return campaigns.map((campaign) => ({
      ...campaign,
      key: campaign.id,
      statusName: formatCampaignStatus(campaign.status)
    }));
  }, [campaigns]);
  const onDeleteCampaign = async (id) => {
    try {
      await paperRecyclingApis.deleteCampaign(id);
      await refetchCampaigns();
      toast.success('Delete campaign successfully');
    } catch (err) {
      toast.error('Delete campaign failed: ' + err.message);
    }
  };

  const handleFinishCampaign = async (id) => {
    try {
      return await paperRecyclingApis.confirmCampaign(id);
    } catch (e) {
      throw new Error(e.message);
    } finally {
      await refetchCampaigns();
    }
  };
  const handleSubmitFinish = (id) => {
    toast.promise(handleFinishCampaign(id), {
      success: () => 'Finish campaign Successfully!',
      loading: () => 'Finishing campaign...',
      error: (err) => `${err.message}`
    });
  };

  const handeSearchDebounce = (value) => {
    setDataSearch({
      ...dataSearch,
      q: value
    });
  };
  const debounceFn = useCallback(_debounce(handeSearchDebounce, 500), [dataSearch]);

  const columns = useMemo(() => {
    return [
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
        title: 'Image',
        dataIndex: 'images',
        key: 'images',
        render: (images) => {
          if (images) {
            const imagesArr = images?.split(',')?.filter((item) => !!item);
            if (imagesArr.length > 0) {
              return (
                <Image src={imagesArr[0]} alt="campaign image" width={70}/>
              );
            }
          }
          return 'No image';
        }
      },
      {
        title: 'Description',
        dataIndex: 'description',
        width: '30%',
        key: 'description',
        render: (description) => {
          return <div>{description?.length > 200
            ? description?.substring(0, 100) + '...'
            : description}</div>;
        }
      },
      {
        title: 'Status',
        dataIndex: 'statusName',
        key: 'statusName'
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <Stack direction="row" spacing={1}>
            {record.status === 1
              ? <>
                <AntdButton onClick={() => {
                  setToEdit(record);
                  setOpenAddModal(true);
                }}>
                  <AiOutlineEdit/>
                </AntdButton>
                <Popconfirm
                  title="Finish Campaign"
                  description="Are you sure to finish this campaign?"
                  onConfirm={async () => {
                    await handleSubmitFinish(record.id);

                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <AntdButton style={{ borderColor: 'green' }} onClick={() => {
                  }}>
                    <BsFillCheckCircleFill color="green" size={16}/>
                  </AntdButton>
                </Popconfirm>
                <Popconfirm
                  title="Delete campaign"
                  description="Are you sure to delete this campaign?"
                  onConfirm={async () => {
                    await onDeleteCampaign(record.id);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <AntdButton danger>
                    <BsFillTrashFill/>
                  </AntdButton>
                </Popconfirm>
              </> : <AntdButton >
                <BsEyeFill size={18}/>
              </AntdButton>}

          </Stack>
        )
      }
    ];
  }, []);
  return (
    <>
      <Head>
        <title>
          Campaigns | Paper Recycling
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
                  Campaigns
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
            <Card sx={{ p: 2 }}>
              <OutlinedInput
                defaultValue=""
                fullWidth
                placeholder="Search campaigns"
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
            </Card>
            <Card>
              <Scrollbar>
                <Box sx={{ minWidth: 800 }}>
                  <Table
                    columns={columns}
                    dataSource={tableData}
                    loading={false}
                    pagination={false}
                    scroll={{
                      x: 'max-content',
                      y: 500
                    }}
                  />
                </Box>
              </Scrollbar>
              {/*<Pagination*/}
              {/*  style={{*/}
              {/*    marginTop: 16*/}
              {/*  }}*/}
              {/*  showSizeChanger*/}
              {/*  current={1}*/}
              {/*  onChange={(page, pageSize) => {*/}
              {/*    // setPage(page - 1);*/}
              {/*    // setRowsPerPage(pageSize);*/}
              {/*  }}*/}
              {/*  total={100}*/}
              {/*  pageSize={10}*/}
              {/*  defaultCurrent={1}*/}
              {/*/>*/}
            </Card>
          </Stack>
        </Container>
      </Box>
      <AddOrEditCampaignModal
        open={openAddModal}
        setOpen={setOpenAddModal}
        onSave={refetchCampaigns}
        editData={toEdit}
        reloadCampaign={refetchCampaigns}
      />
    </>
  );
};
Campaigns.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Campaigns;
