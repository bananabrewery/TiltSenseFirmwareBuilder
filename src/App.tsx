import {useEffect, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
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
} from '@/models/tilt.ts';
import {showNotification} from '@mantine/notifications';
import {generateFirmwareConfig} from "@/generators/generateFirmware.ts";
import {YamlViewer} from "@/components/YamlViewer.tsx";
import AppFooter from "@/components/Footer.tsx";

function App() {
    const {t} = useTranslation();

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
                title: t('notifications.error.brewfather.title'),
                message: t('notifications.error.brewfather.message'),
                color: 'red',
                autoClose: 4000,
                withCloseButton: true,
            });
            return;
        }

        if (brewfatherConfig.enabled && (!wifiConfig.SSID || !wifiConfig.password)) {
            showNotification({
                title: t('notifications.warning.brewfather.title'),
                message: t('notifications.warning.brewfather.message'),
                color: 'yellow',
                autoClose: 4000,
                withCloseButton: true,
            });
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

    const [showWifiPasswordTooltip, setShowWifiPasswordTooltip] = useState(false);

    useEffect(() => {
        const shouldShow = wifiConfig.password.length < 8 && wifiConfig.password.length > 0;

        const timeout = setTimeout(() => {
            setShowWifiPasswordTooltip(shouldShow);
        }, 500);

        return () => clearTimeout(timeout);
    }, [wifiConfig.password]);

    return (
        <MantineProvider>
            <Box style={{padding: 32}}>
                <Center>
                    <div style={{textAlign: 'center'}}>
                        <IconRadar size={64}/>
                        <Title order={1}>{t('tiltSense')}</Title>
                        <Title order={3} mt="md">{t('subTitle')}</Title>
                    </div>
                </Center>

                <Title order={4} mt="lg" mb="md">
                    {t('welcome')}
                </Title>

                <Text mb="md">
                    {t('introduction.text')}
                </Text>

                <Text mb="md">
                    {t('introduction.capabilities.init')}
                </Text>

                <List spacing="md" withPadding>
                    <List.Item>
                        <Trans i18nKey="introduction.capabilities.1" components={{strong: <strong/>}}/>
                    </List.Item>
                    <List.Item>
                        <Trans i18nKey="introduction.capabilities.2" components={{strong: <strong/>}}/>
                    </List.Item>
                    <List.Item>
                        <Trans i18nKey="introduction.capabilities.3" components={{strong: <strong/>}}/>
                    </List.Item>
                    <List.Item>
                        <Trans i18nKey="introduction.capabilities.4" components={{strong: <strong/>}}/>
                    </List.Item>
                    <List.Item>
                        <Trans i18nKey="introduction.capabilities.5" components={{strong: <strong/>}}/>
                    </List.Item>
                    <List.Item>
                        <Trans i18nKey="introduction.capabilities.6" components={{strong: <strong/>}}/>
                    </List.Item>
                </List>

                <Text mt="md">
                    {t('introduction.capabilities.end')}
                </Text>

                <Title order={4} mt="xl" mb="md">
                    Let's start
                </Title>

                <Stack>
                    <Text>
                        <Trans i18nKey="configuration.tilt.init" components={{strong: <strong/>}}/>
                    </Text>
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
                        <Text>
                            <Trans i18nKey="configuration.wifi.init" components={{strong: <strong/>}}/>
                        </Text>
                        <Text mt="xs" c="dimmed">
                            {t('configuration.wifi.subinit')}
                        </Text>
                        <TextInput
                            style={{maxWidth: '350px'}}
                            mt="md"
                            label={t('configuration.wifi.fields.SSID.label')}
                            placeholder={t('configuration.wifi.fields.SSID.placeholder')}
                            value={wifiConfig.SSID}
                            onChange={(event) =>
                                setWifiConfig({...wifiConfig, SSID: event.currentTarget.value})
                            }
                        />
                        <Tooltip
                            label={t('configuration.wifi.fields.password.validationMessage')}
                            opened={showWifiPasswordTooltip}
                            color="red">
                            <PasswordInput
                                style={{maxWidth: '350px'}}
                                label={t('configuration.wifi.fields.password.label')}
                                placeholder={t('configuration.wifi.fields.password.placeholder')}
                                mt="md"
                                value={wifiConfig.password}
                                onChange={(event) =>
                                    setWifiConfig({...wifiConfig, password: event.currentTarget.value})
                                }
                            />
                        </Tooltip>
                    </Box>
                    <Box mt="xl">
                        <Text>
                            <Trans i18nKey="configuration.brewfather.init" components={{strong: <strong/>}}/>
                        </Text>
                        <Checkbox
                            label={t('configuration.brewfather.fields.enable.label')}
                            checked={brewfatherConfig.enabled}
                            onChange={handleBrewfatherToggle}
                            mt="md"
                        />
                        {brewfatherConfig.enabled && (
                            <TextInput
                                style={{maxWidth: '350px'}}
                                label={
                                    <Group gap={4}>
                                        <Trans i18nKey="configuration.brewfather.fields.key.label"
                                               components={{span: <span/>}}/>
                                        <Anchor
                                            href="https://docs.brewfather.app/integrations/custom-stream"
                                            target="_blank"
                                            size="xs"
                                            c="dimmed"
                                        >
                                            <IconInfoCircle size={16}/>
                                        </Anchor>
                                    </Group>
                                }
                                labelProps={{style: {marginBottom: '10px'}}}
                                placeholder={t('configuration.brewfather.fields.key.placeholder')}
                                value={brewfatherConfig.apiKey}
                                onChange={(event) => handleBrewfatherKeyChange(event.currentTarget.value)}
                                mt="md"
                            />
                        )}
                    </Box>
                    <Box mt="xl">
                        <Text>
                            <Trans i18nKey="configuration.ha.init" components={{strong: <strong/>}}/>
                        </Text>
                        <Checkbox
                            label={t('configuration.ha.fields.enable.label')}
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
                        label={t('validation.oneTilt')}
                        disabled={hasAnyTiltSelected()}>
                        <Button
                            onClick={handleGenerateYAML}
                            disabled={!hasAnyTiltSelected()}>
                            {t('button.generateYaml.title')}
                        </Button>
                    </Tooltip>
                </Group>

                {generatedYAML && (
                    <YamlViewer
                        code={generatedYAML}
                    />
                )}
            </Container>
            <AppFooter/>
        </MantineProvider>
    )
}

export default App
