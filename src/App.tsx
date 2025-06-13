import {useState} from 'react';
import '@mantine/core/styles.css';
import {
    Anchor,
    Box,
    Button,
    Center,
    Checkbox,
    Group,
    List,
    MantineProvider,
    Stack,
    Text,
    TextInput,
    Title
} from '@mantine/core';
import {IconInfoCircle, IconRadar, IconTestPipe2Filled} from '@tabler/icons-react';
import {CodeHighlight} from "@mantine/code-highlight";
import yaml from "js-yaml";
import {type TiltColorKey, TiltColors, TiltColorsHex, type Tilts,} from './models/Tilt';
import tiltSenseTemplateYaml from './assets/tiltsense-template.yaml?raw'


function App() {
    const [tilts, setTilts] = useState<Tilts>(
        TiltColors.reduce((acc, name) => {
            const colorKey = name.toLowerCase() as TiltColorKey;
            acc[colorKey] = {
                enabled: false,
                isPro: false,
                color: {
                    name: name,
                    colorKey: colorKey,
                    hexColor: TiltColorsHex[colorKey],
                }
            };
            return acc;
        }, {} as Tilts)
    );

    const [brewfatherConfig, setBrewfatherConfig] = useState({
        enabled: false,
        apiKey: '',
    });

    const [homeAssistantEnabled, setHomeAssistantEnabled] = useState(false);
    const [generatedYAML, setGeneratedYAML] = useState('');

    const toggleTilt = (color: string) => {
        setTilts((prev) => ({
            ...prev,
            [color]: {
                ...prev[color],
                enabled: !prev[color].enabled,
                isPro: prev[color].enabled ? false : prev[color].isPro,
            },
        }));
    };

    const togglePro = (color: string) => {
        setTilts((prev) => ({
            ...prev,
            [color]: {
                ...prev[color],
                isPro: !prev[color].isPro,
            },
        }));
    };

    const handleBrewfatherToggle = () => {
        setBrewfatherConfig((prev) => ({
            ...prev,
            enabled: !prev.enabled,
            apiKey: !prev.enabled ? prev.apiKey : '', // clear API key when disabling
        }));
    };

    const handleBrewfatherKeyChange = (value: string) => {
        setBrewfatherConfig((prev) => ({
            ...prev,
            apiKey: value,
        }));
    };

    const handleGenerateYAML = () => {
        let generatedYAML = yaml.load(tiltSenseTemplateYaml);
        setGeneratedYAML(yaml.dump(generatedYAML));
    };

    function downloadYAML(content: string, filename = 'tiltsense.yaml') {
        const blob = new Blob([content], {type: 'text/yaml'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <MantineProvider>
            <Box style={{padding: 32}}>
                <Center>
                    <div style={{textAlign: 'center'}}>
                        <IconRadar size={64}/>
                        <Title order={1}>TiltSense</Title>
                        <Title order={3} mt="md">ESPHome YAML Generator</Title>
                    </div>
                </Center>
                <Title order={4} mt="lg" mb="sm">
                    Welcome to the TiltSense dynamic ESPHome YAML generator
                </Title>

                <Text mb="sm">
                    This tool helps you generate a fully customized ESPHome configuration based on your specific setup
                    and preferences.
                </Text>

                <Text mb="sm">With TiltSense, you can easily:</Text>

                <List spacing="xs" withPadding>
                    <List.Item>Select one or multiple Tilt hydrometers</List.Item>
                    <List.Item>Configure each Tilt individually by color</List.Item>
                    <List.Item>Specify whether each device is a Tilt Pro</List.Item>
                    <List.Item>Enable integration with <strong>Brewfather</strong> for fermentation tracking</List.Item>
                    <List.Item>Enable integration with <strong>Home Assistant</strong> for home automation</List.Item>
                    <List.Item>Add configuration for a <strong>pressure sensor</strong> if available</List.Item>
                </List>

                <Text mt="sm">
                    All selected options will be used to generate a tailored YAML file that you can copy or download for
                    your ESPHome device configuration.
                </Text>
                <Title order={4} mt="xl" mb="sm">
                    Let's start
                </Title>
                <Stack>
                    <Text>Specify which <strong>Tilt Hydrometers</strong> you have available, their colors, and whether
                        they are the Pro version.</Text>
                    {TiltColors.map((color) => {
                        const key = color.toLowerCase() as TiltColorKey;
                        return (
                            <Group key={key}>
                                <IconTestPipe2Filled size={24} color={TiltColorsHex[key]}/>
                                <Checkbox
                                    label={color}
                                    checked={tilts[key].enabled}
                                    onChange={() => toggleTilt(key)}
                                />
                                {tilts[key].enabled && (
                                    <Checkbox
                                        label="Pro"
                                        checked={tilts[key].isPro}
                                        onChange={() => togglePro(key)}
                                    />
                                )}
                            </Group>
                        );
                    })}
                    <Box mt="xl">
                        <Text>Are you going to use TiltSense to send Tilt data (temperature and gravity)
                            to <strong>Brewfather</strong>?</Text>
                        <Checkbox
                            label="Enable Brewfather Integration"
                            checked={brewfatherConfig.enabled}
                            onChange={handleBrewfatherToggle}
                            mt="sm"
                        />
                        {brewfatherConfig.enabled && (
                            <TextInput
                                label={
                                    <Group gap={4}>
                                        <span>Brewfather Key</span>
                                        <Anchor
                                            href="https://docs.brewfather.app/integrations/custom-stream"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            underline="hover"
                                            size="xs"
                                            c="dimmed"
                                        >
                                            <IconInfoCircle size={16}/>
                                        </Anchor>
                                    </Group>
                                }
                                labelProps={{style: {marginBottom: '10px'}}}
                                placeholder="Enter your Brewfather API Key"
                                value={brewfatherConfig.apiKey}
                                onChange={(event) => handleBrewfatherKeyChange(event.currentTarget.value)}
                                mt="sm"
                            />
                        )}
                    </Box>
                    <Box mt="xl">
                        <Text>Do you plan to monitor your TiltSense data with <strong>Home Assistant</strong>?</Text>
                        <Checkbox
                            label="Enable Home Assistant Integration"
                            checked={homeAssistantEnabled}
                            onChange={(event) => setHomeAssistantEnabled(event.currentTarget.checked)}
                            mt="sm"
                        />
                    </Box>
                </Stack>
            </Box>
            <Box w="calc(100vw - 200px)" mx="auto" mt="lg">
                <Group justify="center" mb="md">
                    <Button onClick={handleGenerateYAML}>Generate YAML</Button>
                    {generatedYAML && (
                        <Button variant="light" onClick={() => downloadYAML(generatedYAML)}>
                            Download YAML
                        </Button>
                    )}
                </Group>

                {generatedYAML && (
                    <Box
                        style={{
                            overflowY: 'auto',
                            minHeight: '500px',
                            maxHeight: 'calc(20vh - 200px)', // Ajusta según tu layout
                            borderRadius: 'var(--mantine-radius-sm)',
                            border: '1px solid var(--mantine-color-gray-3)',
                            padding: '1rem',
                            backgroundColor: '#0d1117',
                        }}
                    >
                        <CodeHighlight
                            code={generatedYAML}
                            language="yaml"
                            withCopyButton
                            radius="sm"
                        />
                    </Box>
                )}
            </Box>
        </MantineProvider>
    )
}

export default App
