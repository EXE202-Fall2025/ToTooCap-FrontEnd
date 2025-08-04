// Order API Service
const API_BASE_URL = "http://localhost:8080/api"; // Thay đổi URL này theo backend của bạn

class OrderService {
  // Lấy danh sách tất cả đơn hàng
  static async getAllOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/getAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  // Cập nhật trạng thái đơn hàng
  static async updateOrderStatus(orderId, status) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/updateStatus/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }

  // Lấy chi tiết đơn hàng
  static async getOrderById(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  }

  // Xóa đơn hàng
  static async deleteOrder(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/delete/${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }

  // Lấy thống kê đơn hàng
  static async getOrderStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching order stats:", error);
      throw error;
    }
  }
}

export default OrderService;
