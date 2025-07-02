import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleDashed,
  IconCircleX,
} from '@tabler/icons-react';
import { Group, Text, Tooltip } from '@mantine/core';
import React from 'react';

type StatusItemProps = {
  label: string;
  checked?: boolean;
  error?: boolean;
  warning?: boolean;
  errorMessage?: string;
  warningMessage?: string;
  onClick?: () => void;
};

export const StatusItem: React.FC<StatusItemProps> = ({
  label,
  checked = false,
  error = false,
  warning = false,
  errorMessage,
  warningMessage,
  onClick,
}) => {
  let Icon = IconCircleDashed;
  let color = 'gray';
  let tooltip: string | null = null;

  if (error) {
    Icon = IconCircleX;
    color = 'red';
    tooltip = errorMessage || 'An error occurred';
  } else if (warning) {
    Icon = IconAlertTriangle;
    color = 'orange';
    tooltip = warningMessage || 'There is a warning';
  } else if (checked) {
    Icon = IconCircleCheck;
    color = 'lime';
  }

  const iconElement = <Icon size={20} color={color} />;

  return (
    <Group mt="md" gap="xs" onClick={onClick} style={{ cursor: 'pointer' }}>
      {tooltip ? (
        <Tooltip label={tooltip} withArrow color={color}>
          <span>{iconElement}</span>
        </Tooltip>
      ) : (
        iconElement
      )}
      <Text>{label}</Text>
    </Group>
  );
};
