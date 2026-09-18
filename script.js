const products=[
{id:1,name:"Classic Linen Shirt",cat:"Men",price:1299,img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",sizes:["S","M","L","XL"],colors:["White","Blue"]},
{id:2,name:"Satin Midi Dress",cat:"Women",price:1899,img:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=80",sizes:["S","M","L"],colors:["Black","Pink"]},
{id:3,name:"Urban Sneakers",cat:"Shoes",price:2499,img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",sizes:["6","7","8","9"],colors:["Red","White"]},
{id:4,name:"Minimal Handbag",cat:"Accessories",price:1599,img:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",sizes:["One Size"],colors:["Brown","Black"]},
{id:5,name:"Relaxed Denim",cat:"Men",price:1799,img:"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",sizes:["30","32","34","36"],colors:["Blue","Black"]},
{id:6,name:"Everyday Top",cat:"Women",price:999,img:"https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=80",sizes:["S","M","L","XL"],colors:["White","Green"]},
{id:7,name:"Classic Watch",cat:"Accessories",price:2199,img:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=80",sizes:["One Size"],colors:["Silver","Black"]},
{id:8,name:"Street Runner",cat:"Shoes",price:2299,img:"https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=80",sizes:["6","7","8","9"],colors:["Black","White"]}
];

let cart=JSON.parse(localStorage.getItem("cart")||"[]");
let wishlist=JSON.parse(localStorage.getItem("wishlist")||"[]");
let current=products.slice();

function money(n){return "₹"+n.toLocaleString("en-IN")}
function save(){localStorage.setItem("cart",JSON.stringify(cart));localStorage.setItem("wishlist",JSON.stringify(wishlist));updateCounts();renderCart();renderWishlist()}
function updateCounts(){document.getElementById("cartCount").textContent=cart.reduce((a,b)=>a+b.qty,0);document.getElementById("wishCount").textContent=wishlist.length}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.style.display="block";setTimeout(()=>t.style.display="none",1800)}
function renderProducts(){
 const grid=document.getElementById("productGrid");
 grid.innerHTML=current.map(p=>`<article class="card">
 <button class="heart" onclick="toggleWish(${p.id})">${wishlist.includes(p.id)?"♥":"♡"}</button>
 <img class="card-img" src="${p.img}" alt="${p.name}">
 <div class="card-info"><span class="tag">${p.cat}</span><h3>${p.name}</h3><div class="price">${money(p.price)}</div>
 <div class="variants"><span class="tag">Size</span>${p.sizes.map((s,i)=>`<button id="s-${p.id}-${i}" onclick="selectVariant(${p.id},'size','${s}',this)">${s}</button>`).join("")}</div>
 <div class="variants"><span class="tag">Color</span>${p.colors.map((c,i)=>`<button id="c-${p.id}-${i}" onclick="selectVariant(${p.id},'color','${c}',this)">${c}</button>`).join("")}</div>
 <button class="add" onclick="addCart(${p.id})">Add to Cart</button></div></article>`).join("");
}
const selected={};
function selectVariant(id,type,value,el){selected[id]??={};selected[id][type]=value;el.parentElement.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));el.classList.add("selected")}
function addCart(id){
 const p=products.find(x=>x.id===id);selected[id]??={};
 const size=selected[id].size||p.sizes[0],color=selected[id].color||p.colors[0];
 const key=`${id}-${size}-${color}`;let item=cart.find(x=>x.key===key);
 if(item)item.qty++;else cart.push({key,id,size,color,qty:1});
 toast("Added to cart");save();
}
function toggleWish(id){wishlist.includes(id)?wishlist=wishlist.filter(x=>x!==id):(wishlist.push(id),toast("Added to wishlist"));save();renderProducts()}
function renderWishlist(){
 const el=document.getElementById("wishlistGrid");
 if(!wishlist.length){el.innerHTML='<div class="empty">Your wishlist is empty.</div>';return}
 el.innerHTML=wishlist.map(id=>products.find(p=>p.id===id)).map(p=>`<div class="mini-card"><img src="${p.img}" alt="${p.name}"><h3>${p.name}</h3><p>${money(p.price)}</p><button class="add" onclick="addCart(${p.id})">Add to Cart</button></div>`).join("");
}
function renderCart(){
 const el=document.getElementById("cartContent");
 if(!cart.length){el.innerHTML='<div class="empty">Your cart is empty. <a href="#products">Start shopping</a></div>';document.getElementById("checkout").classList.add("hidden");return}
 const subtotal=cart.reduce((a,i)=>a+products.find(p=>p.id===i.id).price*i.qty,0),shipping=subtotal>=2000?0:99,total=subtotal+shipping;
 el.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-row"><img src="${p.img}" alt="${p.name}"><div><b>${p.name}</b><p>${money(p.price)} • Size: ${i.size} • ${i.color}</p></div><div class="qty"><button onclick="changeQty('${i.key}',-1)">−</button>${i.qty}<button onclick="changeQty('${i.key}',1)">+</button></div><b>${money(p.price*i.qty)}</b><button class="remove" onclick="removeCart('${i.key}')">Remove</button></div>`}).join("")+
 `<div class="cart-total"><p>Subtotal <b>${money(subtotal)}</b></p><p>Shipping <b>${shipping?money(shipping):"FREE"}</b></p><hr><p>Grand Total <b>${money(total)}</b></p><button class="add" onclick="showCheckout(${subtotal},${shipping},${total})">Proceed to Checkout</button></div>`;
}
function changeQty(key,n){const x=cart.find(i=>i.key===key);x.qty+=n;if(x.qty<1)cart=cart.filter(i=>i.key!==key);save()}
function removeCart(key){cart=cart.filter(i=>i.key!==key);save();toast("Item removed")}
function showCheckout(sub,ship,total){document.getElementById("checkout").classList.remove("hidden");document.getElementById("checkoutSummary").innerHTML=`<h3>Order Summary</h3><br><p>Subtotal: <b>${money(sub)}</b></p><p>Shipping: <b>${ship?money(ship):"FREE"}</b></p><hr><br><h3>Total: ${money(total)}</h3>`;document.getElementById("checkout").scrollIntoView({behavior:"smooth"})}
function placeOrder(e){e.preventDefault();const id="FS"+Date.now().toString().slice(-6);document.getElementById("checkout").innerHTML=`<div class="summary"><h2>✓ Order Placed Successfully!</h2><br><p>Order ID: <b>#${id}</b></p><p>Thank you for shopping with StyleHub.</p><br><a class="btn" href="#products">Continue Shopping</a></div>`;cart=[];save()}
function filterCategory(cat){current=cat==="All"?products.slice():products.filter(p=>p.cat===cat);renderProducts();document.getElementById("products").scrollIntoView({behavior:"smooth"})}
function sortProducts(v){if(v==="low")current.sort((a,b)=>a.price-b.price);else if(v==="high")current.sort((a,b)=>b.price-a.price);else current=products.slice();renderProducts()}
function toggleMenu(){const n=document.querySelector(".header nav");n.style.display=n.style.display==="flex"?"none":"flex"}
renderProducts();renderWishlist();renderCart();updateCounts();