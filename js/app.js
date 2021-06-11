import productModal from './productModal.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/';
const apiPath = "akihico";

const App = {
    data() {
        return {
            loadingStatus: {
                loadingItem: ""
            },
            products: [],
            tempProducts: {},
            cart: {},
            //表單
            form: {
                user: {
                    email: "",
                    tel: "",
                    address: ""
                },
                message: ""
            }
        }
    },
    methods: {
        //取得後台產品資訊
        getProducts() {
            axios.get(`${apiUrl}api/${apiPath}/products`)
                .then((res) => {
                    if (res.data.success) {
                        this.products = res.data.products;
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                }) 
        },
        openModal(item) {
            //console.log(item);
            axios.get(`${apiUrl}api/${apiPath}/product/${item.id}`)
                .then((res) => {
                    if (res.data.success) {
                        this.tempProducts = res.data.product;
                        this.$refs.userproductModal.modalOpen();
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        //取得購物車列表
        getCart() {
            axios.get(`${apiUrl}api/${apiPath}/cart`)
                .then((res) => {
                    if (res.data.success) {
                        this.cart = res.data.data;
                        //console.log(this.cart);
                    } else {
                        alert(res.data.message); 
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        //加入購物車
        addCart(id, qty=1 ) {
            this.loadingStatus.loadingItem = id;
            const cart = {
                product_id: id,
                qty
            }
            axios.post(`${apiUrl}api/${apiPath}/cart`, {data: cart})
                .then((res) => {
                    if (res.data.success) {
                        //console.log(res);
                        alert(res.data.message);
                        this.loadingStatus.loadingItem = "";
                        this.getCart();
                    } else {
                        alert(res.data.message); 
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        //刪除單一產品
        delItem(id) {
            this.loadingStatus.loadingItem = id;
            axios.delete(`${apiUrl}api/${apiPath}/cart/${id}`)
                .then((res) => {
                    if (res.data.success) {
                        alert(res.data.message);
                        this.loadingStatus.loadingItem = "";
                    } else {
                        alert(res.data.message); 
                    }
                    this.getCart();
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        //清除購物車
        delCart() {
            axios.delete(`${apiUrl}api/${apiPath}/carts`)
                .then((res) => {
                    if (res.data.success) {
                        alert(res.data.message);
                    } else {
                        alert(res.data.message);
                    }
                    this.getCart();
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        //更新購物車
        updateCart(item) {
            const cart = {
                product_id: item.product.id,
                qty: item.qty
            }
            axios.put(`${apiUrl}api/${apiPath}/cart/${item.id}`, {data: cart})
                .then((res) => {
                    if (res.data.success) {
                        alert(res.data.message);
                    } else {
                        alert(res.data.message);
                    }
                    this.getCart();
                })
        },
        //送出訂單
        sendOrder() {
            const order = this.form;
            axios.post(`${apiUrl}api/${apiPath}/order`, {data: order})
                .then((res) => {
                    if (res.data.success) {
                        alert(res.data.message);
                        this.getCart();
                        this.$refs.form.resetForm();
                        
                    } else {
                        alert(res.data.message);
                    }
                })
        },
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '請輸入正確電話號碼'
        }
    },
    mounted(){
        this.getProducts();
        this.getCart();
    }
}
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('required', VeeValidateRules['required']);
Vue.createApp(App)
.component('userProductModal', productModal)

//註冊驗證
.component('VForm', VeeValidate.Form)
.component('VField', VeeValidate.Field)
.component('ErrorMessage', VeeValidate.ErrorMessage)
.mount("#app");