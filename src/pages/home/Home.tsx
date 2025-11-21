import { useColorMode } from '@/components/ui/color-mode';
import { endpoints } from '@/lib';
import { Button } from '@chakra-ui/react';
const HomePage = () => {
  const { toggleColorMode } = useColorMode();
  const handleGet = async () => {
    try {
      const response = await endpoints.lottery.get();
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      console.log('Ничего');
    }
  };
  return (
    <div>
      <Button
        variant="outline"
        onClick={() => {
          handleGet(), toggleColorMode();
        }}
      >
        Изменить
      </Button>
    </div>
  );
};

export default HomePage;
