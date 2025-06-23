import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';
import fs from 'fs';

const pkg: { version: string } = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

export default defineConfig({
    base: '/tiltsense-yaml-generator/',
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
    },
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version),
    },
})
