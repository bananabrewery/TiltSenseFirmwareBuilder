const en = {
  translation: {
    tiltSense: 'TiltSense',
    subTitle: 'ESPHome YAML Generator',
    welcome: 'Welcome to the TiltSense dynamic ESPHome YAML generator',
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
      text: 'This tool helps you generate a fully customized ESPHome configuration based on your specific setup and preferences.',
      capabilities: {
        init: 'With TiltSense, you can easily:',
        1: 'Select one or multiple Tilt hydrometers.',
        2: 'Configure each Tilt individually by color.',
        3: 'Specify whether each device is a Tilt Pro.',
        4: 'Enable integration with <strong>Brewfather</strong> for fermentation tracking.',
        5: 'Enable integration with <strong>Home Assistant</strong> for home automation.',
        6: 'Add configuration for a <strong>pressure sensor</strong> if available',
        end: 'All selected options will be used to generate a tailored YAML file that you can copy or download for your ESPHome device configuration.',
      },
    },
    configuration: {
      text: "Let's start!",
      tilt: {
        init: 'Specify which <strong>Tilt Hydrometers</strong> you have available, their colors, and whether they are the Pro version.',
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
        init: 'Please add the following <strong>Wi-Fi configuration</strong>.',
        subinit:
          'If you plan to use your TiltSense without connectivity, you can skip these fields.',
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
        init: 'Are you going to use TiltSense to send Tilt data (temperature and gravity) to <strong>Brewfather</strong>?',
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
        init: 'Do you plan to monitor your TiltSense data with <strong>Home Assistant</strong>?',
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
      },
    },
    validation: {
      oneTilt: 'You must select at least one tilt',
    },
    button: {
      generateYaml: {
        title: 'Generate TiltSense YAML',
      },
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
      },
    },
    footer: {
      version: 'Version ',
      powered: 'Powered by Banana Brewery 🍌',
    },
  },
};

export default en;
