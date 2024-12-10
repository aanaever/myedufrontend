<template>
  <footer class="m-footer">
    <div class="lefty">
      <el-row class="footer-row">
        <router-link to="/about"> О нас</router-link>
      </el-row>
      <el-row class="footer-copy">
        &copy; MYEdu 2024
      </el-row>
      <el-row class="footer-row">
        <!-- Place this tag where you want the button to render. -->
      </el-row>
      <el-row>
        <!-- Place this tag where you want the button to render. -->
      </el-row>
    </div>
    <div class="righty">
      
      <el-row class="credit-cards" title="Поддерживаемые способы оплаты">
        <img height="40" alt="sber" src="@/assets/footer-svg/logo-sber.svg" />
        <img height="40" alt="tinkoff" src="@/assets/footer-svg/logo-tinkoffpay.svg" />
        <img height="40" alt="mir" src="@/assets/footer-svg/logo-mir.svg" />
        <img height="40" alt="yookassa" src="@/assets/footer-svg/logo-yookassa.svg" />
        <img height="40" alt="visa" src="@/assets/footer-svg/logo-visa.svg" />
        <img height="40" alt="mc" src="@/assets/footer-svg/logo-mc.svg" />
      </el-row>
    </div>
  </footer>
</template>


<style scoped lang="css">
.m-footer {
  width: 90%;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 1em;
  bottom: 0;
  color: black; /* Цвет текста */
  background-color: #ffffff; /* Фоновый цвет */
  border-top: 1px solid gray; /* Разделительная линия сверху */
  display: block; 
  margin: 0 auto;
}

.lefty {
  margin-top: 0.5em;
  float: left;
}

.footer-row {
  margin-bottom: 10px;
}

.footer-copy {
  font-family: 'Trebuchet MS';
  font-weight: bold;
  
}

.credit-cards {
  margin-bottom: 0.2em;
}

a {
  color: black !important; /* Цвет ссылок */
  text-decoration: none;
}

a:hover {
  border-bottom: 1px solid black; /* Подчеркивание при наведении */
}

.credit-cards img {
  margin-right: 0.25em;
}

.righty {
  margin-top: 0.5em;
  float: right;
}

#ft-logo {
  width: 10em;
  margin-top: 1em;
  height: 100%;
}

@media screen and (max-width: 770px) {
  .credit-cards {
    display: none;
  }
  .m-footer {
    top: 30vh;
  }
}

</style>