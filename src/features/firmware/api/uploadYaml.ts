import { apiFetch } from '@/shared/api/apiClient.ts';
import { defaultFirmwareOptions, getFirmwareFileName } from '@/constants/defaults.ts';
import i18n from 'i18next';

export async function compileYAMLAsync(yaml: string, email: string): Promise<Response> {
  const file = new File([yaml], getFirmwareFileName(defaultFirmwareOptions.isMax), {
    type: 'text/yaml',
  });
  const formData = new FormData();
  formData.append('file', file);
  formData.append('email', email);
  formData.append('language', i18n.language);

  const res = await apiFetch('/compile-async', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}`);
  }

  return res;
}
