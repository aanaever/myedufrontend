import { defineStore } from "pinia";
import { httpUtil } from "@/util/http_util";
import type { UserDto } from "@/interfaces/custom";
import AuthService from "@/service/AuthService";

// FOR USER's state
interface UserState {
  id: number;
  fullname: string;
  loggedIn: boolean;
  cartCount: number;
  role: string;
}

const useStudentStore = defineStore({
  id: "studentStore",
  state: (): UserState => {
    return {
      id: 0,
      cartCount: 0,
      loggedIn: false,
      fullname: "",
      role: ""
    };
  },
  actions: {
    async getLoginStatus(): Promise<boolean> {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          this.loggedIn = false;
          return false;
        }
        const res = await httpUtil.get("/auth/status", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Ответ сервера на статус:", res.data);
        this.loggedIn = res.data.loggedIn;
        const user: UserDto = res.data?.userInfo;
        if (user) {
          this.id = user.id;
          this.fullname = user.fullname;
          this.role = user.role;
        }
        return this.loggedIn;
      } catch (error: any) {
        console.error("Ошибка при получении статуса входа:", error.message);
        return false;
      }
    },
    async getCartCountServer(): Promise<number> {
      try {
        const res = await httpUtil.get("/cart/mine/count");
        this.cartCount = res.data.cartCount;
        return this.cartCount;
      } catch (error: any) {
        console.error("Ошибка при получении количества товаров в корзине:", error.message);
        return 0;
      }
    },
    async logoutUser() {
      AuthService.logoutUser();
      this.$reset();
    },
    setUserInfo(userInfo: { id: number; fullname: string; role: string; loggedIn: boolean }) {
      this.id = userInfo.id;
      this.fullname = userInfo.fullname;
      this.role = userInfo.role;
      this.loggedIn = userInfo.loggedIn;
      console.log("UserInfo set:", userInfo); // Debugging line
    }
  },
  getters: {
    getCartCount: (store): number => store.cartCount,
    getIsLoggedIn: (store): boolean => store.loggedIn,
    isAdmin: (state): boolean => state.role === 'ROLE_ADMIN',
    isTeacher: (state): boolean => state.role === 'ROLE_TEACHER',
    isStudent: (state): boolean => state.role === 'ROLE_STUDENT'
  }
});

export default useStudentStore;
