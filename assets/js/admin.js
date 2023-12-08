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
    sortOrderData();
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
// render C3 LV2
function sortOrderData() {
    let total = {};

    ordersData.forEach((item) => {
        item.products.forEach((productItem) => {
            if (total[productItem.title] == undefined) {
                total[productItem.title] = productItem.price * productItem.quantity;
            } else {
                total[productItem.title] += productItem.price * productItem.quantity;
            }
        });
    });

    // 資料格式調整
    let columnsData = [];
    let productItems = Object.keys(total);
    productItems.forEach((productItem) => {
        let ary = [];
        ary.push(productItem);
        ary.push(total[productItem]);
        columnsData.push(ary);
    });

    // 排序大到小
    columnsData.sort((a, b) => b[1] - a[1]);

    let newData = [];
    let others = ["其他", 0];
    columnsData.forEach((item, index) => {
        if (index < 3) {
            newData.push(item);
        } else {
            others[1] += item[1];
        }
    });
    newData.push(others);

    renderC3(newData);
}

// C3.js
function renderC3(data) {
    let colorList = ["#301E5F", "#5434A7", "#9D7FEA", "#DACBFF"];
    let colorSetting = {};
    data.forEach((item, index) => {
        colorSetting[item[0]] = colorList[index];
    });

    let chart = c3.generate({
        bindto: "#chart",
        data: {
            type: "pie",
            columns: data,
            colors: colorSetting,
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
