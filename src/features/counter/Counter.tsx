import { useState } from "react";

import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount
} from "./counterSlice";
import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "store";

interface CounterProps {}

export const Counter: React.FC<CounterProps> = ({}) => {
  const count = useSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState("2");

  const incrementValue = Number(incrementAmount) || 0;

  return (
    <Box p={2} m={2}>
      <Box d="flex" justifyContent="center" alignItems="center">
        <Button
          px={4}
          mx={4}
          variant="outline"
          colorScheme="green"
          onClick={() => dispatch(decrement())}
        >
          -
        </Button>
        <Text fontSize="sm">{count}</Text>
        <Button
          px={4}
          mx={4}
          variant="outline"
          colorScheme="green"
          onClick={() => dispatch(increment())}
        >
          +
        </Button>
      </Box>
      <Box>
        <Input
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
          p={4}
          m={4}
        />
        <Box d="flex" justifyContent="center" alignItems="center">
          <Button
            px={4}
            mx={4}
            variant="solid"
            colorScheme="green"
            onClick={() => dispatch(incrementByAmount(incrementValue))}
          >
            Add Amount
          </Button>
          <Button
            px={4}
            mx={4}
            variant="solid"
            colorScheme="green"
            onClick={() => dispatch(incrementAsync(incrementValue))}
          >
            Add Async
          </Button>
          <Button
            px={4}
            mx={4}
            variant="solid"
            colorScheme="green"
            onClick={() => dispatch(incrementIfOdd(incrementValue))}
          >
            Add If Odd
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
