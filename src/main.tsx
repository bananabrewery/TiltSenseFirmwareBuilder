import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {createTheme, MantineProvider} from '@mantine/core';
import {CodeHighlightAdapterProvider, createHighlightJsAdapter} from '@mantine/code-highlight';
import hljs from 'highlight.js/lib/core';
import yamlLang from 'highlight.js/lib/languages/yaml';
import {Notifications} from "@mantine/notifications";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

hljs.registerLanguage('yaml', yamlLang);
const highlightJsAdapter = createHighlightJsAdapter(hljs);
const theme = createTheme({});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <CodeHighlightAdapterProvider adapter={highlightJsAdapter}>
                <Notifications position="top-right"/>
                <App/>
            </CodeHighlightAdapterProvider>
        </MantineProvider>
    </StrictMode>,
)