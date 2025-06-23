import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';
import pkg from './package.json' assert {type: 'json'};

export default defineConfig({
    base: '/tiltsense-yaml-generator/',
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
    },
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version), // <- define variable global
    },
})
