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
import {type Tilt, TiltColorId, type TiltColorKey, TiltColors, TiltColorsHex, type Tilts} from './models/Tilt';
import tiltSenseTemplateYaml from './assets/tiltsense-template.yaml?raw'
import tiltSenseFirmwareTemplate from './assets/tiltsense-template.json'
import {showNotification} from '@mantine/notifications';


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

    const debugYAML2JSON = () => {
        const preprocessYaml = (yamlText: string) => {
            return yamlText
                .replace(/!lambda\s*\|-/g, '__LAMBDA_BLOCK__')
                .replace(/!\w+/g, '__TAG__');
        };

        const cleanedYaml = preprocessYaml(tiltSenseTemplateYaml);

        const parsed = yaml.load(cleanedYaml);
        console.log(parsed);
    }

    const handleGenerateYAML = () => {
        //TODO: This is only for debug purpose, remove after
        debugYAML2JSON();

        const enabledTilts = Object.values(tilts).filter(tilt => tilt.enabled);
        if (enabledTilts.length === 0) {
            showNotification({
                title: 'No Tilt selected',
                message: 'Please select at least one Tilt before generating the YAML.',
                color: 'red',
                autoClose: 4000,
                withCloseButton: true,
            });
            return;
        }

        //Here's where the big mess begins...

        console.log(enabledTilts);
        const tiltSenseGeneratedFirmware = JSON.parse(JSON.stringify(tiltSenseFirmwareTemplate));

        //BLE Advertise Code
        let onBLEAdvertiseCode = `
                 if (x.get_ibeacon().has_value()) {
      auto ibeacon = x.get_ibeacon().value();
      std::string uuid = ibeacon.get_uuid().to_string();
            `.trim();

        enabledTilts.forEach((tilt: Tilt) => {
            if (tilt.isPro) {
                onBLEAdvertiseCode = `
              ${onBLEAdvertiseCode}
      if (uuid == ${tilt.color.id}) {
        float temp_c = ((ibeacon.get_major() / 10.0f) - 32.0f) * 5.0f / 9.0f;
        float gravity = ibeacon.get_minor() / 10.0f;
        ESP_LOGD("tilt", "[${tilt.color.name}] Temperature = %.2f °C, Gravity = %.3f", temp_c, gravity);
        id(tilt_temperature_${tilt.color.colorKey}).publish_state(temp_c);
      }
             `.trim();
            } else {
                onBLEAdvertiseCode = `
              ${onBLEAdvertiseCode}
      if (uuid == ${tilt.color.id}) {
        float temp_c = (ibeacon.get_major() - 32) * 5.0f / 9.0f;
        float gravity = ibeacon.get_minor();
        ESP_LOGD("tilt", "[${tilt.color.name}] Temperature = %.2f °C, Gravity = %.3f", temp_c, gravity);
        id(tilt_temperature_${tilt.color.colorKey}).publish_state(temp_c);
      }
             `.trim();
            }

            //Sensor management for each Tilt
            //Gravity
            tiltSenseGeneratedFirmware.sensor.push(
                {
                    "platform": "template",
                    "id": `tilt_gravity_${tilt.color.colorKey}`,
                    "name": `Tilt ${tilt.color.name} Gravity`,
                    "icon": "mdi:trending-down",
                    "accuracy_decimals": 0,
                    "unit_of_measurement": "SG",
                    "update_interval": "never",
                    "on_value": {
                        "then": [
                            {
                                "lvgl.label.update": {
                                    "id": `ble_gravity_label_${tilt.color.colorKey}`,
                                    "text": `__LAMBDA_BLOCK__
      char buffer[8];
      snprintf(buffer, sizeof(buffer), "%.3f", id(tilt_gravity_${tilt.color.colorKey}).state / 1000.0);
      return std::string(buffer);`
                                }
                            }
                        ]
                    }
                }
            );
            //Temperature
            tiltSenseGeneratedFirmware.sensor.push({
                "platform": "template",
                "name": `Tilt ${tilt.color.name} Temperature`,
                "id": `tilt_temperature_${tilt.color.colorKey}`,
                "device_class": "temperature",
                "accuracy_decimals": 1,
                "unit_of_measurement": "°C",
                "update_interval": "never",
                "on_value": {
                    "then": [
                        {
                            "lvgl.label.update": {
                                "id": `ble_temp_label_${tilt.color.colorKey}`,
                                "text": `__LAMBDA_BLOCK__ char buffer[10]; snprintf(buffer, sizeof(buffer), \"%.1f °C\", id(tilt_temperature_${tilt.color.colorKey}).state); return std::string(buffer);`
                            }
                        }
                    ]
                }
            });

            //LVGL page management for each Tilt
            tiltSenseGeneratedFirmware.lvgl.pages.push(
                {
                    "id": `display_${tilt.color.colorKey}`,
                    "widgets": [
                        {
                            "arc": {
                                "id": `border_circle_${tilt.color.colorKey}`,
                                "align": "CENTER",
                                "arc_color": `__LAMBDA_BLOCK__
                          if (id(enable_tilt_${tilt.color.colorKey})) { 
                            return lv_color_hex(${tilt.color.hexColor}); 
                          } else { 
                            return lv_color_hex(0x808080); 
                          }`,
                                "arc_rounded": true,
                                "arc_width": 20,
                                "width": 220,
                                "height": 220
                            }
                        },
                        {
                            "label": {
                                "id": `ble_gravity_label_${tilt.color.colorKey}`,
                                "align": "CENTER",
                                "text": " ",
                                "text_font": "montserrat_48",
                                "y": -35
                            }
                        },
                        {
                            "label": {
                                "id": `ble_temp_label_${tilt.color.colorKey}`,
                                "align": "CENTER",
                                "text": " ",
                                "text_font": "montserrat_26",
                                "y": 10
                            }
                        },
                        {
                            "label": {
                                "id": `pressure_label_${tilt.color.colorKey}`,
                                "align": "CENTER",
                                "text": " ",
                                "text_font": "montserrat_20",
                                "text_color": 7368816,
                                "y": 60
                            }
                        },
                        {
                            "label": {
                                "align": "CENTER",
                                "text": `Tilt ${tilt.color.name}`,
                                "text_font": "montserrat_16",
                                "y": 90
                            }
                        }
                    ]
                }
            );
        });

        onBLEAdvertiseCode = `
              ${onBLEAdvertiseCode}
  }
}`.trim();
        tiltSenseGeneratedFirmware.esp32_ble_tracker.on_ble_advertise.then.push({"lambda": onBLEAdvertiseCode});

        const tiltSenseGeneratedFirmwareYAML = yaml.dump(tiltSenseGeneratedFirmware).replace(
            /^(\s*\w+):\s*\|-\n\s*__LAMBDA_BLOCK__\n/gm,
            '$1: !lambda |-\n'
        );
        setGeneratedYAML(tiltSenseGeneratedFirmwareYAML);
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
                    <CodeHighlight
                        code={generatedYAML}
                        language="yaml"
                        withCopyButton
                        radius="sm"
                    />
                )}
            </Box>
        </MantineProvider>
    )
}

export default App
