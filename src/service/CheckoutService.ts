import { httpUtil } from "@/util/http_util";
import type { YookassaCheckoutRequest } from "@/interfaces/custom";

class CheckoutService {
  /** Submit payment info to server */
  createPayment(load: YookassaCheckoutRequest) {
    return httpUtil.post("/checkout/create", load);
  }
}

export default new CheckoutService();