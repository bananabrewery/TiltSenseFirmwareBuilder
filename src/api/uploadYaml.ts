import { apiFetch } from '@/api/api';
import { defaultFirmwareOptions } from '@/constants/defaults';
import i18n from 'i18next';

export async function compileYAML(yaml: string): Promise<Response> {
  const file = new File([yaml], defaultFirmwareOptions.fileName, { type: 'text/yaml' });
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiFetch('/compile', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'firmware.factory.bin';
  a.click();

  return res;
}

export async function compileYAMLAsync(yaml: string, email: string): Promise<Response> {
  const file = new File([yaml], defaultFirmwareOptions.fileName, { type: 'text/yaml' });
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
