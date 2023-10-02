import { Form, Input, Modal, Button as AntdButton, Upload, Image, Button } from 'antd';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import paperRecyclingApis from '../../services/paperRecyclingApis';
import { getBase64, isBase64 } from '../../utils';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import ImgCrop from 'antd-img-crop';

const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];
const AddOrEditCategoryModal = ({ open, setOpen, onSave, editData }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const saveOrUpdateCategory = async (data) => {
    try {
      setLoading(true);
      if (!image) {
        throw new Error('Please upload image');
      }
      //upload image
      let url = !isBase64(image) ? image : null;
      if (file) {
        const uploadData = await paperRecyclingApis.uploadImage(file);
        const { data } = uploadData;
        url = data;
      }
      if (!url) {
        throw new Error('Please upload image');
      }

      if (editData) {
        await paperRecyclingApis.updateCategory(editData.id, {
          ...data,
          image: url
        });
      } else {
        await paperRecyclingApis.createCategory({
          ...data,
          image: url
        });
      }

      await onSave();
      form.resetFields();
      setOpen(false);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const onFinish = (values) => {
    toast.promise(saveOrUpdateCategory(values), {
      loading: 'Saving category...',
      success: 'Action success',
      error: err => 'Action failed: ' + err.message
    });
  };

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open]);

  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
    }
    setImage(editData?.image);
  }, [editData, open]);

  const handleChooseFile = ({ file }) => {
    if (ALLOWED_TYPES.includes(file.type)) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size is too large');
        return;
      }
      setFile(file);
      getBase64(file, setImage);
    } else {
      toast.error('File Type is not allowed');
    }
  };

  return (
    <Modal
      title="Add category"
      open={open}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      footer={[
        <AntdButton key="back" onClick={() => setOpen(false)}>
          Cancel
        </AntdButton>,
        <AntdButton key="submit" type="primary" onClick={() => form.submit()} loading={loading}>
          Save
        </AntdButton>
      ]}
    >
      <Form
        onFinish={onFinish}
        layout="vertical"
        name="category"
        form={form}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter category name' }]}
        >
          <Input placeholder="Category name"/>
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea placeholder="Description" rows={4}/>
        </Form.Item>
        <Form.Item
          label="Image"
        >


          <ImgCrop
            showReset={true}
            //crop to square
            aspect={1}
          >
            <Upload.Dragger
              accept={ALLOWED_TYPES.join(', ')}
              showUploadList={false}
              customRequest={handleChooseFile}
              className="mb-24"
              height={160}
            >
              {image ? (
                <Image src={image} height={120} preview={false}/>
              ) : (
                <div className="flex-row justify-content-center">
                  <div style={{ marginBottom: 16 }}>
                    PNG, JPG, WEBP or GIF. Max 2mb.
                  </div>
                  <Button icon={<AiOutlineCloudUpload/>}>
                    Choose File
                  </Button>
                </div>
              )}
            </Upload.Dragger>
          </ImgCrop>
        </Form.Item>
      </Form>

    </Modal>
  );
};

export default AddOrEditCategoryModal;