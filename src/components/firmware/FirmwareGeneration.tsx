import React from 'react';
import { Container, Group } from '@mantine/core';
import { YamlSubmit } from '@/components/firmware/YamlSubmit';

export const FirmwareGeneration: React.FC = () => {
  return (
    <>
      <Container fluid mt="xl" px="xl">
        <Group justify="center" mb="md">
          <YamlSubmit />
        </Group>
      </Container>
    </>
  );
};
