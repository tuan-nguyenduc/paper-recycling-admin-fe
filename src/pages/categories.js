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
import { AiOutlineEdit } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import AddOrEditCategoryModal from '../sections/categories/AddOrEditCategoryModal';
import toast from 'react-hot-toast';
import _debounce from "lodash/debounce";

const Categories = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [toEdit, setToEdit] = useState(null);
    const [dataSearch, setDataSearch] = useState({
        page: 0,
        limit: 10,
        q: '',
    });
  const {
    data: categoriesData = {},
    isLoading: isLoadingCategories,
    refetch: refetchCategories
  } = useQuery(['paperRecyclingApis.allCategories', dataSearch], ({queryKey}) => paperRecyclingApis.allCategories(queryKey[1]));

  const { data: categories = [] } = categoriesData;
  const tableData = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      key: category.id
    }));
  }, [categories]);
  const onDeleteCategory = async (id) => {
    try {
      await paperRecyclingApis.deleteCategory(id);
      await refetchCategories();
      toast.success('Delete category success');
    } catch (err) {
      toast.error('Delete category failed: ' + err.message);
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
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        render: (text) => {
          if (!text) {
            return null;
          }
          return <Image src={text} width={70} height={70}/>;
        }
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description'
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
              title="Delete category"
              description="Are you sure to delete this category?"
              onConfirm={async () => {
                await onDeleteCategory(record.id);
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
          Categories | Paper Recycling
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
                  Categories
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
                placeholder="Search categories"
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
      <AddOrEditCategoryModal
        open={openAddModal}
        setOpen={setOpenAddModal}
        onSave={refetchCategories}
        editData={toEdit}
      />
    </>
  );
};
Categories.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Categories;
