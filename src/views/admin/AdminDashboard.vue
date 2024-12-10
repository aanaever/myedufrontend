<template>
    <div class="admin-dashboard">
      <div class="admin-header">
        <h1>Административная Панель</h1>
        <nav class="admin-nav">
          <ul>
            <li><router-link to="/admin/users">Пользователи</router-link></li>
            <li><router-link to="/admin/teachers">Учителя</router-link></li>
            <li><router-link to="/admin/courses">Курсы</router-link></li>
            <li><router-link to="/admin/add-course">Добавить курс</router-link></li>
            <li><button @click="logout">Выйти</button></li>
          </ul>
        </nav>
      </div>
      <router-view />
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminDashboard',
    methods: {
      logout() {
        // Здесь должна быть логика для выхода из системы
        console.log("Выход выполнен");
        // Пример перенаправления на страницу входа
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style>
  .admin-dashboard .admin-header {
    background-color: #f4f4f4;
    padding: 20px;
    text-align: center;
  }
  
  .admin-dashboard .admin-nav ul {
    list-style-type: none;
    padding: 0;
  }
  
  .admin-dashboard .admin-nav li {
    display: inline;
    margin-right: 20px;
  }
  </style>
  