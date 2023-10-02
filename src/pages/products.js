import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Box,
  Card,
  Container, InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
  Typography,
  Button
} from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { applyPagination } from 'src/utils/apply-pagination';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { useQuery } from 'react-query';
import paperRecyclingApis from '../services/paperRecyclingApis';
import {
  Table,
  Pagination, Image, Button as AntdButton, Popconfirm, Select
} from 'antd';
import { Scrollbar } from '../components/scrollbar';
import AddProductModal from '../sections/products/AddProductModal';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import toast from 'react-hot-toast';
import moment from 'moment';
import _debounce from 'lodash/debounce';
import { formatPrice } from '../utils';

const Page = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [dataSearch, setDataSearch] = useState({
    page: 0,
    limit: 10,
    q: '',
    categoryId: '',
    sortBy: '',
    sortDirection: ''
  });
  const [toEdit, setToEdit] = useState(null);
  const {
    data: productsData = {},
    isLoading: isLoadingProduct,
    refetch: refetchProducts
  } = useQuery(['allProducts', dataSearch],
    ({ queryKey }) => paperRecyclingApis.allProducts(queryKey[1]), {
      keepPreviousData: true
    });
  const { data: { contents: products = [], totalElements = 0 } = {} } = productsData;

  const {
    data: categoriesData = {},
    isLoading: isLoadingCategories
  } = useQuery(['paperRecyclingApis.allCategories'], () => paperRecyclingApis.allCategories());
  const { data: categories = [] } = categoriesData;

  //normilize data
  const tableData = useMemo(() => {
    return products.map((product) => ({
      ...product,
      categoryName: product?.category?.name,
      key: product.id,
      createdAt: moment(product.createdAt).format('DD/MM/YYYY')
    }));
  }, [products]);

  const onDeleteProduct = async (id) => {
    try {
      await paperRecyclingApis.deleteProduct(id);
      await refetchProducts();
      toast.success('Delete product successfully');
    } catch (error) {
      toast.error('Delete product failed');
    }
  };

  const columns = useMemo(() => ([
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend']
    },
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      width: 100,
      render: (images) => {
        if (images) {
          const imagesArr = images?.split(',')?.filter((item) => !!item);
          if (imagesArr.length > 0) {
            return (
              <Image src={imagesArr[0]} alt="product image" width={70}/>
            );
          }
        }
        return 'No image';
      }
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (price) => {
        return <div>{formatPrice(price)}</div>;
      }
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (quantity) => {
        return <div>{formatPrice(quantity)}</div>;
      }
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 150
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 250
    },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 80,
      sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend']
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <Stack direction="row" spacing={1}>
          <AntdButton onClick={() => {
            setToEdit(record);
            setOpenAddModal(true);
          }}>
            <AiOutlineEdit/>
          </AntdButton>
          <Popconfirm
            title="Delete product"
            description="Are you sure to delete this product?"
            onConfirm={async () => {
              await onDeleteProduct(record.id);
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
  ]), []);
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
          Products | Paper Recycling
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
                  Products
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
              <OutlinedInput
                defaultValue=""
                fullWidth
                placeholder="Search products"
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

              <Select
                size={'large'}
                style={{
                  width: 200
                }}
                placeholder="Select category"
                onChange={(value) => {
                  if (!value) {
                    setDataSearch({
                      ...dataSearch,
                      page: 0,
                      categoryId: ''
                    });
                    return;
                  }
                  setDataSearch({
                    ...dataSearch,
                    categoryId: value
                  });
                }}
                allowClear
              >
                {
                  categories.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))
                }
              </Select>

            </Card>
            <Card>
              <Scrollbar>
                <Box sx={{ minWidth: 800 }}>
                  <Table
                    onChange={(pagination, filters, sorter) => {
                      console.log(sorter);
                      setDataSearch({
                        ...dataSearch,
                        sortBy: sorter.field,
                        sortDirection: sorter.order === 'ascend' ? 'ASC' : 'DESC'
                      });
                    }}
                    columns={columns}
                    dataSource={tableData}
                    loading={isLoadingProduct}
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

      <AddProductModal
        open={openAddModal}
        setOpen={setOpenAddModal}
        reloadProducts={refetchProducts}
        editData={toEdit}
      />
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
