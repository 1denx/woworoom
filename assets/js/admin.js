const baseUrl = 'https://livejs-api.hexschool.io/api/livejs/v1/admin/';
const apiPath = 'eden';
const apiUrl = `${baseUrl}${apiPath}`;

// 取得訂單
let ordersData = [];
function getOrderData() {
    axios.get(`${apiUrl}/orders`)
        .then((res) => {
            ordersData = res.data;
            console.log(ordersData)
        })
}
getOrderData()
// 渲染訂單