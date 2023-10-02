

export const getBase64 = (file, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(file);
};


export const isBase64 = (url) => {
  return url.startsWith('data:image');
};

export const formatPrice = (price) => {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const formatOrderStatus = (status) => {
  switch (status) {
    case 1: return 'CREATED'
    case 2: return 'DELIVERING'
    case 3: return 'COMPLETED'
    case -1: return 'CANCELLED'
  }
}

export const formatPaperCollectStatus = (status) => {
  switch (status) {
    case 1: return 'CREATED'
    case 2: return 'COMPLETED'
    case -1: return 'CANCELLED'
  }
}