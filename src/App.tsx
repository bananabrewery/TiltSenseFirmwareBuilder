import '@mantine/core/styles.css';
import AppFooter from '@/components/Footer';
import { Intro } from '@/components/Intro';
import { ProcessStepper } from '@/components/stepper/ProcessStepper';

function App() {
  return (
    <>
      <Intro />
      <ProcessStepper />
      <AppFooter />
    </>
  );
}

export default App;
