<template>
  <h3 class="cart-header">Checkout</h3>
  <el-alert type="warning" center effect="dark">
    <p style="font-family: sans-serif; font-weight: bold">
      Демо оплата ЮКаssа
    </p>
  </el-alert>

  <el-alert type="error" v-if="payError.length" :title="payError" />

  <!-- START OF PAYMENT BOX -->
  <el-card class="main-view-checkout" :body-style="{ width: '80%' }">
    <div>
      <el-button
        @click="submitPayment"
        :disabled="!isReady"
        :loading="isProcessing"
        id="checkout-btn"
        class="btn purple"
      >
        ОПЛАТИТЬ {{ totalPrice }} RUB
      </el-button>
    </div>
  </el-card>

  <!-- order summary here  -->
  <div class="order-brief">
    <el-collapse v-model="activeName">
      <el-collapse-item :style="{ fontSize: '16px' }" :title="summaryTitle" name="1">
        <ul class="cartlist">
          <template v-for="course in cartItems" :key="course.id">
            <li class="carty">{{ course.title }}</li>
            <el-divider />
          </template>
        </ul>
      </el-collapse-item>
    </el-collapse>
  </div>
  <!-- end of summary -->
</template>

<script lang="ts" setup>
import { ref } from "vue";
import CheckoutService from "@/service/CheckoutService";
import { ElMessage } from "element-plus";
import CartService from "@/service/CartService";
import type { Course } from "@/interfaces/myedu";
import { handleApiError } from "@/util/http_util";
import { useRouter } from "vue-router";
import type { YookassaCheckoutRequest } from "@/interfaces/custom";
import { useStudentStore } from "@/stores";

const activeName = ref("1");
const totalPrice = ref(0.0);
const isReady = ref(true);
const isProcessing = ref(false);
const cartItems = ref<Course[]>([]);
const payError = ref("");
const summaryTitle = ref("Order Summary (some of your items)");

const router = useRouter();
const store = useStudentStore();

function submitPayment() {
  if (!isReady.value) return;
  isProcessing.value = true;

  const yookassaRequest: YookassaCheckoutRequest = {
    description: "Оплата заказа",
    totalAmount: totalPrice.value,
    returnURL: "http://localhost:5175/checkout/complete"
  };

  CheckoutService.createPayment(yookassaRequest)
    .then(res => {
      window.location.href = res.data; // Redirect user to the payment page
    })
    .catch(err => handleApiError(err))
    .finally(() => (isProcessing.value = false));
}

function fetchCartItems() {
  CartService.getMinePaged(0)
    .then(res => (cartItems.value = res.data.content))
    .then(() => fetchMyTotalBill())
    .catch(err => handleApiError(err));
}

async function fetchMyTotalBill() {
  const res = await CartService.getMyTotalBill();
  totalPrice.value = res.data.totalPrice;
}

fetchCartItems();
</script>

<style scoped>
.main-view-checkout {
  text-align: center;
  display: flex;
  margin: 2em auto;
  flex-direction: row;
  width: 30vw;
  justify-content: center;
}

.carty {
  color: rgb(75, 75, 75);
  text-align: left;
  font-weight: 500;
  font-size: 16px;
}

#checkout-btn {
  width: 50% !important;
  text-align: center;
}

.order-brief {
  margin: 2em auto;
  display: flex;
  width: 30vw;
  flex-direction: column;
  justify-self: center;
}

@media screen and (max-width: 600px) {
  .main-view-checkout,
  .order-brief {
    width: 90vw;
  }

  .carty {
    font-size: 14px;
  }

  .cart-header {
    height: 2em;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>