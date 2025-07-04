import '@mantine/core/styles.css';
import AppFooter from '@/components/Footer.tsx';
import { Intro } from '@/components/Intro.tsx';
import { ProcessStepper } from '@/features/configuration/components/stepper/ProcessStepper.tsx';

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
