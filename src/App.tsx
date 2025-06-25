import '@mantine/core/styles.css';
import AppFooter from '@/components/Footer';
import { Intro } from '@/components/Intro';
import { ConfigurationForm } from '@/components/ConfigurationForm';
import { FirmwareGeneration } from '@/components/FirmwareGeneration';

function App() {
  return (
    <>
      <Intro />
      <ConfigurationForm />
      <FirmwareGeneration />
      <AppFooter />
    </>
  );
}

export default App;
