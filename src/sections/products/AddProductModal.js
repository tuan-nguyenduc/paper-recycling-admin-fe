import { Col, Form, Input, InputNumber, message, Modal, Row, Select, Upload, Button } from 'antd';
import ImgCrop from 'antd-img-crop';
import { BsPlusLg } from 'react-icons/bs';
import { getBase64, isBase64 } from '../../utils';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import paperRecyclingApis from '../../services/paperRecyclingApis';

const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];
const AddProductModal = ({ editData, open, setOpen, reloadProducts }) => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    data: categoriesData = {},
    isLoading: isLoadingCategories
  } = useQuery(['paperRecyclingApis.allCategories'], () => paperRecyclingApis.allCategories());
  const { data: categories = [] } = categoriesData;

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setFiles([]);
      setImages([]);
    }
  }, [open]);

  useEffect(() => {
    if (editData && open) {
      form.setFieldsValue({
        name: editData?.name,
        categoryId: editData?.category?.id,
        price: editData?.price,
        quantity: editData?.quantity,
        description: editData?.description
      });
      const imagesUrls = editData?.images?.split(',')?.filter((item) => !!item);
      setImages(
        imagesUrls.map((url) => ({
          uid: url,
          url
        }))
      );
    }
  }, [editData, open]);

  const handleChooseFile = ({ file, onSuccess }) => {
    if (ALLOWED_TYPES.includes(file.type)) {
      if (file.size > 1024 * 1024 * 2) {
        toast.error('File size is too large');
        return;
      }
      setFiles([...files, file]);
      getBase64(file, (base64Data) => {
        setImages([
          ...images,
          {
            uid: file.uid,
            url: base64Data
          }
        ]);
      });
      onSuccess();
    } else {
      toast.error('File Type is not allowed');
    }
  };

  const handleRemoveFile = (file) => {
    const delFile = files.filter((item) => item.uid !== file.uid);
    const delImage = images.filter((item) => item.uid !== file.uid);
    setFiles(delFile);
    setImages(delImage);
  };
  const onCreateProductPromise = async (data) => {
    try {
      setLoading(true);
      if (!images.length) {
        throw new Error('Please add product images');
      }
      //upload images
      const uploadImages = await Promise.all(files.map(async (file) => {
        try {
          const uploadResp = await paperRecyclingApis.uploadImage(file);
          return uploadResp.data;
        } catch (err) {
          console.log('upload image error', err);
          return null;
        }
      }));
      const validUploadImages = uploadImages.filter((item) => !!item);
      const oldImages = images.filter((item) => !isBase64(item.url));
      const oldImagesUrls = oldImages.map((item) => item.url);
      const toSendImages = [...validUploadImages, ...oldImagesUrls];

      const newProduct = {
        name: data.name,
        price: data.price,
        description: data.description,
        images: toSendImages.join(','),
        categoryId: data.categoryId,
        quantity: data.quantity
      };
      let resp;
      if (editData) {
        resp = await paperRecyclingApis.updateProduct(editData.id, newProduct);
      } else {
        resp = await paperRecyclingApis.createProduct(newProduct);
      }
      await reloadProducts();
      form.resetFields();
      setFiles([]);
      setImages([]);
      setOpen(false);
      return resp.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = (values) => {

    toast.promise(onCreateProductPromise(values), {
      loading: 'Processing...',
      success: newProduct => `Product ${newProduct?.name} saved successfully`,
      error: err => 'Failed: ' + err.message
    });

  };
  return (
    <>
      <Modal
        title={editData ? 'Edit product' : 'Add product'}
        width={800}
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="back" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={form.submit} loading={loading}>
            Save
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item

                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter product name' }]}
              >
                <Input placeholder="Product name"/>
              </Form.Item>
            </Col>
            <Col span={12}>

              <Form.Item
                name="categoryId"
                label="Categories"
                rules={[{ required: true, message: 'Please select product category' }]}
              >
                <Select
                  placeholder="Select product category"
                  loading={isLoadingCategories}
                >
                  {
                    categories.map((category) => (
                      <Select.Option key={category.id} value={category.id}>
                        {category.name}
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: 'Please enter product qty' }]}
              >
                <InputNumber
                  placeholder="Product quantity"
                  style={{
                    width: '100%'
                  }}/>
              </Form.Item>
            </Col>
            <Col span={12}>

              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please select product category' }]}
              >
                <InputNumber placeholder="Product price"
                             style={{
                               width: '100%'
                             }}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
              >
                <Input.TextArea placeholder="Product description"
                                rows={3}/>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Pictures"
            required
            rules={[
              { required: true, message: 'Please add product images' }
            ]}
          >
            <ImgCrop
              showReset={true}
              //crop to square
              aspect={1}
            >
              <Upload
                listType="picture-card"
                accept={ALLOWED_TYPES.join(', ')}
                customRequest={handleChooseFile}
                onRemove={handleRemoveFile}
                fileList={images}
              >
                <div>
                  <BsPlusLg/>
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </ImgCrop>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddProductModal;