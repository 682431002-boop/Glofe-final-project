// ======================================================
// GLOFE PRODUCTS
// ======================================================

const PRODUCTS = [

  // 🇰🇷 KOREA
  {
    id:1,
    name:'Carlyn Flower Cozy H75142010',
    country:'Korea',
    flag:'🇰🇷',
    image:'assets/images/carlyn2.jpg',
    price:2300,
    deadline:'15 Oct 2026',
    tags:['Bags','Fashion'],
    desc:'· The Cozy Bag features a feminine floral pattern and a lightweight feel for effortless everyday wear Designed to contour comfortably to the body for a secure and balanced fitCARLYN’s signature round stopper allows the strap to be freely adjusted to your desired shape and length Versatile 4-way styling: tote, shoulder, crossbody, or sling Detailed with a side zip pocket for organized storage, along with an additional interior zip pocket for added security',
   
  },

  {
    id:2,
    name:'Stand Oil Day Backpack / Brown',
    country:'Korea',
    flag:'🇰🇷',
    image:'assets/images/stand.jpg',
    price:4000,
    deadline:'18 Oct 2026',
    tags:['Bags'],
    desc:'A versatile everyday backpack with lightweight vegan leather.'
  },

  {
    id:3,
    name:'Carlyn Lovey heart keyring J76323010',
    country:'Korea',
    flag:'🇰🇷',
    image:'assets/images/คาร์ลีน.jpg',
    price:1000,
    deadline:'19 Oct 2026',
    tags:['Accessory','Bags'],
    desc:'With fluffy quilting heart and bowknot details Lovie Heart Keyring capturing a lovely mood. Voluminous heart shape finished with signature quilting. Soft and lightweight fabric material. Bowknot detail added to the heart. Designs that add a pop of color to the bag. Easy attachment and detachment via Carlin heart carabiner.'
  },

  {
    id:4,
    name:'CAP MARDI BOLD LOGO_BROWN CREAM',
    country:'Korea',
    flag:'🇰🇷',
    image:'assets/images/gap.jpg',
    price:1350,
    deadline:'21 Oct 2026',
    tags:['Clothing','Fashion'],
    desc:'Signature floral graphic pullover in relaxed fit.',
    sizes:['S','M','L','XL']
  },


  // 🇯🇵 JAPAN
  {
    id:5,
    name:'HYDRO FLASK ALL AROUND TUMBLERS 20 OZ CLOUD PINK',
    country:'Japan',
    flag:'🇯🇵',
    image:'assets/images/กระติก.jpg',
    price:1500,
    deadline:'20 Oct 2026',
    tags:['Lifestyle','Home'],
    desc:'A stylish reusable tumbler designed for everyday use.'
  },

  {
    id:6,
    name:'GU Tiered Flared Skirt',
    country:'Japan',
    flag:'🇯🇵',
    image:'assets/images/gu3.jpg',
    price:700,
    deadline:'22 Oct 2026',
    tags:['Clothing','Fashion'],
    desc:'A lightweight tiered flared skirt with a soft, flowing silhouette.',
    sizes:['S','M','L','XL']
  },

  {
    id:7,
    name:'Onitsuka Tiger MEXICO 66 SD VIN',
    country:'Japan',
    flag:'🇯🇵',
    image:'assets/images/Japan1.jpg',
    price:6200,
    deadline:'24 Oct 2026',
    tags:['Shoes','Fashion'],
    desc:'Classic Onitsuka Tiger sneakers with a clean retro design, comfortable fit, and iconic Japanese style.',
    sizes:['36','37','38','39','40','41']
  },

  {
    id:8,
    name:'SHISEIDO MEN Energizing Moisturizer Extra Light Fluid',
    country:'Japan',
    flag:'🇯🇵',
    image:'assets/images/j2.jpg',
    price:1550,
    deadline:'27 Oct 2026',
    tags:['Beauty','Skincare'],
    desc:'A lightweight emulsion which invigorates skin through the power of hydration.'
  },


  // 🇨🇳 CHINA
  {
    id:9,
    name:'Baseus Picogo Air AM71 3C Magnetic Power Bank 5000mAh 22.5W',
    country:'China',
    flag:'🇨🇳',
    image:'assets/images/base.jpg',
    price:2400,
    deadline:'17 Oct 2026',
    tags:['Tech'],
    desc:'Baseus Picogo Air AM71 Magnetic Power Bank 5000mAh 22.5W features a remarkably slim 0.2-inch profile with 22.5W fast charging CCC certification, and advanced cooling technology. Its built-in NFC PowerSense enables seamless device pairing and real-time monitoring via the dedicated APP.'
  },

  {
    id:10,
    name:'Moromoro VINTAGE SHEEPSKIN JACKET',
    country:'China',
    flag:'🇨🇳',
    image:'assets/images/mo.jpg',
    price:4000,
    deadline:'25 Oct 2026',
    tags:['Clothing','Fashion'],
    desc:'Vintage sheepskin jacket designed for cozy warmth and style.',
    sizes:['S','M','L','XL']
  },

  {
    id:11,
    name:'DJI Flip',
    country:'China',
    flag:'🇨🇳',
    image:'assets/images/drone.jpg',
    price:10500,
    deadline:'23 Oct 2026',
    tags:['Tech'],
    desc:'Foldable Full-Coverage Propeller Guard. Under 249 g. Subject Tracking. Capture Your Best Angle. 1/1.3-inch CMOS Sensor. 4K/60fps HDR Video. 31-Min Max Flight Time.'
  },

  {
    id:12,
    name:'MUVA Mini Cotton Candy-MU1071 Handbag / Shoulder Bag with Crossbody Strap',
    country:'China',
    flag:'🇨🇳',
    image:'assets/images/muva.jpg',
    price:2400,
    deadline:'28 Oct 2026',
    tags:['Bags','Fashion'],
    desc:'MUVA MINI COTTON CANDY Handbag. A minimalist handbag made from high-quality polyester fibers, offering a lightweight, strong, and durable design. It features a convenient magnetic snap closure and an elegant, simple style that is perfect for everyday use or special occasions. Compact yet spacious enough for your essentials, it adds a stylish touch to any look.'
  },


  // 🇺🇸 USA
  {
    id:13,
    name:'FEAR OF GOD ESSENTIALS',
    country:'USA',
    flag:'🇺🇸',
    image:'assets/images/เอส.jpg',
    price:3900,
    deadline:'12 Oct 2026',
    tags:['Fashion','Shoes'],
    desc:'Minimal everyday fashion piece with a modern streetwear style.',
    sizes:['S','M','L','XL']
  },

  {
    id:14,
    name:'Beats Studio Pro Wireless Headphones',
    country:'USA',
    flag:'🇺🇸',
    image:'assets/images/Wireless.jpg',
    price:4200,
    deadline:'26 Oct 2026',
    tags:['Tech','Lifestyle'],
    desc:'Noise cancelling wireless headphones with spatial audio.'
  },

  {
    id:15,
    name:'Crocs classic Chocolate',
    country:'USA',
    flag:'🇺🇸',
    image:'assets/images/crocs2.jpg',
    price:2250,
    deadline:'29 Oct 2026',
    tags:['Shoes'],
    desc:'Classic Crocs with a comfortable everyday design.',
    sizes:['36','37','38','39','40','41']
  },

  {
    id:16,
    name:'kate spade NEW YORK Protective Case Mag iPhone 17 Pro Max - Autumn Tolie',
    country:'USA',
    flag:'🇺🇸',
    image:'assets/images/เคส.jpg',
    price:2000,
    deadline:'30 Oct 2026',
    tags:['Accessory'],
    desc:'Stylish protective case designed for iPhone 17 Pro Max.'
  }

];


// ======================================================
// BASIC FUNCTIONS
// ======================================================

const money = n => '฿' + Number(n).toLocaleString('en-US');

const get = (k, d) =>
  JSON.parse(localStorage.getItem(k) || JSON.stringify(d));

const set = (k, v) =>
  localStorage.setItem(k, JSON.stringify(v));

const cart = () =>
  get('glofe_cart', []);

const wishes = () =>
  get('glofe_wishlist', []);

const user = () =>
  get('glofe_user', null);

const orders = () =>
  get('glofe_orders', []);


// ======================================================
// TOAST
// ======================================================

const toast = msg => {

  const e = document.getElementById('toast');

  if(!e) return;

  e.textContent = msg;

  e.classList.add('show');

  clearTimeout(window._toast);

  window._toast = setTimeout(() => {
    e.classList.remove('show');
  }, 2200);

};


// ======================================================
// CART COUNT
// ======================================================

function countCart() {

  return cart().reduce((a, x) => a + x.qty, 0);

}


function updateCount() {

  const e = document.getElementById('cartCount');

  if(e) {
    e.textContent = countCart();
  }

}


// ======================================================
// ADD TO CART
// ======================================================

function addCart(id, qty = 1, size = null) {

  let c = cart();

  // สินค้าเดียวกัน + ไซซ์เดียวกัน = รวมจำนวน
  const x = c.find(v =>
    v.id === id &&
    v.size === size
  );

  if(x) {

    x.qty += qty;

  } else {

    c.push({
      id,
      qty,
      size
    });

  }

  set('glofe_cart', c);

  updateCount();

  toast('Added to cart');

}


// ======================================================
// REMOVE CART
// ======================================================

function removeCart(index) {

  let c = cart();

  c.splice(index, 1);

  set('glofe_cart', c);

  updateCount();

}


// ======================================================
// CHANGE CART QUANTITY
// ======================================================

function changeQty(index, delta) {

  let c = cart();

  const x = c[index];

  if(!x) return;

  x.qty += delta;

  if(x.qty < 1) {

    c.splice(index, 1);

  }

  set('glofe_cart', c);

  updateCount();

}


// ======================================================
// TOTAL
// ======================================================

function total() {

  return cart().reduce((s, x) => {

    const p = PRODUCTS.find(p => p.id === x.id);

    return s + (p?.price || 0) * x.qty;

  }, 0);

}


// ======================================================
// WISHLIST
// ======================================================

function toggleWish(id) {

  let w = wishes();

  if(w.includes(id)) {

    w = w.filter(x => x !== id);

  } else {

    w.push(id);

  }

  set('glofe_wishlist', w);

  return w.includes(id);

}


// ======================================================
// LOGIN CHECK
// ======================================================

function requireLogin() {

  if(!user()) {

    toast('Please log in before proceeding to checkout');

    document.getElementById('loginOpen')?.click();

    return false;

  }

  return true;

}


// ======================================================
// HEADER
// ======================================================

function initHeader() {

  updateCount();

  const c = document.getElementById('countrySelect');

  if(c) {

    c.value =
      localStorage.getItem('glofe_country') || 'KR';

    c.onchange = () => {

      localStorage.setItem(
        'glofe_country',
        c.value
      );

    };

  }

  document
    .getElementById('mobileMenu')
    ?.addEventListener('click', () => {

      document
        .getElementById('siteNav')
        ?.classList.toggle('open');

    });

}
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();

  const message = {
    name: document.getElementById('contactName').value.trim(),
    email: document.getElementById('contactEmail').value.trim(),
    subject: document.getElementById('contactSubject').value.trim(),
    message: document.getElementById('contactMessage').value.trim(),
    date: new Date().toLocaleString()
  };

  const messages = JSON.parse(
    localStorage.getItem('glofe_messages') || '[]'
  );

  messages.push(message);

  localStorage.setItem(
    'glofe_messages',
    JSON.stringify(messages)
  );

  document.getElementById('contactSuccess').style.display = 'block';

  this.reset();
});

// ======================================================
// AUTH
// ======================================================

function initAuth() {

  const modal =
    document.getElementById('authModal');

  if(!modal) return;


  const open = mode => {

    modal.classList.remove('hidden');

    document
      .getElementById('loginForm')
      ?.classList.toggle(
        'hidden',
        mode !== 'login'
      );

    document
      .getElementById('signupForm')
      ?.classList.toggle(
        'hidden',
        mode !== 'signup'
      );

    document
      .getElementById('tabLogin')
      ?.classList.toggle(
        'active',
        mode === 'login'
      );

    document
      .getElementById('tabSignup')
      ?.classList.toggle(
        'active',
        mode === 'signup'
      );

  };


  document
    .getElementById('loginOpen')
    ?.addEventListener(
      'click',
      () => open('login')
    );


  document
    .getElementById('signupOpen')
    ?.addEventListener(
      'click',
      () => open('signup')
    );


  modal
    .querySelectorAll('[data-close]')
    .forEach(x => {

      x.onclick = () =>
        modal.classList.add('hidden');

    });


  document
    .getElementById('tabLogin')
    ?.addEventListener(
      'click',
      () => open('login')
    );


  document
    .getElementById('tabSignup')
    ?.addEventListener(
      'click',
      () => open('signup')
    );


  // SIGN UP
  document
    .getElementById('signupForm')
    ?.addEventListener('submit', e => {

      e.preventDefault();

      let a =
        get('glofe_accounts', []);

      const email =
        signupEmail.value
          .trim()
          .toLowerCase();

      if(
        a.some(x => x.email === email)
      ) {

        return toast(
          'Email already registered'
        );

      }

      if(
        signupPassword.value !==
        signupConfirm.value
      ) {

        return toast(
          'Passwords do not match'
        );

      }

      a.push({

        name:
          signupName.value.trim(),

        email,

        password:
          signupPassword.value

      });

      set('glofe_accounts', a);

      set('glofe_user', {

        name:
          signupName.value.trim(),

        email

      });

      modal.classList.add('hidden');

      toast('Welcome to GloFe');

      location.reload();

    });


  // LOGIN
  document
    .getElementById('loginForm')
    ?.addEventListener('submit', e => {

      e.preventDefault();

      let a =
        get('glofe_accounts', []);

      const email =
        loginEmail.value
          .trim()
          .toLowerCase();

      const p =
        loginPassword.value;

      const x =
        a.find(v =>
          v.email === email &&
          v.password === p
        );

      if(!x) {

        return toast(
          'Email or password is incorrect'
        );

      }

      set('glofe_user', {

        name: x.name,

        email: x.email

      });

      modal.classList.add('hidden');

      toast('Welcome back');

      location.reload();

    });

}


// ======================================================
// PRODUCT CARD
// ======================================================

function card(p) {

  const wished =
    wishes().includes(p.id);

  return `

    <article class="product-card">

      <a
        href="product.html?id=${p.id}"
        class="product-image"
      >

        <img
          src="${p.image}"
          alt="${p.name}"
        >

        <span class="country-tag">
          ${p.flag} ${p.country}
        </span>

      </a>


      <div class="product-body">

        <div class="meta">

          <span>
            ${p.tags[0]}
          </span>

          <button
            class="wish"
            data-wish="${p.id}"
          >
            ${wished ? '♥' : '♡'}
          </button>

        </div>


        <a href="product.html?id=${p.id}">

          <h3>
            ${p.name}
          </h3>

        </a>


        <b class="product-price">
          ${money(p.price)}
        </b>


        <small>
          Pre-order closes ${p.deadline}
        </small>


        <div class="card-actions">

          <a
            class="btn ghost"
            href="product.html?id=${p.id}"
          >
            View
          </a>


          <button
            class="btn dark"
            data-add="${p.id}"
          >
            Add
          </button>

        </div>

      </div>

    </article>

  `;

}


// ======================================================
// HOME
// ======================================================

function renderHome() {

  const grid =
    document.getElementById('productGrid');

  if(!grid) return;


  const draw = () => {

    const q =
      (
        document.getElementById('search')
        ?.value || ''
      ).toLowerCase();


    const f =
      document.getElementById(
        'filterCountry'
      )?.value || 'all';


    const list =
      PRODUCTS.filter(p =>

        (f === 'all' ||
         p.country === f)

        &&

        (
          p.name +
          ' ' +
          p.tags.join(' ')
        )
        .toLowerCase()
        .includes(q)

      );


    grid.innerHTML = list.length

      ? list.map(card).join('')

      : `
        <div class="empty">

          <h3>
            ไม่พบสินค้าในประเทศนี้
          </h3>

        </div>
      `;


    // ADD BUTTON
    grid
      .querySelectorAll('[data-add]')
      .forEach(b => {

        b.onclick = () => {

          const id =
            Number(b.dataset.add);

          const p =
            PRODUCTS.find(
              x => x.id === id
            );


          // ถ้ามีไซซ์ ให้ไปหน้า Product Detail
          if(
            p?.sizes &&
            p.sizes.length
          ) {

            location.href =
              `product.html?id=${id}`;

            return;

          }


          addCart(id);

        };

      });


    // WISHLIST
    grid
      .querySelectorAll('[data-wish]')
      .forEach(b => {

        b.onclick = () => {

          b.textContent =
            toggleWish(
              Number(b.dataset.wish)
            )
              ? '♥'
              : '♡';

        };

      });

  };


  const searchEl =
    document.getElementById('search');

  if(searchEl) {

    searchEl.oninput = draw;

  }


  const filterEl =
    document.getElementById(
      'filterCountry'
    );

  if(filterEl) {

    filterEl.onchange = draw;

  }


  draw();

}


// ======================================================
// PRODUCT DETAIL
// ======================================================

function renderProductPage() {

  const photo =
    document.getElementById('photo');

  if(!photo) return;


  const id =
    Number(
      new URLSearchParams(
        location.search
      ).get('id') || 1
    );


  const p =
    PRODUCTS.find(
      x => x.id === id
    ) || PRODUCTS[0];


  document.getElementById(
    'title'
  ).textContent = p.name;


  document.getElementById(
    'name'
  ).textContent = p.name;


  photo.src = p.image;

  photo.alt = p.name;


  document.getElementById(
    'country'
  ).textContent =
    p.flag + ' ' + p.country;


  document.getElementById(
    'price'
  ).textContent =
    money(p.price);


  document.getElementById(
    'deadline'
  ).textContent =
    'Pre-order closes ' +
    p.deadline;


  document.getElementById(
    'desc'
  ).textContent =
    p.desc || '';


  document.getElementById(
    'tags'
  ).innerHTML =
    p.tags
      .map(
        x => `<span>${x}</span>`
      )
      .join('');


  // ==================================================
  // SIZE
  // ==================================================

  const sizeOptions =
    document.getElementById(
      'size-options'
    );


  let selectedSize = null;


  if(sizeOptions) {

    if(
      p.sizes &&
      p.sizes.length
    ) {

      sizeOptions.innerHTML =
        p.sizes
          .map(size => `

            <button
              type="button"
              class="size-option"
              data-size="${size}"
            >
              ${size}
            </button>

          `)
          .join('');


      sizeOptions
        .querySelectorAll(
          '.size-option'
        )
        .forEach(button => {

          button.onclick = () => {

            sizeOptions
              .querySelectorAll(
                '.size-option'
              )
              .forEach(btn =>
                btn.classList.remove(
                  'selected'
                )
              );


            button.classList.add(
              'selected'
            );


            selectedSize =
              button.dataset.size;

          };

        });

    } else {

      sizeOptions.innerHTML = '';

    }

  }


  // ==================================================
  // QUANTITY
  // ==================================================

  const q =
    document.getElementById('qty');

  const wish =
    document.getElementById('wish');


  if(wish) {

    wish.textContent =
      wishes().includes(p.id)
        ? '♥'
        : '♡';


    wish.onclick = () => {

      wish.textContent =
        toggleWish(p.id)
          ? '♥'
          : '♡';

    };

  }


  document
    .getElementById('minus')
    ?.addEventListener(
      'click',
      () => {

        q.value =
          Math.max(
            1,
            Number(q.value) - 1
          );

      }
    );


  document
    .getElementById('plus')
    ?.addEventListener(
      'click',
      () => {

        q.value =
          Number(q.value) + 1;

      }
    );


  // ==================================================
  // ADD TO CART
  // ==================================================

  document
    .getElementById('add')
    ?.addEventListener(
      'click',
      () => {

        if(
          p.sizes &&
          p.sizes.length &&
          !selectedSize
        ) {

          toast(
            'Please select a size'
          );

          return;

        }


        addCart(
          p.id,
          Number(q.value),
          selectedSize
        );

      }
    );


  // ==================================================
  // BUY NOW
  // ==================================================

  document
    .getElementById('buy')
    ?.addEventListener(
      'click',
      () => {

        if(
          p.sizes &&
          p.sizes.length &&
          !selectedSize
        ) {

          toast(
            'Please select a size'
          );

          return;

        }


        if(!requireLogin()) return;


        addCart(
          p.id,
          Number(q.value),
          selectedSize
        );


        location.href =
          'payment.html';

      }
    );

}


// ======================================================
// CART PAGE
// ======================================================

function renderCartPage() {

  const box =
    document.getElementById(
      'cartItems'
    );

  if(!box) return;


  const draw = () => {

    const c = cart();


    box.innerHTML =
      c.length

      ? c.map((x, index) => {

          const p =
            PRODUCTS.find(
              v => v.id === x.id
            );


          if(!p) return '';


          return `

            <div class="cart-row">

              <img
                src="${p.image}"
                alt="${p.name}"
              >


              <div>

                <h3>
                  ${p.name}
                </h3>


                <p>

                  ${p.country}
                  ·
                  ${money(p.price)}

                  ${
                    x.size
                      ? ` · Size: <strong>${x.size}</strong>`
                      : ''
                  }

                </p>


                <div class="qty">

                  <button
                    data-minus="${index}"
                  >
                    −
                  </button>


                  <span>
                    ${x.qty}
                  </span>


                  <button
                    data-plus="${index}"
                  >
                    +
                  </button>

                </div>

              </div>


              <b>
                ${money(
                  p.price * x.qty
                )}
              </b>


              <button
                class="remove"
                data-remove="${index}"
              >
                Remove
              </button>

            </div>

          `;

        }).join('')

      : `

        <div class="empty">

          <h2>
            Your cart is empty
          </h2>

          <a
            class="btn dark"
            href="index.html#shop"
          >
            Browse products
          </a>

        </div>

      `;


    // SUBTOTAL
    const subtotal =
      document.getElementById(
        'subtotal'
      );

    if(subtotal) {

      subtotal.textContent =
        money(total());

    }


    // TOTAL
    const totalEl =
      document.getElementById(
        'total'
      );

    if(totalEl) {

      totalEl.textContent =
        money(total());

    }


    // MINUS
    box
      .querySelectorAll(
        '[data-minus]'
      )
      .forEach(b => {

        b.onclick = () => {

          changeQty(
            Number(
              b.dataset.minus
            ),
            -1
          );

          draw();

        };

      });


    // PLUS
    box
      .querySelectorAll(
        '[data-plus]'
      )
      .forEach(b => {

        b.onclick = () => {

          changeQty(
            Number(
              b.dataset.plus
            ),
            1
          );

          draw();

        };

      });


    // REMOVE
    box
      .querySelectorAll(
        '[data-remove]'
      )
      .forEach(b => {

        b.onclick = () => {

          removeCart(
            Number(
              b.dataset.remove
            )
          );

          draw();

        };

      });

  };


  draw();


  // ==================================================
  // CHECKOUT
  // ==================================================

  const checkoutBtn =
    document.getElementById(
      'checkout'
    );


  if(checkoutBtn) {

    checkoutBtn.onclick = e => {

      if(!cart().length) {

        e.preventDefault();

        toast(
          'Your cart is empty'
        );

        return;

      }


      if(!requireLogin()) {

        e.preventDefault();

      } else {

        location.href =
          'payment.html';

      }

    };

  }

}


// ======================================================
// WISHLIST PAGE
// ======================================================

function renderWishlistPage() {

  const box =
    document.getElementById(
      'wishlistGrid'
    );

  if(!box) return;


  const draw = () => {

    const ws = wishes();


    const list =
      PRODUCTS.filter(
        p => ws.includes(p.id)
      );


    box.innerHTML =

      list.length

      ? list.map(card).join('')

      : `

        <div class="empty span">

          <h2>
            Wishlist is empty
          </h2>

          <p>
            Save products you love from the shop.
          </p>

          <a
            class="btn dark"
            href="index.html#shop"
          >
            Browse products
          </a>

        </div>

      `;


    // ADD
    box
      .querySelectorAll(
        '[data-add]'
      )
      .forEach(b => {

        b.onclick = () => {

          const id =
            Number(
              b.dataset.add
            );


          const p =
            PRODUCTS.find(
              x => x.id === id
            );


          if(
            p?.sizes &&
            p.sizes.length
          ) {

            location.href =
              `product.html?id=${id}`;

            return;

          }


          addCart(id);

        };

      });


    // WISH
    box
      .querySelectorAll(
        '[data-wish]'
      )
      .forEach(b => {

        b.onclick = () => {

          toggleWish(
            Number(
              b.dataset.wish
            )
          );

          draw();

        };

      });

  };


  draw();

}


// ======================================================
// ACCOUNT PAGE
// ======================================================

function renderAccountPage() {

  const profile =
    document.getElementById(
      'profile'
    );

  if(!profile) return;


  const u = user();


  if(!u) {

    profile.innerHTML = `

      <div class="empty">

        <h2>
          Login required
        </h2>

        <p>
          Please log in to view your profile and order history.
        </p>

        <button
          id="accLoginBtn"
          class="btn dark"
        >
          Log in
        </button>

      </div>

    `;


    document
      .getElementById(
        'accLoginBtn'
      )
      ?.addEventListener(
        'click',
        () =>
          document
            .getElementById(
              'loginOpen'
            )
            ?.click()
      );


    return;

  }


  const os =
    orders().filter(
      o => o.email === u.email
    );


  profile.innerHTML = `

    <div class="avatar">
      ${u.name[0].toUpperCase()}
    </div>

    <h3>
      ${u.name}
    </h3>

    <p>
      ${u.email}
    </p>

    <button
      id="logout"
      class="btn ghost full"
    >
      Log out
    </button>

  `;


  document.getElementById(
    'orderCount'
  ).textContent =
    os.length;


  document.getElementById(
    'wishCount'
  ).textContent =
    wishes().length;


  document.getElementById(
    'myCountry'
  ).textContent =
    {
      KR:'🇰🇷',
      JP:'🇯🇵',
      CN:'🇨🇳',
      USA:'🇺🇸'
    }[
      localStorage.getItem(
        'glofe_country'
      ) || 'KR'
    ];


  document.getElementById(
  'orders'
).innerHTML =

  os.length

  ? os.map(o => `

      <article class="order">

        <div class="order-info">

          <b class="order-number">
            ${o.id}
          </b>

          <small>
            ${o.date} · ${o.country}
          </small>


          <div class="order-products">

            ${o.items.map(i => {

              const product =
                PRODUCTS.find(
                  p => p.name === i.name
                );

              return `

                <div class="order-product">

                  <img
                    src="${
                      product
                        ? product.image
                        : 'assets/images/product-1.svg'
                    }"
                    alt="${i.name}"
                  >

                  <div class="order-product-info">

                    <strong>
                      ${i.name}
                    </strong>

                    <span>

                      ${
                        i.size
                          ? `Size ${i.size} · `
                          : ''
                      }

                      Quantity: ${i.qty}

                    </span>

                  </div>

                </div>

              `;

            }).join('')}

          </div>

        </div>


        <div class="order-summary">

          <b>
            ${money(o.total)}
          </b>

          <em>
            ${o.status}
          </em>

        </div>

      </article>

    `).join('')

  : `

      <div class="empty">

        <h3>
          No orders yet
        </h3>

        <a
          class="btn dark"
          href="index.html#shop"
        >
          Start shopping
        </a>

      </div>

    `;


  document.getElementById(
    'logout'
  ).onclick = () => {

    localStorage.removeItem(
      'glofe_user'
    );

    location.href =
      'index.html';

  };

}


// ======================================================
// PAYMENT PAGE
// ======================================================

function renderPaymentPage() {

  const items =
    document.getElementById(
      'paymentItems'
    );

  if(!items) return;


  const u = user();


  if(!u) {

    toast(
      'Login required to view checkout'
    );

    location.href =
      'index.html';

    return;

  }


  const c = cart();


  if(!c.length) {

    items.innerHTML = `

      <div class="empty">

        <h2>
          Your cart is empty
        </h2>

        <a
          class="btn dark"
          href="index.html#shop"
        >
          Shop now
        </a>

      </div>

    `;

    return;

  }


  document.getElementById(
    'payName'
  ).value = u.name;


  document.getElementById(
    'payEmail'
  ).value = u.email;


  document.getElementById(
    'payCountry'
  ).value =
    localStorage.getItem(
      'glofe_country'
    ) || 'KR';


  // ==================================================
  // PAYMENT ITEMS
  // ==================================================

  items.innerHTML =
    c.map(x => {

      const p =
        PRODUCTS.find(
          v => v.id === x.id
        );


      return `

        <div class="pay-item">

          <img
            src="${p.image}"
            alt="${p.name}"
          >


          <div>

            <b>
              ${p.name}
            </b>


            <small>

              ${money(p.price)}
              ×
              ${x.qty}

              ${
                x.size
                  ? ` · Size ${x.size}`
                  : ''
              }

            </small>

          </div>


          <strong>
            ${money(
              p.price * x.qty
            )}
          </strong>

        </div>

      `;

    }).join('');


  // ==================================================
  // PAYMENT SUMMARY
  // ==================================================

  document.getElementById(
    'paySummary'
  ).innerHTML =

    c.map(x => {

      const p =
        PRODUCTS.find(
          v => v.id === x.id
        );


      return `

        <div class="line">

          <span>

            ${p.name}

            ${
              x.size
                ? ` · Size ${x.size}`
                : ''
            }

            × ${x.qty}

          </span>


          <b>
            ${money(
              p.price * x.qty
            )}
          </b>

        </div>

      `;

    }).join('');


  document.getElementById(
    'payTotal'
  ).textContent =
    money(total());


  // ==================================================
  // PAYMENT FORM
  // ==================================================

  document.getElementById(
    'paymentForm'
  ).onsubmit = e => {

    e.preventDefault();


    const ccode =
      document.getElementById(
        'payCountry'
      ).value;


    const labels = {

      KR:'🇰🇷 Korea',

      JP:'🇯🇵 Japan',

      CN:'🇨🇳 China',

      USA:'🇺🇸 USA'

    };


    const id =
      'GF-' +
      Math.floor(
        1000 +
        Math.random() * 9000
      );


    let os = orders();


    os.unshift({

      id,

      email:u.email,

      date:
        new Date()
          .toLocaleDateString(
            'en-GB'
          ),

      country:
        labels[ccode] || ccode,

      status:
        'Order Confirmed',

      total:
        total(),

      items:
        c.map(x => {

          const p =
            PRODUCTS.find(
              v => v.id === x.id
            );


          return {

            name:p.name,

            qty:x.qty,

            size:x.size || null

          };

        })

    });


    set(
      'glofe_orders',
      os
    );


    set(
      'glofe_cart',
      []
    );


    document.body.innerHTML = `

      <main class="success">

        <div class="success-card">

          <p class="eyebrow">
            SUCCESS
          </p>

          <h1>
            Pre-order confirmed
          </h1>

          <p>
            Your order number is
            <b>${id}</b>
          </p>

          <a
            class="btn dark"
            href="account.html"
          >
            View order history
          </a>

          <a
            class="btn ghost"
            href="index.html"
          >
            Back to shop
          </a>

        </div>

      </main>

    `;

  };

}


// ======================================================
// TRANSLATIONS
// ======================================================

const translations = {

  en: {

    home:"Home",
    shop:"Shop",
    wishlist:"Wishlist",
    account:"My Account",
    how:"How it works",
    faq:"FAQ",

    cart:"Cart",
    login:"Log in",
    signup:"Sign up",

    heroEyebrow:
      "GLOBAL PRE-ORDER • CURATED • SIMPLE",

    heroText:
      "Discover carefully selected products from Korea, Japan, China and the USA. Order in a few clicks and follow your parcel from supplier to doorstep.",

    shopNow:
      "Shop now",

    learnHow:
      "How it works →",

    trust1:
      "Curated products",

    trust2:
      "Transparent deadlines",

    trust3:
      "Order tracking",

    curated:
      "CURATED FOR YOU",

    popular:
      "Popular pre-orders",

    searchPlaceholder:
      "Search products...",

    allCountries:
      "All countries",

    howEyebrow:
      "HOW IT WORKS",

    howTitle:
      "From click to doorstep.",

    step1t:
      "Create an account",

    step1p:
      "Save your profile, orders and delivery details in one place.",

    step2t:
      "Choose your products",

    step2p:
      "Browse by country and check the pre-order closing date.",

    step3t:
      "Pay securely",

    step3p:
      "Review your cart and complete the checkout page.",

    step4t:
      "Track the order",

    step4p:
      "Follow updates from supplier order to delivery.",

    whyTitle:
      "Global shopping, without the guesswork.",

    why1:
      "Clear product info",

    why2:
      "Visible deadlines",

    why3:
      "Easy tracking",

    faqTitle:
      "Questions, answered.",

    q1:
      "Why do I need an account?",

    a1:
      "Your account saves order history and delivery details and is required before checkout.",

    q2:
      "When will my pre-order arrive?",

    a2:
      "Each product shows its own estimated pre-order deadline and shipping period.",

    q3:
      "Can I cancel an order?",

    a3:
      "Cancellation depends on whether the supplier order has already been placed.",

    q4:
      "Is payment real?",

    a4:
      "This is a front-end educational demo. Connect a secure payment gateway for real transactions."

  },


  th: {

    home:"หน้าแรก",
    shop:"สินค้า",
    wishlist:"รายการโปรด",
    account:"บัญชีของฉัน",
    how:"วิธีการสั่งซื้อ",
    faq:"คำถามที่พบบ่อย",

    cart:"ตะกร้า",
    login:"เข้าสู่ระบบ",
    signup:"สมัครสมาชิก",

    heroEyebrow:
      "พรีออเดอร์ทั่วโลก • คัดสรร • ง่าย",

    heroText:
      "ค้นพบสินค้าที่คัดสรรจากเกาหลี ญี่ปุ่น จีน และสหรัฐอเมริกา สั่งซื้อได้ง่ายในไม่กี่คลิก และติดตามพัสดุของคุณตั้งแต่ร้านค้าจนถึงหน้าบ้าน",

    shopNow:
      "เลือกซื้อสินค้า",

    learnHow:
      "วิธีการสั่งซื้อ →",

    trust1:
      "สินค้าคัดสรร",

    trust2:
      "กำหนดเวลาชัดเจน",

    trust3:
      "ติดตามคำสั่งซื้อได้",

    curated:
      "คัดสรรเพื่อคุณ",

    popular:
      "สินค้าพรีออเดอร์ยอดนิยม",

    searchPlaceholder:
      "ค้นหาสินค้า...",

    allCountries:
      "ทุกประเทศ",

    howEyebrow:
      "วิธีการสั่งซื้อ",

    howTitle:
      "ตั้งแต่คลิกจนถึงหน้าบ้าน",

    step1t:
      "สร้างบัญชี",

    step1p:
      "บันทึกข้อมูลโปรไฟล์ คำสั่งซื้อ และข้อมูลการจัดส่งไว้ในที่เดียว",

    step2t:
      "เลือกสินค้า",

    step2p:
      "เลือกดูสินค้าตามประเทศและตรวจสอบวันปิดรับพรีออเดอร์",

    step3t:
      "ชำระเงินอย่างปลอดภัย",

    step3p:
      "ตรวจสอบสินค้าในตะกร้าและดำเนินการชำระเงิน",

    step4t:
      "ติดตามคำสั่งซื้อ",

    step4p:
      "ติดตามสถานะตั้งแต่สั่งซื้อกับร้านค้าจนถึงการจัดส่ง",

    whyTitle:
      "ช้อปสินค้าจากทั่วโลกได้ง่ายขึ้น",

    why1:
      "ข้อมูลสินค้าชัดเจน",

    why2:
      "กำหนดเวลาชัดเจน",

    why3:
      "ติดตามง่าย",

    faqTitle:
      "คำถามที่พบบ่อย",

    q1:
      "ทำไมฉันต้องสร้างบัญชี?",

    a1:
      "บัญชีจะเก็บประวัติคำสั่งซื้อและข้อมูลการจัดส่งของคุณ และจำเป็นต้องมีบัญชีก่อนชำระเงิน",

    q2:
      "สินค้าพรีออเดอร์จะมาถึงเมื่อไหร่?",

    a2:
      "สินค้าแต่ละรายการจะแสดงกำหนดเวลาพรีออเดอร์และช่วงเวลาจัดส่งโดยประมาณ",

    q3:
      "ฉันสามารถยกเลิกคำสั่งซื้อได้หรือไม่?",

    a3:
      "การยกเลิกขึ้นอยู่กับว่าร้านค้าได้ดำเนินการสั่งซื้อสินค้าแล้วหรือไม่",

    q4:
      "การชำระเงินใช้งานจริงหรือไม่?",

    a4:
      "นี่เป็นเว็บไซต์ตัวอย่างสำหรับการศึกษา หากต้องการใช้งานจริงต้องเชื่อมต่อระบบชำระเงินที่ปลอดภัย"

  }

};


// ======================================================
// LANGUAGE
// ======================================================

function changeLanguage(lang) {

  document
    .querySelectorAll(
      "[data-i18n]"
    )
    .forEach(element => {

      const key =
        element.getAttribute(
          "data-i18n"
        );


      if(
        translations[lang] &&
        translations[lang][key]
      ) {

        element.textContent =
          translations[lang][key];

      }

    });


  document
    .querySelectorAll(
      "[data-i18n-ph]"
    )
    .forEach(element => {

      const key =
        element.getAttribute(
          "data-i18n-ph"
        );


      if(
        translations[lang] &&
        translations[lang][key]
      ) {

        element.placeholder =
          translations[lang][key];

      }

    });


  document
    .querySelectorAll(".lang")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.lang === lang
      );

    });


  localStorage.setItem(
    'glofe_lang',
    lang
  );

}


// ======================================================
// LANGUAGE BUTTONS
// ======================================================

document
  .querySelectorAll(".lang")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        changeLanguage(
          button.dataset.lang
        );

      }
    );

  });


// ======================================================
// INITIALIZE
// ======================================================

initHeader();

initAuth();

renderHome();

renderProductPage();

renderCartPage();

renderWishlistPage();

renderAccountPage();

renderPaymentPage();


const savedLanguage =
  localStorage.getItem(
    "glofe_lang"
  ) || "en";


changeLanguage(
  savedLanguage
);