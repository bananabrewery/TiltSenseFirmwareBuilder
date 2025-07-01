import { IconCircleCheck, IconCircleDashed } from '@tabler/icons-react';
import { Group, Text } from '@mantine/core';
import React from 'react';

type StatusItemProps = {
  label: string;
  checked: boolean;
};

export const StatusItem: React.FC<StatusItemProps> = ({ label, checked }) => {
  const Icon = checked ? IconCircleCheck : IconCircleDashed;

  return (
    <Group mt="md" gap="xs">
      <Icon size={20} color={checked ? 'lime' : 'gray'} />
      <Text>{label}</Text>
    </Group>
  );
};
