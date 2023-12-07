import { baseUrl, apiPath, apiUrl } from './config';
// 初始化
function init() {
    getProductData();
    getCartsData();
}
init();
// 取得產品資料
let productData = [];
function getProductData() {
    axios.get(`${apiUrl}/products`)
        .then((res) => {
            productData = res.data.products;
            renderProductList(productData);
            getCategories();
        })
        .catch((err) => {
            console.log(err)
        })
}

// 渲染產品列表
const productWrap = document.querySelector(".productWrap");
function renderProductList(productData) {
    let str = '';
    productData.forEach((item) => {
        str += `<li class="productCard">
        <h4 class="productType">新品</h4>
        <img
          src="${item.images}"
          alt=""
        />
        <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${toThousands(item.origin_price)}</del>
        <p class="nowPrice">NT$${toThousands(item.price)}</p>
      </li>`
    })
    productWrap.innerHTML = str;
}

// 產品類別篩選
const productSelect = document.querySelector(".productSelect");
function getCategories() {
    const selectAll = productData.map((item) => {
        return item.category;
    });
    const selectItem = selectAll.filter((item, i) => {
        return selectAll.indexOf(item) === i;
    });
    renderCategories(selectItem);
}

// 渲染類別篩選
function renderCategories(selectItem) {
    let str = '<option value="全部" selected>全部</option>';
    selectItem.forEach((item) => {
        str += `<option value="${item}" selected>${item}</option>`;
    })
    productSelect.innerHTML = str;
}

// 監聽篩選欄位
productSelect.addEventListener('change', (e) => {
    const category = e.target.value
    if (category === '全部') {
        renderProductList(productData);
        return;
    } else {
        const filterData = productData.filter((item) => {
            return item.category === category;
        });
        renderProductList(filterData);
    }
});

// 取得購物車資料
let cartsData = [];
function getCartsData() {
    axios.get(`${apiUrl}/carts`)
        .then((res) => {
            document.querySelector('.js-total').textContent = toThousands(res.data.finalTotal);
            cartsData = res.data.carts;
            renderCartsData(cartsData);
        })
        .catch((err) => {
            console.log(err)
        })
}

// 渲染購物車列表
const shoppingCartList = document.querySelector('.shoppingCart-tableList');
function renderCartsData(cartsData) {
    let str = '';
    cartsData.forEach((item) => {
        str += `<tr>
                    <td>
                        <div class="cardItem-title">
                            <img src="${item.product.images}" alt="">
                            <p>${item.product.title}</p>
                        </div>
                    </td>
                    <td>${toThousands(item.product.price)}</td>
                    <td>${toThousands(item.quantity)}</td>
                    <td>${toThousands(item.product.price * item.quantity)}</td>
                    <td class="discardBtn">
                        <a href="#" class="material-icons" data-id="${item.id}">clear</a>
                    </td>
                </tr>`
    })
    shoppingCartList.innerHTML = str;
}

// 加入購物車
productWrap.addEventListener('click', (e) => {
    e.preventDefault();
    let addCartClassList = e.target.classList;
    if (!addCartClassList.contains('addCardBtn')) {
        return;
    }
    let productId = e.target.getAttribute('data-id');

    let numCheck = 1;
    cartsData.forEach((item) => {
        if (item.product.id === productId) {
            numCheck = item.quantity += 1;
        }
    })
    axios.post(`${apiUrl}/carts`, {
        "data": {
            "productId": productId,
            "quantity": numCheck
        }
    }).then((res) => {
        Swal.fire({
            showConfirmButton: false,
            title: "已加入購物車",
            icon: "success",
            timer: 1500
        });
        getCartsData()
    })
})

// 刪除單筆品項
shoppingCartList.addEventListener('click', (e) => {
    e.preventDefault();
    const cartId = e.target.getAttribute('data-id');
    if (cartId == null) {
        return;
    }
    axios.delete(`${apiUrl}/carts/${cartId}`)
        .then((res) => {
            Swal.fire({
                showConfirmButton: false,
                title: "已將該品項刪除",
                icon: "success",
                timer: 1500
            });
            getCartsData();
        })
})
// 刪除全部品項
const deleAllBtn = document.querySelector('.discardAllBtn');
deleAllBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const deleAll = e.target;
    if (deleAll == null) {
        return;
    }
    axios.delete(`${apiUrl}/carts`)
        .then((res) => {
            Swal.fire({
                title: "確定要清空購物車嗎?",
                text: "一但清除將無法復原!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "確定!"
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "刪除成功!",
                        text: "購物車已清空",
                        icon: "success"
                    });
                }
                getCartsData();
            });
        })
        .catch((err) => {
            Swal.fire({
                showConfirmButton: false,
                title: "購物車內沒有任何品項",
                icon: "error",
                timer: 1500
            });
        })
})

// 送出訂單
let formvalue = {};

// 取得欄位值
function getValues(e) {
    const form = e.target.form;

    formvalue = {
        name: form.姓名.value,
        tel: form.手機.value,
        email: form.Email.value,
        address: form.寄送地址.value,
        payment: form.交易方式.value,
    };
}
const form = document.querySelector('.orderInfo-form');
function postOrders() {
    axios.post(`${apiUrl}/orders`, {
        data: {
            user: formvalue,
        },
    }).then((res) => {
        getCartsData();
        Swal.fire({
            showConfirmButton: false,
            title: "訂單建立成功",
            icon: "success",
            timer: 1500
        });

        form.reset();
    }).catch((err) => {
        console.log(err)
    })
}
// 表單驗證
const pattern = /^09\d{8}$/;
const constraints = {
    姓名: {
        presence: {
            message: "必填",
        },
    },
    手機: {
        presence: {
            message: "必填",
        },
        format: {
            pattern: pattern,
            message: "格式不符",
        },
    },
    Email: {
        presence: {
            message: "必填",
        },
        email: {
            message: "格式不符",
        },
    },
    寄送地址: {
        presence: {
            message: "必填",
        },
    },
}

const inputs = document.querySelectorAll("input[type=text], input[type=tel], input[type=email]");
const orderInfoBtn = document.querySelector('.orderInfo-btn');
function validateForm() {
    inputs.forEach((item) => {
        item.addEventListener('change', () => {
            item.nextElementSibling.textContent = '';
            let errors = validate(form, constraints);
            if (errors) {
                Object.keys(errors).forEach((keys) => {
                    document.querySelector(`[data-message="${keys}"]`).textContent = errors[keys];
                });
                orderInfoBtn.classList.add('disabled');
            } else {
                orderInfoBtn.classList.remove('disabled');
            }
        })
    });
    orderInfoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (cartsData.length === 0) {
            Swal.fire({
                title: "購物車是空的",
                text: "請添加品項至購物車",
                icon: "warning"
            });
            return;
        }
        getValues(e);
        postOrders();
    })
}
validateForm();

// util js
function toThousands(x) {
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}