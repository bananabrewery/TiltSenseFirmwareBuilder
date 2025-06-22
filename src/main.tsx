import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {createTheme, MantineProvider} from '@mantine/core';
import {Notifications} from "@mantine/notifications";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const theme = createTheme({});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <Notifications position="top-right"/>
            <App/>
        </MantineProvider>
    </StrictMode>,
)