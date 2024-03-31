import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';

interface ProductCardProps {
  name: string;
  id: number;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  jwt: string;
}

function ProductCard({
  name,
  id,
  description,
  price,
  imageUrl,
  stock,
  jwt,
}: ProductCardProps) {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleAddToCart = async () => {
    if (!isDisabled) {
      setIsDisabled(true);
      const res = await axios.post(
        `http://localhost:8000/api/cart/add`,
        { productId: id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (res.status === 200) {
        setIsDisabled(false);
      } else {
        alert(`Error adding product to cart!`);
      }
    }
  };

  return (
    <>
      <Card
        maxW="200px"
        maxH="sm"
        variant={'elevated'}
        border={'2px'}
        borderColor={'#4CAF50'}
      >
        <CardBody overflow={'hidden'}>
          <Center>
            <Image
              src={imageUrl}
              alt={name}
              borderRadius="lg"
              w={'100px'}
              h={'100px'}
            />
          </Center>
          <Stack mt="6" spacing="3">
            <Heading size="sm">{name}</Heading>
            <Text fontSize={'xs'} noOfLines={3}>
              {description}
            </Text>
            <Text color="blue.600" fontSize="xl">
              {price}
            </Text>
            <Text fontSize="xs">Qty: {stock}</Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing="2">
            <Button variant="solid" colorScheme="blue">
              Detail
            </Button>
            {jwt && (
              <Button
                variant="solid"
                colorScheme="blue"
                onClick={handleAddToCart}
              >
                Add to cart
              </Button>
            )}
          </ButtonGroup>
        </CardFooter>
      </Card>
    </>
  );
}

export default ProductCard;
