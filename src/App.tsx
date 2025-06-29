import '@mantine/core/styles.css';
import AppFooter from '@/components/Footer';
import { Intro } from '@/components/Intro';
import { ConfigurationForm } from '@/components/configuration/ConfigurationForm';
import { FirmwareGeneration } from '@/components/firmware/FirmwareGeneration';

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
