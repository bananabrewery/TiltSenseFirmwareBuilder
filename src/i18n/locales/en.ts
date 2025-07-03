const en = {
  translation: {
    tiltSense: 'TiltSense',
    subTitle: 'Firmware Generator',
    welcome: 'Welcome to the TiltSense dynamic firmware generator',
    tilt: {
      colors: {
        Black: 'Black',
        Blue: 'Blue',
        Green: 'Green',
        Orange: 'Orange',
        Red: 'Red',
        Yellow: 'Yellow',
        Pink: 'Pink',
        Purple: 'Purple',
      },
    },
    introduction: {
      text: 'This tool helps you generate a fully customized configuration based on your specific setup and preferences.',
      capabilities: {
        init: 'With TiltSense, you can easily:',
        1: 'Select one or multiple Tilt hydrometers.',
        2: 'Configure each Tilt individually by color.',
        3: 'Specify whether each device is a Tilt Pro.',
        4: 'Enable integration with <strong>Brewfather</strong> for fermentation tracking.',
        5: 'Enable integration with <strong>Home Assistant</strong> for home automation.',
        6: 'Add configuration for a <strong>pressure sensor</strong> if available',
        end: 'All selected options will be used to generate a tailored YAML file, which you can copy or download and compile yourself using ESPHome - or let us do it for you!',
      },
    },
    configuration: {
      tilt: {
        fields: {
          tilt: {
            pro: 'Pro',
          },
          pressureSensor: {
            placeholder: 'Pressure Sensor Entity in Home Assistant',
          },
        },
      },
      wifi: {
        fields: {
          SSID: {
            label: 'Wi-Fi SSID',
            placeholder: 'Enter network name',
          },
          password: {
            label: 'Wi-Fi Password',
            placeholder: 'Enter password',
            validationMessage: 'Password must be at least 8 characters',
          },
        },
      },
      brewfather: {
        fields: {
          enable: {
            label: 'Enable Brewfather Integration',
          },
          key: {
            label: '<span>Brewfather Key</span>',
            placeholder: 'Enter your Brewfather API Key',
          },
        },
      },
      ha: {
        fields: {
          enable: {
            label: 'Enable Home Assistant Integration',
          },
        },
      },
      pressureSensor: {
        init: 'Enable <strong>pressure sensors</strong>?',
        fields: {
          enable: {
            label: 'I have pressure sensors in Home Assistant',
          },
        },
        description: 'Add the Pressure Sensor entities from Home Assistant for each of your Tilts.',
      },
    },
    processStepper: {
      title: 'Get your TiltSense ready!',
      button: {
        next: 'Next step',
        prev: 'Previous step',
      },
      steps: {
        0: {
          label: 'Tilt selection',
          description: 'Required configuration',
          content: {
            intro:
              'Specify which <strong>Tilt Hydrometers</strong> you have available, their colors, and whether they are the Pro version.',
          },
        },
        1: {
          label: 'Wi-Fi configuration',
          description: 'Optional',
          content: {
            intro: 'Please add the following <strong>Wi-Fi configuration</strong>.',
            subintro:
              'If you plan to use your TiltSense without connectivity, you can skip these fields.',
          },
        },
        2: {
          label: 'Brewfather integration',
          description: 'Optional',
          content: {
            intro:
              'Are you going to use TiltSense to send Tilt data (temperature and gravity) to <strong>Brewfather</strong>?',
          },
        },
        3: {
          label: 'Home Assistant integration',
          description: 'Optional',
          content: {
            intro:
              'Do you plan to monitor your TiltSense data with <strong>Home Assistant</strong>?',
          },
        },
        4: {
          label: 'Firmware generation',
          description: 'YAML file',
          content: {
            intro:
              'Before continuing, double-check that all key settings are in place. These ensure your TiltSense works just the way you want.',
            accordionTitle: 'TiltSense ESPHome YAML',
            outro:
              'If everything looks good, just press the <i>Generate Firmware File</i> button. Feel free to jump to the next step — unless you’re curious to take a look at the generated ESPHome YAML file, or you’re used to working with ESPHome and want to compile the firmware yourself.',
          },
          summary: {
            title: 'Configuration summary',
            required: {
              title: 'Required configuration',
              check: {
                tilt: 'At least one Tilt selected',
              },
            },
            optional: {
              title: 'Optional configuration',
              check: {
                wifi: 'Wi-Fi configured.',
                brewfather: 'Brewfather integration',
                ha: 'Home Assistant integration',
                pressureSensor: 'Pressure sensor configured',
              },
            },
          },
        },
        5: {
          label: 'Firmware compilation',
          description: 'Final step',
          content: {
            intro:
              'It’s time to compile your firmware. This process takes quite a bit of time (at least 10 minutes), so it will continue running in the background. You will receive an email as soon as your firmware is ready. Please enter your email and press the <i>Compile Firmware</i> button to complete the process.',
            subintro:
              'We do not store your email anywhere; it is used only to send your compiled TiltSense firmware.',
            emailInput: {
              label: 'Email',
              placeholder: 'Enter your email address',
            },
          },
        },
        completedStep: {
          content: {
            intro: 'Your TiltSense firmware request has been received successfully.',
            subintro: 'You’ll receive an email with the compiled firmware soon.',
          },
        },
      },
    },
    validation: {
      oneTilt: 'You must select at least one tilt.',
      generateFirmware: 'Generate the firmware file before continuing to the next step.',
      wifiWarning:
        'You configured the SSID without a password. Make sure the Wi-Fi network is open and not password-protected.',
      wifiError:
        'Brewfather or Home Assistant integration is enabled, but Wi-Fi is not configured. Wi-Fi is required to use with integrations.',
      brewfatherError:
        'You’ve enabled the Brewfather integration, but there’s no API key set. Please add your API key.',
      email: 'Please enter your email first.',
      invalidEmail: 'Invalid email address',
      yamlError:
        'Navigate to the Firmware File Generation step to review your settings and generate the firmware first.',
    },
    button: {
      copy: {
        title: 'Copy',
        shiftedTitle: 'Copied',
      },
      download: {
        title: 'Download',
      },
      restore_order: {
        title: 'Restore order',
      },
      generateYaml: {
        title: 'Generate Firmware File',
      },
      compileFirmware: {
        title: 'Compile Firmware',
      },
    },
    notifications: {
      warning: {
        brewfather: {
          title: 'Missing Wi-Fi configuration',
          message: 'You enabled Brewfather integration but did not provide Wi-Fi credentials.',
        },
      },
      error: {
        brewfather: {
          title: 'Missing Brewfather API Key',
          message: 'You enabled Brewfather integration but did not provide an API key.',
        },
        firmwareCompilation: {
          title: 'Error',
          firmwareCompilation: 'Something went wrong. Please try again later.',
        },
      },
      success: {
        firmwareGeneration: {
          title: 'Success',
          message:
            'Your TiltSense firmware has been successfully generated based on your configuration. Now it’s time to <strong>compile it</strong>.',
        },
        firmwareCompilation: {
          title: 'Success',
          message:
            "Firmware request received successfully. You'll receive an email with the compiled firmware soon.",
        },
      },
    },
    footer: {
      version: 'Version ',
      powered: 'Powered by Banana Brewery 🍌',
    },
  },
};

export default en;
