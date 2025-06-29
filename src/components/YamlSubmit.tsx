import { Button, Loader, Tooltip } from '@mantine/core';
import { uploadYamlAsText } from '../api/uploadYaml';
import { useState } from 'react';
import { useAppContext } from '@/context/useAppContext.ts';
import { IconCpu } from '@tabler/icons-react';

export function YamlSubmit() {
  const { yamlContent } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      await uploadYamlAsText(yamlContent);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip
      label={error || (success ? 'Firmware generated successfully.' : '')}
      opened={!!error || success}
      color={error ? 'red' : 'green'}
      withArrow
    >
      <Button
        onClick={handleSubmit}
        disabled={!yamlContent || loading}
        leftSection={<IconCpu size={14} />}
      >
        {loading && <Loader size="xs" mr="xs" />}
        Generate firmware
      </Button>
    </Tooltip>
  );
}
