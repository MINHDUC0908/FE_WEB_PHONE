import axios from "axios"; 
import { createContext, useContext, useState, useEffect, useMemo } from "react"; 
import { UseDataUser } from "./UserContext"; 
import { api } from "../Api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [count, setCount] = useState(0);
    const [cart, setCart] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("");
    const { user } = UseDataUser();
    const token = localStorage.getItem("token");

    // Hàm lấy số lượng sản phẩm trong giỏ hàng
    const CountCart = async () => { 
        if (!token) { 
            console.warn("Token không tồn tại.");
            setCount(0);
            return;
        }
        try {
            setLoading(true)
            const response = await axios.get(api + "countCart", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCount(response.data?.countCart || 0); 
        } catch (error) {
            console.error("Lỗi khi lấy số lượng giỏ hàng:", error);
            setCount(0); 
        } finally {
            setLoading(false)
        }
    };

    // Hàm thêm sản phẩm vào giỏ hàng
    const handleAddToCart = async (product_id, color_id, quantity) => { 
        if (!token) {
            return "User is not logged in."; 
        }
        try {
            setLoading(true)
            const response = await axios.post(
                api + "storeCart",
                { 
                    product_id, 
                    color_id, 
                    quantity 
                }, 
                
                { 
                    headers: { 
                        Authorization: `Bearer ${token}` 
                    } 
                }
            );
            if (response.data?.message) { 
                CountCart(); 
                fetchCart()
                return response.data.message; 
            }
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm vào giỏ:", error);
            return "Lỗi khi thêm sản phẩm vào giỏ hàng."; 
        } finally {
            setLoading(false)
        }
    };

    // Hàm lấy chi tiết giỏ hàng
    const fetchCart = async () => {
        if (!token) { 
            setError("Bạn cần phải đăng nhập để xem giỏ hàng."); 
            return;
        }
    
        try {
            setLoading(true);
            const response = await axios.get(api + "cart", {
                headers: { 
                    Authorization: `Bearer ${token}` 
                },
            });
    
            console.log("API Response:", response.data); // Debug API Response
    
            if (response.data?.data?.cart_items?.length > 0) {
                setCart(response.data.data.cart_items);
            } else {
                console.warn("API không có sản phẩm trong giỏ hàng!");
                setCart([]);
            }
    
            setMessage(response.data?.message || "");
        } catch (error) {
            console.error("Error fetching cart:", error);
            setError("Lỗi khi tải giỏ hàng."); 
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };
    
    const deleteCart = async (id) => {
        try {
            const res = await axios.delete(api + `delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(res.data);
            CountCart();
            fetchCart();
        } catch (error) {
            console.error('Error deleting cart item:', error.response.data);
        }
    }
    useEffect(() => {
        if (user) {
            try {
                CountCart();
                fetchCart();
            } catch (error) {
                console.error("Lỗi trong useEffect:", error);
            }
        } else {
            setCount(0);
            setCart([]);
        }
    }, [user]);

    // Tính tổng giá trị sản phẩm đã chọn
    const calculateTotal = useMemo(() => {
        return cart?.length > 0
            ? cart.filter(item => item.selected === 1)
                .reduce((total, item) => total + item.quantity * item.price, 0)
            : 0;
    }, [cart]);
    const calculateTotalDiscount = useMemo(() => {
        return cart?.length > 0
            ? cart
                .filter(item => item.selected === 1) // Chỉ tính cho sản phẩm được chọn
                .reduce((total, item) => {
                    const discount = item.product.discount;
                    const isDiscountValid = discount && new Date(discount.end_date) > new Date(); // Kiểm tra còn hạn
    
                    if (isDiscountValid) {
                        const discountAmount = item.product.price * (discount.discount_value / 100);
                        return total + discountAmount * item.quantity;
                    }
                    return total;
                }, 0)
            : 0;
    }, [cart]);
    
        // Tính tổng tiền khuyến mãi
    const totalToPay = Math.max(0, (calculateTotal || 0) - (calculateTotalDiscount || 0));
    return (
        <CartContext.Provider value={{ count, cart, setCart, handleAddToCart, deleteCart, CountCart, loading, calculateTotalDiscount, totalToPay, calculateTotal}}>
            {children}
        </CartContext.Provider>
    );
};

export const CartData = () => useContext(CartContext); 
