import {useState} from 'react';
import '@mantine/core/styles.css';
import {
    Anchor,
    Box, Button,
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
import {IconInfoCircle, IconTestPipe2Filled, IconRadar} from '@tabler/icons-react';
import {CodeHighlight} from "@mantine/code-highlight";

type TiltState = {
    enabled: boolean;
    isPro: boolean;
};

type Tilts = {
    [key: string]: TiltState;
};

type TiltColor = typeof tiltColors[number];
type TiltColorKey = Lowercase<TiltColor>;

const tiltColors = ['Black', 'Blue', 'Green', 'Orange', 'Red', 'Yellow', 'Pink', 'Purple'];

const tiltColorsHex: Record<TiltColorKey, string> = {
    black: '#666666',
    blue: '#3498db',
    green: '#2ecc71',
    orange: '#e67e22',
    red: '#e74c3c',
    yellow: '#f1c40f',
    pink: '#e91e63',
    purple: '#9b59b6',
};


function App() {
    const [tilts, setTilts] = useState<Tilts>(
        tiltColors.reduce((acc, color) => {
            acc[color.toLowerCase()] = {enabled: false, isPro: false};
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
        const yaml = "esphome:\n" +
            "  name: tiltsense\n" +
            "  platform: ESP32\n" +
            "  board: esp32dev\n" +
            "\n" +
            "wifi:\n" +
            "  ssid: \"Your_SSID\"\n" +
            "  password: \"Your_WIFI_Password\"\n" +
            "\n" +
            "logger:\n" +
            "\n" +
            "api:\n" +
            "\n" +
            "ota:\n" +
            "\n" +
            "sensor:\n" +
            "  - platform: custom\n" +
            "    lambda: |-\n" +
            "      auto my_sensor = new TiltHydrometerSensor();\n" +
            "      App.register_component(my_sensor);\n" +
            "      return {my_sensor->temperature_sensor, my_sensor->gravity_sensor};\n" +
            "    sensors:\n" +
            "      name: \"Tilt Temperature - Red\"\n" +
            "      unit_of_measurement: \"°C\"\n" +
            "      accuracy_decimals: 1\n" +
            "\n" +
            "      name: \"Tilt Gravity - Red\"\n" +
            "      unit_of_measurement: \"SG\"\n" +
            "      accuracy_decimals: 3\n" +
            "\n" +
            "text_sensor:\n" +
            "  - platform: template\n" +
            "    name: \"Tilt Version - Red\"\n" +
            "    lambda: |-\n" +
            "      return \"Pro\";\n" +
            "\n" +
            "output:\n" +
            "  # If using a display or other output\n" +
            "\n" +
            "brewfather:\n" +
            "  enabled: true\n" +
            "  api_key: \"your-brewfather-api-key\"\n" +
            "\n" +
            "home_assistant:\n" +
            "  enabled: true";
        "sensor:\n" +
        "  - platform: custom\n" +
        "    lambda: |-\n" +
        "      auto my_sensor = new TiltHydrometerSensor();\n" +
        "      App.register_component(my_sensor);\n" +
        "      return {my_sensor->temperature_sensor, my_sensor->gravity_sensor};\n" +
        "    sensors:\n" +
        "      name: \"Tilt Temperature - Red\"\n" +
        "      unit_of_measurement: \"°C\"\n" +
        "      accuracy_decimals: 1\n" +
        "\n" +
        "      name: \"Tilt Gravity - Red\"\n" +
        "      unit_of_measurement: \"SG\"\n" +
        "      accuracy_decimals: 3\n" +
        "\n" +
        "text_sensor:\n" +
        "  - platform: template\n" +
        "    name: \"Tilt Version - Red\"\n" +
        "    lambda: |-\n" +
        "      return \"Pro\";\n" +
        "\n" +
        "output:\n" +
        "  # If using a display or other output\n" +
        "\n" +
        "brewfather:\n" +
        "  enabled: true\n" +
        "  api_key: \"your-brewfather-api-key\"\n" +
        "\n" +
        "home_assistant:\n" +
        "  enabled: true";
        setGeneratedYAML(yaml);
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
                <Stack mt="xl">
                    <Text>Specify which <strong>Tilt Hydrometers</strong> you have available, their colors, and whether
                        they are the Pro version.</Text>
                    {tiltColors.map((color) => {
                        const key = color.toLowerCase() as TiltColorKey;
                        return (
                            <Group key={key}>
                                <IconTestPipe2Filled size={24} color={tiltColorsHex[key]}/>
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
