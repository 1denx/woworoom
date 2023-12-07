import{a as o}from"./config-c0cddb1e.js";function C(){v(),c()}C();let s=[];function v(){axios.get(`${o}/products`).then(t=>{s=t.data.products,u(s),$()}).catch(t=>{console.log(t)})}const f=document.querySelector(".productWrap");function u(t){let e="";t.forEach(r=>{e+=`<li class="productCard">
        <h4 class="productType">新品</h4>
        <img
          src="${r.images}"
          alt=""
        />
        <a href="#" class="addCardBtn" data-id="${r.id}">加入購物車</a>
        <h3>${r.title}</h3>
        <del class="originPrice">NT$${n(r.origin_price)}</del>
        <p class="nowPrice">NT$${n(r.price)}</p>
      </li>`}),f.innerHTML=e}const p=document.querySelector(".productSelect");function $(){const t=s.map(r=>r.category),e=t.filter((r,a)=>t.indexOf(r)===a);y(e)}function y(t){let e='<option value="全部" selected>全部</option>';t.forEach(r=>{e+=`<option value="${r}" selected>${r}</option>`}),p.innerHTML=e}p.addEventListener("change",t=>{const e=t.target.value;if(e==="全部"){u(s);return}else{const r=s.filter(a=>a.category===e);u(r)}});let i=[];function c(){axios.get(`${o}/carts`).then(t=>{document.querySelector(".js-total").textContent=n(t.data.finalTotal),i=t.data.carts,S(i)}).catch(t=>{console.log(t)})}const g=document.querySelector(".shoppingCart-tableList");function S(t){let e="";t.forEach(r=>{e+=`<tr>
                    <td>
                        <div class="cardItem-title">
                            <img src="${r.product.images}" alt="">
                            <p>${r.product.title}</p>
                        </div>
                    </td>
                    <td>${n(r.product.price)}</td>
                    <td>${n(r.quantity)}</td>
                    <td>${n(r.product.price*r.quantity)}</td>
                    <td class="discardBtn">
                        <a href="#" class="material-icons" data-id="${r.id}">clear</a>
                    </td>
                </tr>`}),g.innerHTML=e}f.addEventListener("click",t=>{if(t.preventDefault(),!t.target.classList.contains("addCardBtn"))return;let r=t.target.getAttribute("data-id"),a=1;i.forEach(l=>{l.product.id===r&&(a=l.quantity+=1)}),axios.post(`${o}/carts`,{data:{productId:r,quantity:a}}).then(l=>{Swal.fire({showConfirmButton:!1,title:"已加入購物車",icon:"success",timer:1500}),c()})});g.addEventListener("click",t=>{t.preventDefault();const e=t.target.getAttribute("data-id");e!=null&&axios.delete(`${o}/carts/${e}`).then(r=>{Swal.fire({showConfirmButton:!1,title:"已將該品項刪除",icon:"success",timer:1500}),c()})});const L=document.querySelector(".discardAllBtn");L.addEventListener("click",t=>{t.preventDefault(),t.target!=null&&axios.delete(`${o}/carts`).then(r=>{Swal.fire({title:"確定要清空購物車嗎?",text:"一但清除將無法復原!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"確定!"}).then(a=>{a.isConfirmed&&Swal.fire({title:"刪除成功!",text:"購物車已清空",icon:"success"}),c()})}).catch(r=>{Swal.fire({showConfirmButton:!1,title:"購物車內沒有任何品項",icon:"error",timer:1500})})});let m={};function x(t){const e=t.target.form;m={name:e.姓名.value,tel:e.手機.value,email:e.Email.value,address:e.寄送地址.value,payment:e.交易方式.value}}const h=document.querySelector(".orderInfo-form");function w(){axios.post(`${o}/orders`,{data:{user:m}}).then(t=>{c(),Swal.fire({showConfirmButton:!1,title:"訂單建立成功",icon:"success",timer:1500}),h.reset()}).catch(t=>{console.log(t)})}const B=/^09\d{8}$/,E={姓名:{presence:{message:"必填"}},手機:{presence:{message:"必填"},format:{pattern:B,message:"格式不符"}},Email:{presence:{message:"必填"},email:{message:"格式不符"}},寄送地址:{presence:{message:"必填"}}},q=document.querySelectorAll("input[type=text], input[type=tel], input[type=email]"),d=document.querySelector(".orderInfo-btn");function D(){q.forEach(t=>{t.addEventListener("change",()=>{t.nextElementSibling.textContent="";let e=validate(h,E);e?(Object.keys(e).forEach(r=>{document.querySelector(`[data-message="${r}"]`).textContent=e[r]}),d.classList.add("disabled")):d.classList.remove("disabled")})}),d.addEventListener("click",t=>{if(t.preventDefault(),i.length===0){Swal.fire({title:"購物車是空的",text:"請添加品項至購物車",icon:"warning"});return}x(t),w()})}D();function n(t){let e=t.toString().split(".");return e[0]=e[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),e.join(".")}
