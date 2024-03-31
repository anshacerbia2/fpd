import { cookies } from 'next/headers';
import CartClient from './CartClient';
import Container from '@/components/Container';

const Cart = async () => {
  const sessionCookie: string | undefined = cookies().get('user-token')?.value;
  // const currentUser = await getCurrentUser()
  return (
    <div className="pt-8">
      <Container>
        <CartClient currentUser={sessionCookie} />
      </Container>
    </div>
  );
};

export default Cart;
