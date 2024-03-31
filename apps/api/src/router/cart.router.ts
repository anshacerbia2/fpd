import authMiddleware from '@/middleware/auth.middleware';
import prisma from '@/prisma';
import { Router } from 'express';

const cartRouter: Router = Router();

cartRouter.use(authMiddleware);
cartRouter.get('/', async (req, res) => {
  try {
    const { id } = req.body;
    const cart = await prisma.cart.findMany({
      where: {
        userId: id,
      },
      include: {
        product: { include: { image: true } }, // Include product information
      },
    });
    res.status(200).json(cart);
  } catch (error) {}
});

cartRouter.post('/add', async (req, res, next) => {
  try {
    const { id: userId, productId, quantity } = req.body;

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw { status: 400 };
    }

    const cartItem = await prisma.cart.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (!cartItem) {
      if (product.stock < quantity) throw { status: 400 };
      const cartItem = await prisma.cart.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });
      res.status(200).json(cartItem);
    } else {
      const updatedCartItem = await prisma.cart.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity:
            cartItem.quantity + quantity < product.stock
              ? cartItem.quantity + quantity
              : cartItem.quantity,
        },
      });
      res.status(200).json(updatedCartItem);
    }
  } catch (error) {
    next(error);
  }
});

cartRouter.patch('/increment/:cartId', async (req, res, next) => {
  try {
    const { cartId } = req.params;
    console.log(cartId, '>>>>>>>>>');

    const cartItem = await prisma.cart.findUnique({
      where: {
        id: +cartId,
      },
    });

    if (!cartItem) throw { status: 400 };

    const product = await prisma.product.findUnique({
      where: {
        id: cartItem.productId,
      },
    });

    if (!product) throw { status: 400 };
    if (cartItem.quantity + 1 > product.stock) throw { status: 400 };

    const updatedCartItem = await prisma.cart.update({
      where: {
        id: +cartId,
      },
      data: {
        quantity: cartItem.quantity + 1,
      },
    });

    res.status(200).json(updatedCartItem);
  } catch (error) {
    next(error);
  }
});

cartRouter.patch('/decrement/:cartId', async (req, res, next) => {
  try {
    const { cartId } = req.params;

    const cartItem = await prisma.cart.findUnique({
      where: {
        id: +cartId,
      },
    });

    if (!cartItem) throw { status: 400 };

    const product = await prisma.product.findUnique({
      where: {
        id: cartItem.productId,
      },
    });

    if (!product || product.stock < 1) throw { status: 400 };
    if (cartItem.quantity - 1 < 0) {
      const deleteCart = await prisma.cart.delete({
        where: {
          id: +cartId,
        },
      });
      res.status(200).json(deleteCart);
    } else {
      const updatedCartItem = await prisma.cart.update({
        where: {
          id: +cartId,
        },
        data: {
          quantity: cartItem.quantity - 1,
        },
      });

      res.status(200).json(updatedCartItem);
    }
  } catch (error) {
    next(error);
  }
});

cartRouter.delete('/:cartId', async (req, res, next) => {
  try {
    const { cartId } = req.params;
    console.log(cartId);

    const cartItem = await prisma.cart.delete({
      where: {
        id: +cartId,
      },
    });

    res.status(200).json(cartItem);
  } catch (error) {
    next(error);
  }
});

cartRouter.delete('/', async (req, res, next) => {
  try {
    const { id: userId } = req.body;

    const listCart = await prisma.cart.findMany({ where: { userId } });
    const arrId = listCart.map((v) => v.id);
    const cartItem = await prisma.cart.deleteMany({
      where: {
        id: { in: arrId },
      },
    });

    res.status(200).json(cartItem);
  } catch (error) {
    next(error);
  }
});

export default cartRouter;
