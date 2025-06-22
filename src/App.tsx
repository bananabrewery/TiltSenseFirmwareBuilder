import {useState} from 'react';
import '@mantine/core/styles.css';
import {
    Anchor,
    Box,
    Button,
    Center,
    Checkbox,
    Container,
    Group,
    List,
    MantineProvider,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
    Tooltip
} from '@mantine/core';
import {IconInfoCircle, IconRadar, IconTestPipe2Filled} from '@tabler/icons-react';
import {
    type Tilt,
    TiltColorId,
    type TiltColorKey,
    TiltColors,
    TiltColorsDisplay,
    TiltColorsHex,
    type Tilts
} from './models/tilt.ts';
import {showNotification} from '@mantine/notifications';
import {generateFirmwareConfig} from "./generators/generateFirmware.ts";
import {YamlViewer} from "./components/YamlViewer.tsx";

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
                    displayColor: TiltColorsDisplay[colorKey],
                    id: TiltColorId[colorKey],
                }
            };
            return acc;
        }, {} as Tilts)
    );

    const [brewfatherConfig, setBrewfatherConfig] = useState({
        enabled: false,
        apiKey: '',
    });

    const [wifiConfig, setWifiConfig] = useState({
        SSID: '',
        password: '',
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
        if (brewfatherConfig.enabled && (!brewfatherConfig.apiKey || brewfatherConfig.apiKey.trim() === '')) {
            showNotification({
                title: 'Missing Brewfather API Key',
                message: 'You enabled Brewfather integration but did not provide an API key.',
                color: 'red',
                autoClose: 4000,
                withCloseButton: true,
            });
            return;
        }

        if (brewfatherConfig.enabled && (!wifiConfig.SSID || !wifiConfig.password)) {
            showNotification({
                title: 'Missing Wi-Fi configuration',
                message: 'You enabled Brewfather integration but did not provide Wi-Fi credentials.',
                color: 'yellow',
                autoClose: 4000,
                withCloseButton: true,
            });
            return;
        }

        const enabledTilts = Object.values(tilts).filter(tilt => tilt.enabled);
        const tiltSenseGeneratedFirmware = generateFirmwareConfig(enabledTilts, {
            brewfather: brewfatherConfig,
            ha: homeAssistantEnabled,
            wifiConfig: wifiConfig
        });
        setGeneratedYAML(tiltSenseGeneratedFirmware);
    };

    const hasAnyTiltSelected = () => {
        try {
            if (!tilts || typeof tilts !== 'object') return false;
            return Object.values(tilts).some(
                (tilt: Tilt) => tilt?.enabled === true
            );
        } catch {
            return false;
        }
    };

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
                <Title order={4} mt="lg" mb="md">
                    Welcome to the TiltSense dynamic ESPHome YAML generator
                </Title>

                <Text mb="md">
                    This tool helps you generate a fully customized ESPHome configuration based on your specific setup
                    and preferences.
                </Text>

                <Text mb="md">With TiltSense, you can easily:</Text>

                <List spacing="md" withPadding>
                    <List.Item>Select one or multiple Tilt hydrometers</List.Item>
                    <List.Item>Configure each Tilt individually by color</List.Item>
                    <List.Item>Specify whether each device is a Tilt Pro</List.Item>
                    <List.Item>Enable integration with <strong>Brewfather</strong> for fermentation tracking</List.Item>
                    <List.Item>Enable integration with <strong>Home Assistant</strong> for home automation</List.Item>
                    <List.Item>Add configuration for a <strong>pressure sensor</strong> if available</List.Item>
                </List>

                <Text mt="md">
                    All selected options will be used to generate a tailored YAML file that you can copy or download for
                    your ESPHome device configuration.
                </Text>
                <Title order={4} mt="xl" mb="md">
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
                        <Text>Please add the following <strong>Wi-Fi configuration</strong>.</Text>
                        <Text mt="xs" c="dimmed">If you plan to use your TiltSense without connectivity, you can skip
                            these fields.</Text>
                        <TextInput
                            style={{maxWidth: '350px'}}
                            mt="md"
                            label="Wi-Fi SSID"
                            placeholder="Enter network name"
                            value={wifiConfig.SSID}
                            onChange={(event) =>
                                setWifiConfig({...wifiConfig, SSID: event.currentTarget.value})
                            }
                        />

                        <PasswordInput
                            style={{maxWidth: '350px'}}
                            label="Wi-Fi Password"
                            placeholder="Enter password"
                            mt="md"
                            value={wifiConfig.password}
                            onChange={(event) =>
                                setWifiConfig({...wifiConfig, password: event.currentTarget.value})
                            }
                        />
                    </Box>
                    <Box mt="xl">
                        <Text>Are you going to use TiltSense to send Tilt data (temperature and gravity)
                            to <strong>Brewfather</strong>?</Text>
                        <Checkbox
                            label="Enable Brewfather Integration"
                            checked={brewfatherConfig.enabled}
                            onChange={handleBrewfatherToggle}
                            mt="md"
                        />
                        {brewfatherConfig.enabled && (
                            <TextInput
                                style={{maxWidth: '350px'}}
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
                                mt="md"
                            />
                        )}
                    </Box>
                    <Box mt="xl">
                        <Text>Do you plan to monitor your TiltSense data with <strong>Home Assistant</strong>?</Text>
                        <Checkbox
                            label="Enable Home Assistant Integration"
                            checked={homeAssistantEnabled}
                            onChange={(event) => setHomeAssistantEnabled(event.currentTarget.checked)}
                            mt="md"
                        />
                    </Box>
                </Stack>
            </Box>
            <Container fluid mt="xl" px="xl">
                <Group justify="center" mb="md">
                    <Tooltip
                        label="You must select at least one tilt"
                        disabled={hasAnyTiltSelected()}>
                        <Button
                            onClick={handleGenerateYAML}
                            disabled={!hasAnyTiltSelected()}>
                            Generate YAML
                        </Button>
                    </Tooltip>
                </Group>

                {generatedYAML && (
                    <YamlViewer
                        code={generatedYAML}
                    />
                )}
            </Container>
        </MantineProvider>
    )
}

export default App
