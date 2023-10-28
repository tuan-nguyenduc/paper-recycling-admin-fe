import axiosClient from './axiosClient';

const paperRecyclingApis = {
  login: async (data) => {
    const url = '/auth/login';
    return await axiosClient.post(url, data);
  },
  me: async () => {
    const url = '/users/me';
    return await axiosClient.get(url);
  },
  allProducts: async (params = {}) => {
    const url = '/products';
    return await axiosClient.get(url, { params });
  },
  allCategories: async (params = {}) => {
    const url = '/categories';
    return await axiosClient.get(url, { params });
  },
  getUploadPresignedUrl: async (data) => {
    const url = '/upload/get-presigned-url';
    return await axiosClient.post(url, data);
  },
  createProduct: async (data) => {
    const url = '/products';
    return await axiosClient.post(url, data);
  },
  updateProduct: async (id, data) => {
    const url = `/products/${id}`;
    return await axiosClient.put(url, data);
  },
  deleteProduct: async (id) => {
    const url = `/products/${id}`;
    return await axiosClient.delete(url);
  },
  createCategory: async (data) => {
    const url = '/categories';
    return await axiosClient.post(url, data);
  },
  updateCategory: async (id, data) => {
    const url = `/categories/${id}`;
    return await axiosClient.put(url, data);
  },
  deleteCategory: async (id) => {
    const url = `/categories/${id}`;
    return await axiosClient.delete(url);
  },
  uploadImage: async (file) => {
    const url = '/upload';
    return await axiosClient.post(url, {
      file
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  allSchools: async (params = {}) => {
    const url = '/schools';
    return await axiosClient.get(url, { params });
  },
  addSchool: async (data) => {
    const url = '/schools';
    return await axiosClient.post(url, data);
  },
  ediiSchool: async (id, data) => {
    const url = `/schools/${id}`;
    return await axiosClient.put(url, data);
  },
  deleteSchool: async (id) => {
    const url = `/schools/${id}`;
    return await axiosClient.delete(url);
  },
  addClassBulk: async (data) => {
    const url = '/classes/create-bulk';
    return await axiosClient.post(url, data);
  },
  getClasses: async (params = {}) => {
    const url = '/classes';
    return await axiosClient.get(url, { params });
  },
  editClass: async (id, data) => {
    const url = `/classes/${id}`;
    return await axiosClient.put(url, data);
  },
  allOrders: async (params = {}) => {
    const url = '/orders';
    return await axiosClient.get(url, { params });
  },
  confirmOrder: async (id) => {
    const url = `/orders/${id}/confirm`;
    return await axiosClient.post(url);
  },
  cancelOrder: async (id) => {
    const url = `/orders/${id}/cancel`;
    return await axiosClient.post(url);
  },
  registerStudents: async (data) => {
    const url = '/users/register-students';
    return await axiosClient.post(url, data);
  },
  allUsers: async (params = {}) => {
    const url = '/users';
    return await axiosClient.get(url, { params });
  },
  updateUserById: async (id, data) => {
    const url = `/users/${id}`;
    return await axiosClient.put(url, data);
  },
  allPaperCollectHistories: async (params = {}) => {
    const url = '/paper-collect-histories';
    return await axiosClient.get(url, { params });
  },
  confirmCollectPaper: async (id) => {
    const url = `/paper-collect-histories/${id}/confirm`;
    return await axiosClient.post(url);
  },
  cancelCollectPaper: async (id) => {
    const url = `/paper-collect-histories/${id}/cancel`;
    return await axiosClient.post(url);
  },
  createCollectPaper: async (data) => {
    const url = '/paper-collect-histories';
    return await axiosClient.post(url, data);
  },
  updateCollectPaperById: async (id, data) => {
    const url = `/paper-collect-histories/${id}`;
    return await axiosClient.put(url, data);
  },
  distributeReward: async (id, data) => {
    const url = `/classes/${id}/distribute-paper-point`;
    return await axiosClient.post(url, data);
  },
  getAllCampaigns: async (params = {}) => {
    const url = '/posts';
    return await axiosClient.get(url, { params });
  },
  createCampaign: async (data) => {
    const url = '/posts';
    return await axiosClient.post(url, data);
  },
  updateCampaign: async (id, data) => {
    const url = `/posts/${id}`;
    return await axiosClient.put(url, data);
  },
  deleteCampaign: async (id) => {
    const url = `/posts/${id}`;
    return await axiosClient.delete(url);
  },
  getAllExchangeReward: async (params = {}) => {
    const url = '/posts';
    return await axiosClient.get(url, { params });
  },
  createExchangeReward: async (data) => {
    const url = '/posts';
    return await axiosClient.post(url, data);
  }
};

export default paperRecyclingApis;