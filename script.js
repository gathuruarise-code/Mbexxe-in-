<script>
    // Replace these sample menu items and prices with MBEXXE's actual menu before publishing.
    const menuItems = [
      {id:1,name:"Classic Beef Burger",category:"Burgers",price:350,description:"A tasty burger with beef, fresh toppings and sauce.",image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"},
      {id:2,name:"Cheese Burger",category:"Burgers",price:450,description:"A beef burger layered with melted cheese.",image:"https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=700&q=80"},
      {id:3,name:"Chicken Burger",category:"Burgers",price:400,description:"A flavourful chicken burger with fresh toppings.",image:"https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=700&q=80"},
      {id:4,name:"Chips / Fries",category:"Fast Food",price:150,description:"Golden, crispy fries for a quick snack.",image:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80"},
      {id:5,name:"Hot Dog",category:"Fast Food",price:250,description:"A warm hot dog with your favourite sauces.",image:"https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=700&q=80"},
      {id:6,name:"Chicken & Chips",category:"Fast Food",price:550,description:"A satisfying meal with chicken and crispy fries.",image:"https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=700&q=80"},
      {id:7,name:"Soda",category:"Drinks",price:80,description:"A chilled soft drink to go with your meal.",image:"https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=700&q=80"},
      {id:8,name:"Fresh Juice",category:"Drinks",price:180,description:"A refreshing drink for your day.",image:"https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=700&q=80"},
      {id:9,name:"Water",category:"Drinks",price:60,description:"A simple, refreshing bottle of water.",image:"https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=700&q=80"}
    ];
    const cart = new Map();
    let activeCategory = "All";
    const money = amount => "KSh " + amount.toLocaleString("en-KE");
    const menuGrid = document.getElementById("menuGrid");
    const toast = document.getElementById("toast");
    let toastTimer;
    function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200)}
    function renderMenu(){
      const query=document.getElementById("menuSearch").value.trim().toLowerCase();
      const filtered=menuItems.filter(item=>(activeCategory==="All"||item.category===activeCategory)&&(item.name+" "+item.description+" "+item.category).toLowerCase().includes(query));
      if(!filtered.length){menuGrid.innerHTML='<div class="empty-state">No items found. Try another search.</div>';return}
      menuGrid.innerHTML=filtered.map(item=>`<article class="food-card"><img loading="lazy" src="${item.image}" alt="${item.name}" onerror="this.style.display='none'"><div class="food-info"><h3>${item.name}</h3><p>${item.description}</p><div class="food-bottom"><span class="price">${money(item.price)}</span><button class="add-btn" data-add="${item.id}">+ Add</button></div></div></article>`).join("");
    }
    function renderCart(){
      const items=[...cart.entries()];
      document.getElementById("cartCount").textContent=items.reduce((sum,[,qty])=>sum+qty,0);
      document.getElementById("cartItems").innerHTML=items.length?items.map(([id,qty])=>{const item=menuItems.find(x=>x.id===id);return `<div class="cart-line"><div><strong>${item.name}</strong><small>${money(item.price)} each</small><div class="qty"><button data-qty="${id}" data-change="-1" aria-label="Remove one ${item.name}">−</button><span>${qty}</span><button data-qty="${id}" data-change="1" aria-label="Add one ${item.name}">+</button></div></div><strong>${money(item.price*qty)}</strong></div>`}).join(""):'<div class="empty-state">Your cart is empty. Add something tasty from the menu.</div>';
      const total=items.reduce((sum,[id,qty])=>sum+menuItems.find(x=>x.id===id).price*qty,0);
      document.getElementById("cartTotal").textContent=money(total);
    }
    function changeQty(id,delta){const next=(cart.get(id)||0)+delta;if(next<=0)cart.delete(id);else cart.set(id,next);renderCart()}
    function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("show");document.getElementById("cartDrawer").setAttribute("aria-hidden","false")}
    function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("show");document.getElementById("cartDrawer").setAttribute("aria-hidden","true")}
    menuGrid.addEventListener("click",e=>{const btn=e.target.closest("[data-add]");if(!btn)return;changeQty(Number(btn.dataset.add),1);showToast("Added to your order")});
    document.getElementById("cartItems").addEventListener("click",e=>{const btn=e.target.closest("[data-qty]");if(btn)changeQty(Number(btn.dataset.qty),Number(btn.dataset.change))});
    document.getElementById("menuSearch").addEventListener("input",renderMenu);
    document.getElementById("filters").addEventListener("click",e=>{const btn=e.target.closest("[data-category]");if(!btn)return;activeCategory=btn.dataset.category;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===btn));renderMenu()});
    document.getElementById("openCart").addEventListener("click",openCart);
    document.getElementById("closeCart").addEventListener("click",closeCart);
    document.getElementById("overlay").addEventListener("click",closeCart);
    document.getElementById("clearCart").addEventListener("click",()=>{cart.clear();renderCart();showToast("Cart cleared")});
    document.getElementById("checkout").addEventListener("click",()=>{
      if(!cart.size){showToast("Add at least one item first");return}
      const lines=[...cart.entries()].map(([id,qty])=>{const item=menuItems.find(x=>x.id===id);return `• ${item.name} x${qty} — ${money(item.price*qty)}`});
      const total=[...cart.entries()].reduce((sum,[id,qty])=>sum+menuItems.find(x=>x.id===id).price*qty,0);
      const message=`Hello MBEXXE! I'd like to enquire about this order:\n\n${lines.join("\n")}\n\nEstimated total: ${money(total)}\nPlease confirm availability, actual prices and collection/delivery options.`;
      window.open("https://wa.me/254705416934?text="+encodeURIComponent(message),"_blank","noopener");
    });
    document.getElementById("menuToggle").addEventListener("click",()=>{const links=document.getElementById("navlinks");const open=links.classList.toggle("open");document.getElementById("menuToggle").setAttribute("aria-expanded",String(open))});
    document.querySelectorAll("#navlinks a").forEach(a=>a.addEventListener("click",()=>{document.getElementById("navlinks").classList.remove("open");document.getElementById("menuToggle").setAttribute("aria-expanded","false")}));
    document.getElementById("year").textContent=new Date().getFullYear();
    renderMenu();renderCart();
  </script>
