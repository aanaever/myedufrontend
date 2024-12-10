import { httpUtil } from "@/util/http_util";
import useStudentStore from "@/stores/modules/studentStore"; // Модуль экспортируется по умолчанию
import type { LoginRequest } from "@/interfaces/custom";
import type { User } from "@/interfaces/myedu";
import type { AxiosError } from "axios"; // Импортируем тип AxiosError

class AuthService {
  /** Аутентификация пользователя с использованием JSON */
  async loginUser({ email, password, responseToken }: LoginRequest) {
    const url = "/auth/login";
    const body = { email, password };
    try {
      const response = await httpUtil.post(url, body, { params: { responseToken: responseToken } });
      console.log("Ответ сервера:", response.data); 

      // Сохранение JWT токена
      const token = response.data.token;
      localStorage.setItem("jwtToken", token);
      console.log("Получен токен:", token); // Логирование получения токена

      // Установка заголовка авторизации для всех будущих запросов
      httpUtil.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Обновление состояния пользователя после успешного входа
      const store = useStudentStore();
      store.setUserInfo({
        id: response.data.userInfo.id, 
        fullname: response.data.userInfo.fullname, 
        role: response.data.userInfo.role, 
        loggedIn: true 
      });

      return response.data;
    } catch (error) {
      // Приведение типа ошибки к AxiosError
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Неизвестная ошибка';
      console.error('Ошибка входа:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /** Регистрация нового пользователя */
  async registerUser(load: Partial<User>, responseToken: string) {
    try {
      const response = await httpUtil.post("/auth/register", load, { params: { responseToken: responseToken } });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Неизвестная ошибка';
      console.error('Ошибка регистрации:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /** Регистрация нового учителя */
  async registerTeacher(load: Partial<User>, responseToken: string) {
    try {
      const response = await httpUtil.post("/auth/register/teacher", load, { params: { responseToken: responseToken } });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Неизвестная ошибка';
      console.error('Ошибка регистрации учителя:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /** Выход пользователя */
  logoutUser() {
    // Удаление JWT токена
    localStorage.removeItem("jwtToken");
    delete httpUtil.defaults.headers.common['Authorization'];
  }
}

export default new AuthService();
