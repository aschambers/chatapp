export const config = {
  get headers() {
    return { 'Authorization': 'bearer ' + localStorage.getItem('token') };
  }
};

export const getAuthToken = () => 'bearer ' + localStorage.getItem('token');