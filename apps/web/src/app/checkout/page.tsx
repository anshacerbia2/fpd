import Container from '@/components/Container';
import CheckoutClient from './CheckoutClient';
import FormWrap from './FormWrap';

const Checkout = () => {
  return (
    <div className="p-8">
      <Container>
        <FormWrap>
          <CheckoutClient />
        </FormWrap>
      </Container>
    </div>
  );
};

export default Checkout;
