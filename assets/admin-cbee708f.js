import{b as n,t as d}from"./config-c0cddb1e.js";function h(){o()}h();const f=document.querySelector(".js-orderList");let l=[];function o(){axios.get(`${n}/orders`,{headers:{Authorization:d}}).then(t=>{l=t.data.orders,g(l)}).catch(t=>{console.log(t)})}o();function g(t){let r="";t.forEach(e=>{const a=new Date(e.createdAt*1e3),s=`${a.getFullYear()}/${a.getMonth()+1}/${a.getDate()}`;let c="";e.products.forEach(u=>{c+=`<p>${u.title}*${u.quantity}</p>`});let i="";e.paid==!0?i="已處理":i="未處理",r+=`<tr>
        <td>${e.id}</td>
        <td>
          <p>${e.user.name}</p>
          <p>${e.user.tel}</p>
        </td>
        <td>${e.user.address}</td>
        <td>${e.user.email}</td>
        <td>
          ${c}
        </td>
        <td>${s}</td>
        <td class="orderStatus">
          <a href="#" data-status="${e.paid}" data-id="${e.id}" class="js-orderStatus">${i}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn js-orderDele" data-id="${e.id}" value="刪除" />
        </td>
      </tr>`}),f.innerHTML=r,y()}f.addEventListener("click",t=>{t.preventDefault();const r=t.target.classList;let e=t.target.getAttribute("data-id");if(r.contains("js-orderDele")){p(e);return}else if(r.contains("js-orderStatus")){let a=t.target.getAttribute("data-status");$(a,e);return}});function $(t,r){let e;t&&(e=!0),axios.put(`${n}/orders`,{data:{id:r,paid:e}},{headers:{Authorization:d}}).then(a=>{Swal.fire({showConfirmButton:!1,title:"修改狀態成功",icon:"success",timer:1500}),o()}).catch(a=>{console.log(a)})}function p(t){axios.delete(`${n}/orders/${t}`,{headers:{Authorization:d}}).then(r=>{Swal.fire({showConfirmButton:!1,title:"刪除該筆訂單成功",icon:"success",timer:1500}),o()}).catch(r=>{console.log(r)})}function y(){let t={};l.forEach(a=>{a.products.forEach(s=>{t[s.category]==null?t[s.category]=s.price*s.quantity:t[s.category]+=s.price*s.quantity})});let r=Object.keys(t),e=[];r.forEach(a=>{let s=[];s.push(a),s.push(t[a]),e.push(s)}),c3.generate({bindto:"#chart",data:{type:"pie",columns:e}})}const S=document.querySelector(".discardAllBtn");S.addEventListener("click",t=>{t.preventDefault(),axios.delete(`${n}/orders`,{headers:{Authorization:d}}).then(r=>{Swal.fire({showConfirmButton:!1,title:"已刪除全部訂單",icon:"success",timer:1500}),o()}).catch(r=>{console.log(r)})});
