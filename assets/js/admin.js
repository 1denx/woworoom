import { adminUrl, apiPath, adminApiUrl, token } from './config';
// 初始化
function init() {
    getOrderData();
}
init();

// 取得訂單
const orderList = document.querySelector('.js-orderList');
let ordersData = [];
function getOrderData() {
    axios.get(`${adminApiUrl}/orders`, {
        headers: {
            'Authorization': token,
        }
    })
        .then((res) => {
            ordersData = res.data.orders;
            renderOrderData(ordersData);
        })
        .catch((err) => {
            console.log(err)
        })
}
getOrderData()
// 渲染訂單
function renderOrderData(ordersData) {
    let str = '';

    ordersData.forEach((item) => {
        // 組時間字串
        const timeStamp = new Date(item.createdAt * 1000);
        const orderTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth() + 1}/${timeStamp.getDate()}`

        // 產品字串
        let productStr = '';
        item.products.forEach((productItem) => {
            productStr += `<p>${productItem.title}*${productItem.quantity}</p>`
        })
        // 判斷訂單處理狀態
        let orderStatus = '';
        if (item.paid == true) {
            orderStatus = '已處理'
        } else {
            orderStatus = '未處理'
        }
        // 組訂單字串
        str += `<tr>
        <td>${item.id}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          ${productStr}
        </td>
        <td>${orderTime}</td>
        <td class="orderStatus">
          <a href="#" data-status="${item.paid}" data-id="${item.id}" class="js-orderStatus">${orderStatus}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn js-orderDele" data-id="${item.id}" value="刪除" />
        </td>
      </tr>`
    })
    orderList.innerHTML = str;
    renderC3();
}
orderList.addEventListener('click', (e) => {
    e.preventDefault();
    const targetClass = e.target.classList;
    let id = e.target.getAttribute('data-id');
    if (targetClass.contains('js-orderDele')) {
        deleOrderItem(id)
        return
    } else if (targetClass.contains('js-orderStatus')) {
        let status = e.target.getAttribute('data-status');
        changeOrderStatus(status, id)
        return
    }
})
// 修改訂單狀態
function changeOrderStatus(status, id) {
    let newStatus;
    if (!status == false) {
        newStatus = true;
    }
    axios.put(`${adminApiUrl}/orders`, {
        "data": {
            "id": id,
            "paid": newStatus
        }
    }, {
        headers: {
            'Authorization': token,
        }
    })
        .then((res) => {
            Swal.fire({
                showConfirmButton: false,
                title: "修改狀態成功",
                icon: "success",
                timer: 1500
            });
            getOrderData();
        })
        .catch((err) => {
            console.log(err)
        })
}

// 刪除訂單
function deleOrderItem(id) {
    axios.delete(`${adminApiUrl}/orders/${id}`, {
        headers: {
            'Authorization': token,
        }
    })
        .then((res) => {
            Swal.fire({
                showConfirmButton: false,
                title: "刪除該筆訂單成功",
                icon: "success",
                timer: 1500
            });
            getOrderData();
        })
        .catch((err) => {
            console.log(err)
        })
}
// C3.js
function renderC3() {
    // 物件資料收集
    let total = {};
    ordersData.forEach((item) => {
        item.products.forEach((productItem) => {
            if (total[productItem.category] == undefined) {
                total[productItem.category] = productItem.price * productItem.quantity;
            } else {
                total[productItem.category] += productItem.price * productItem.quantity;
            }
        })
    })
    // 做出資料關聯
    let categoryAry = Object.keys(total);
    let newData = []
    categoryAry.forEach((item) => {
        let ary = [];
        ary.push(item);
        ary.push(total[item]);
        newData.push(ary);
    })

    let chart = c3.generate({
        bindto: "#chart", // HTML 元素綁定
        data: {
            type: "pie",
            columns: newData,
        },
    });
}

const deleCartAllBtn = document.querySelector('.discardAllBtn');
deleCartAllBtn.addEventListener('click', (e) => {
    e.preventDefault();
    axios.delete(`${adminApiUrl}/orders`, {
        headers: {
            'Authorization': token,
        }
    })
        .then((res) => {
            Swal.fire({
                showConfirmButton: false,
                title: "已刪除全部訂單",
                icon: "success",
                timer: 1500
            });
            getOrderData();
        })
        .catch((err) => {
            console.log(err)
        })
})
