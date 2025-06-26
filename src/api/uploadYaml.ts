import { apiFetch } from '@/api/api.ts';

export async function uploadYamlAsText(yaml: string): Promise<Response> {
  const file = new File([yaml], 'tiltsense.yaml', { type: 'text/yaml' });
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiFetch('/compile', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}`);
  }

  return res;
}
