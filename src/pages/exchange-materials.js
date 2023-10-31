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
import { useMemo, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
// import AddOrEditCategoryModal from '../sections/categories/AddOrEditCategoryModal';
import toast from 'react-hot-toast';
import { post } from 'axios';
import AddOrEditExchangeMaterialModal
  from '../sections/exchange-materials/AddOrEditExchangeMaterialModal';
// import AddOrEditExchangeMaterialModal from '../sections/ExchangeMaterials/AddOrEditExchangeMaterialModal';
// import {ExchangeMaterialStatus} from "../constants";
// import {formatExchangeMaterialStatus} from "../utils";

const ExchangeMaterials = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [toEdit, setToEdit] = useState(null);
  const {
    data: materialsData = {},
    isLoading: isLoadingMaterials,
    refetch: refetchMaterials
  } = useQuery(['exchangeMaterials'], () => paperRecyclingApis.getAllExchangeMaterial());
  const { data: {contents: materials = []} = {} } = materialsData;
  const tableData = useMemo(() => {
    return materials.map((material) => ({
      ...material,
      key: material.id,
      campaign: material?.post?.name,
    }));
  }, [materials]);

  console.log(materials);
  const onDeleteMaterials = async (id) => {
    try {
      await paperRecyclingApis.deleteExchangeMaterial(id);
      await refetchMaterials();
      toast.success('Delete material successfully');
    } catch (err) {
      toast.error('Delete material failed: ' + err.message);
    }
  };
  const columns = useMemo(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: 'Campaign',
        dataIndex: 'campaign',
        key: 'campaign'
      },
      {
        title: 'Name',
        dataIndex: 'material',
        key: 'name'
      },
      {
        title: 'Reward',
        dataIndex: 'reward',
        key: 'reward',
        width: '10%'
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
                <Image src={imagesArr[0]} alt="exchange material image" width={70}/>
              );
            }
          }
          return 'No image';
        }
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (description) => {
          return <div>{description?.length > 200 ? description?.substring(0, 100) + "..." : description}</div>;
        }
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <Stack direction="row" spacing={1}>
            <AntdButton onClick={() => {
              setToEdit(record);
              setOpenAddModal(true);
            }}>
              <AiOutlineEdit/>
            </AntdButton>
            <Popconfirm
              title="Delete material"
              description="Are you sure to delete this material?"
              onConfirm={async () => {
                await onDeleteMaterials(record.id);
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
  }, []);
  return (
    <>
      <Head>
        <title>
          Exchange Materials | Paper Recycling
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
                  Exchange Materials
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
                placeholder="Search Exchange Materials"
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
      <AddOrEditExchangeMaterialModal
        open={openAddModal}
        setOpen={setOpenAddModal}
        onSave={refetchMaterials}
        editData={toEdit}
        reloadExchangeMaterial={refetchMaterials}
      />
    </>
  );
};
ExchangeMaterials.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default ExchangeMaterials;
