import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {createTheme, MantineProvider} from '@mantine/core';
import {CodeHighlightAdapterProvider, createHighlightJsAdapter} from '@mantine/code-highlight';
import hljs from 'highlight.js/lib/core';
import yamlLang from 'highlight.js/lib/languages/yaml';

hljs.registerLanguage('yaml', yamlLang);


const highlightJsAdapter = createHighlightJsAdapter(hljs);


const theme = createTheme({});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <CodeHighlightAdapterProvider adapter={highlightJsAdapter}>
                <App/>
            </CodeHighlightAdapterProvider>
        </MantineProvider>
    </StrictMode>,
)