'use client';
import { CartProductType } from '@/types';
import axios from 'axios';
import { cookies } from 'next/headers';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';

type CartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleCartQtyIncrease: (product: CartProductType) => void;
  handleCartQtyDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handleSetPaymentIntent: (value: string | null) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const CartContextProvider = ({ sessionCookie, children }: Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null,
  );
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const response = await axios.get(`http://localhost:8000/api/cart`, {
      headers: {
        Authorization: `Bearer ${sessionCookie}`,
        'Content-Type': 'application/json',
      },
    });
    setCartProducts(response.data);
  };

  useEffect(() => {
    // localStorage.setItem(
    //   'eShopCartItems',
    //   JSON.stringify([
    //     {
    //       id: '65f93523377851060f976112',
    //       name: 'Apple Watch Pro',
    //       description: 'Brand new modern watch',
    //       category: 'Watch',
    //       brand: 'Apple',
    //       selectedImg: {
    //         color: 'White',
    //         colorCode: '#FFFFFF',
    //         image:
    //           'https://firebasestorage.googleapis.com/v0/b/e-shop-project-42c83.appspot.com/o/products%2F1710830876674-apple-watch-tv.jpeg?alt=media&token=45f69e07-6c54-4564-ac13-c510faa75be9',
    //       },
    //       quantity: 1,
    //       price: 950,
    //     },
    //   ]),
    // );
    // const cartItems: any = localStorage.getItem('eShopCartItems');
    // const cProducts: CartProductType[] | null = JSON.parse(cartItems);
    const eShopPaymentIntent: any = localStorage.getItem('eShopPaymentIntent');
    const paymentIntent: string | null = JSON.parse(eShopPaymentIntent);

    // setCartProducts(cProducts);
    setPaymentIntent(paymentIntent);
  }, []);

  useEffect(() => {
    const getTotals = () => {
      if (cartProducts) {
        const { total, qty } = cartProducts?.reduce(
          (acc, item) => {
            const itemTotal = item.product.price * item.quantity;

            acc.total += itemTotal;
            acc.qty += item.quantity;

            return acc;
          },
          {
            total: 0,
            qty: 0,
          },
        );

        setCartTotalQty(qty);
        setCartTotalAmount(total);
      }
    };
    getTotals();
  }, [cartProducts]);

  const handleAddProductToCart = (product: CartProductType) => {
    // const handleAddToCart = async () => {
    //   if (!isDisabled) {
    //     setIsDisabled(true);
    //     const res = await axios.post(
    //       `http://localhost:8000/api/cart/add`,
    //       { productId: id, quantity: 1 },
    //       {
    //         headers: {
    //           Authorization: `Bearer ${jwt}`,
    //           'Content-Type': 'application/json',
    //         },
    //       },
    //     );
    //     if (res.status === 200) {
    //       setIsDisabled(false);
    //     } else {
    //       alert(`Error adding product to cart!`);
    //     }
    //   }
    // };
  };

  const handleRemoveProductFromCart = async (id: number) => {
    if (!isDisabled) {
      setIsDisabled(true);
      const res = await axios.delete(`http://localhost:8000/api/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionCookie}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        setIsDisabled(false);
        fetchCart();
      } else {
        alert(`Error adding product to cart!`);
      }
    }
  };

  const handleCartQtyIncrease = async (id: number) => {
    if (!isDisabled) {
      setIsDisabled(true);
      const res = await axios.patch(
        `http://localhost:8000/api/cart/increment/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionCookie}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (res.status === 200) {
        setIsDisabled(false);
        fetchCart();
      } else {
        alert(`Error adding product to cart!`);
      }
    }
  };

  const handleCartQtyDecrease = async (id: number) => {
    if (!isDisabled) {
      setIsDisabled(true);
      const res = await axios.patch(
        `http://localhost:8000/api/cart/decrement/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionCookie}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (res.status === 200) {
        setIsDisabled(false);
        fetchCart();
      } else {
        alert(`Error adding product to cart!`);
      }
    }
  };

  const handleClearCart = async () => {
    if (!isDisabled) {
      setIsDisabled(true);
      const res = await axios.delete(`http://localhost:8000/api/cart`, {
        headers: {
          Authorization: `Bearer ${sessionCookie}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        setCartProducts(null);
        setCartTotalQty(0);
        setIsDisabled(false);
      } else {
        alert(`Error adding product to cart!`);
      }
    }
  };

  const handleSetPaymentIntent = useCallback(
    (value: string | null) => {
      setPaymentIntent(value);
      localStorage.setItem('eShopPaymentIntent', JSON.stringify(value));
    },
    [paymentIntent],
  );

  const value = {
    cartTotalQty,
    cartTotalAmount,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart,
    paymentIntent,
    handleSetPaymentIntent,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error('useCart must be used within a CartContextProvider');
  }

  return context;
};
