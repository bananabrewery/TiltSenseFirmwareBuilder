import { apiFetch } from '@/api/api.ts';

export async function uploadYamlAsText(yaml: string): Promise<Response> {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const file = new File([yaml], 'tiltsense.yaml', { type: 'text/yaml' });
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiFetch('/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/yaml',
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}`);
  }

  return res;
}
