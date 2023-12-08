import{b as i,t as l}from"./config-c0cddb1e.js";function f(){d()}f();const h=document.querySelector(".js-orderList");let c=[];function d(){axios.get(`${i}/orders`,{headers:{Authorization:l}}).then(t=>{c=t.data.orders,p(c)}).catch(t=>{console.log(t)})}d();function p(t){let r="";t.forEach(e=>{const s=new Date(e.createdAt*1e3),n=`${s.getFullYear()}/${s.getMonth()+1}/${s.getDate()}`;let o="";e.products.forEach(u=>{o+=`<p>${u.title}*${u.quantity}</p>`});let a="";e.paid==!0?a="已處理":a="未處理",r+=`<tr>
        <td>${e.id}</td>
        <td>
          <p>${e.user.name}</p>
          <p>${e.user.tel}</p>
        </td>
        <td>${e.user.address}</td>
        <td>${e.user.email}</td>
        <td>
          ${o}
        </td>
        <td>${n}</td>
        <td class="orderStatus">
          <a href="#" data-status="${e.paid}" data-id="${e.id}" class="js-orderStatus">${a}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn js-orderDele" data-id="${e.id}" value="刪除" />
        </td>
      </tr>`}),h.innerHTML=r,S()}h.addEventListener("click",t=>{t.preventDefault();const r=t.target.classList;let e=t.target.getAttribute("data-id");if(r.contains("js-orderDele")){g(e);return}else if(r.contains("js-orderStatus")){let s=t.target.getAttribute("data-status");$(s,e);return}});function $(t,r){let e;t&&(e=!0),axios.put(`${i}/orders`,{data:{id:r,paid:e}},{headers:{Authorization:l}}).then(s=>{Swal.fire({showConfirmButton:!1,title:"修改狀態成功",icon:"success",timer:1500}),d()}).catch(s=>{console.log(s)})}function g(t){axios.delete(`${i}/orders/${t}`,{headers:{Authorization:l}}).then(r=>{Swal.fire({showConfirmButton:!1,title:"刪除該筆訂單成功",icon:"success",timer:1500}),d()}).catch(r=>{console.log(r)})}function S(){let t={};c.forEach(o=>{o.products.forEach(a=>{t[a.title]==null?t[a.title]=a.price*a.quantity:t[a.title]+=a.price*a.quantity})});let r=[];Object.keys(t).forEach(o=>{let a=[];a.push(o),a.push(t[o]),r.push(a)}),r.sort((o,a)=>a[1]-o[1]);let s=[],n=["其他",0];r.forEach((o,a)=>{a<3?s.push(o):n[1]+=o[1]}),s.push(n),D(s)}function D(t){let r=["#301E5F","#5434A7","#9D7FEA","#DACBFF"],e={};t.forEach((s,n)=>{e[s[0]]=r[n]}),c3.generate({bindto:"#chart",data:{type:"pie",columns:t,colors:e}})}const A=document.querySelector(".discardAllBtn");A.addEventListener("click",t=>{t.preventDefault(),axios.delete(`${i}/orders`,{headers:{Authorization:l}}).then(r=>{Swal.fire({showConfirmButton:!1,title:"已刪除全部訂單",icon:"success",timer:1500}),d()}).catch(r=>{console.log(r)})});
