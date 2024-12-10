import { httpUtil } from "@/util/http_util";
import type { User } from "@/interfaces/myedu";

class UserService {
  // Получение списка всех пользователей
  getAllUsers() {
    return httpUtil.get('/users');
  }

  getUserById(id: number) {
    return httpUtil.get(`/users/${id}`);
  }
  

  deleteUser(id: number) {
    return httpUtil.delete(`/users/id/${id}`);
  }
  
  updateUser(id: number, user: Partial<User>) {
    return httpUtil.put(`/users/${id}`, user);
  }
  
  
}





/*

  getUserById(userId) {
    return httpUtil.get(`/users/${userId}`);
  },
  
  updateUser(userData) {
    return httpUtil.put(`/users/${userData.id}`, userData);
  }



  /** get basic info 
  getUserDetails() {
    return httpUtil.get("/profile/mine");
  }

  /** update my profile 
  updateUser(user: Partial<User>) {
    return httpUtil.put("/profile/mine", user);
  }

  // Обновление данных пользователя администратором
  updateUser(id: number, userData: any) {
    return httpUtil.put(`/users/${id}`, userData);
  }

  */





export default new UserService();
