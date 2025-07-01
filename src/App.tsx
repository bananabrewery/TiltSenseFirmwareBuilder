import '@mantine/core/styles.css';
import AppFooter from '@/components/Footer';
import { Intro } from '@/components/Intro';
import { FirmwareGeneration } from '@/components/firmware/FirmwareGeneration';
import { ProcessStepper } from '@/components/stepper/ProcessStepper.tsx';

function App() {
  return (
    <>
      <Intro />
      <ProcessStepper />
      <FirmwareGeneration />
      <AppFooter />
    </>
  );
}

export default App;
