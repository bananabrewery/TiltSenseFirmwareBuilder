import React from 'react';
import { Container, Group } from '@mantine/core';
import { YamlSubmit } from '@/components/firmware/YamlSubmit';
import { FirmwareStepper } from '@/components/firmware/FirmwareStepper.tsx';

export const FirmwareGeneration: React.FC = () => {
  return (
    <>
      <Container fluid mt="xl" px="xl">
        <FirmwareStepper />
        <Group justify="center" mb="md">
          <YamlSubmit />
        </Group>
      </Container>
    </>
  );
};
