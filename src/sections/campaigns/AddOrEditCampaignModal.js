import {Form, Input, Modal, Button as AntdButton, Upload, Image, Button} from 'antd';
import toast from 'react-hot-toast';
import {useEffect, useState} from 'react';
import paperRecyclingApis from '../../services/paperRecyclingApis';
import {getBase64, isBase64} from '../../utils';
import {AiOutlineCloudUpload} from 'react-icons/ai';
import ImgCrop from 'antd-img-crop';
import {useAuth} from '../../hooks/use-auth';
import {BsPlusLg} from 'react-icons/bs';

const ALLOWED_TYPES = [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'image/svg+xml'
];
const AddOrEditCampaignModal = ({open, setOpen, onSave, editData, reloadCampaign}) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [files, setFiles] = useState(null);
    const [images, setImages] = useState(null);
    const auth = useAuth();
    const saveOrUpdateCampaign = async (data) => {
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

            const newCampaign = {
                name: data.name,
                description: data.description,
                images: toSendImages.join(','),
                schoolId: auth?.user?.schoolId
            };
            let resp;
            if (editData) {
                resp = await paperRecyclingApis.updateCampaign(editData.id, newCampaign);
            } else {
                resp = await paperRecyclingApis.createCampaign(newCampaign);
            }
            await reloadCampaign();
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
    const onFinish = (values) => {
        toast.promise(saveOrUpdateCampaign(values), {
            loading: 'Saving Campaign...',
            success: 'Saved campaign successfully',
            error: err => 'Save campaign failed: ' + err.message
        });
    };

    useEffect(() => {
        if (!open) {
            form.resetFields();
            setFiles([]);
            setImages([]);

        }
    }, [open]);

    useEffect(() => {
        if (editData && open) {
            form.setFieldsValue(editData);
            const imagesUrls = editData?.images?.split(',')?.filter((item) => !!item);
            setImages(
                imagesUrls.map((url) => ({
                    uid: url,
                    url
                }))
            );
        }
    }, [editData, open]);

    const handleChooseFile = ({file, onSuccess}) => {
        if (ALLOWED_TYPES.includes(file.type)) {
            if (file.size > 2 * 1024 * 1024) {
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

    return (
        <Modal
            title={editData ? "Edit Campaign" :"Add Campaign"}
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
            width={800}
        >
            <Form
                onFinish={onFinish}
                layout="vertical"
                name="Campaign"
                form={form}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{required: true, message: 'Please enter campaign name'}]}
                >
                    <Input placeholder="Campaign name"/>
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                >
                    <Input.TextArea spellCheck={false} placeholder="Description" rows={6}/>
                </Form.Item>
                <Form.Item
                    label="Images"
                >

                    <ImgCrop
                        showReset={true}
                        //crop to square
                        aspect={2}
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
                                <div style={{marginTop: 8}}>Upload</div>
                            </div>
                        </Upload>
                    </ImgCrop>
                </Form.Item>
            </Form>

        </Modal>
    );
};

export default AddOrEditCampaignModal;