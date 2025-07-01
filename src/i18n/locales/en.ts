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
      },
    },
    processStepper: {
      title: 'Get your TiltSense ready!',
      button: {
        next: 'Next step',
        prev: 'Previous step',
      },
      steps: {
        step1: {
          label: 'Tilt selection',
          description: 'Required configuration',
          content: {
            intro:
              'Specify which <strong>Tilt Hydrometers</strong> you have available, their colors, and whether they are the Pro version.',
          },
        },
        step2: {
          label: 'Wi-Fi configuration',
          description: 'Optional',
          content: {
            intro: 'Please add the following <strong>Wi-Fi configuration</strong>.',
            subintro:
              'If you plan to use your TiltSense without connectivity, you can skip these fields.',
          },
        },
        step3: {
          label: 'Brewfather integration',
          description: 'Optional',
          content: {
            intro:
              'Are you going to use TiltSense to send Tilt data (temperature and gravity) to <strong>Brewfather</strong>?',
          },
        },
        step4: {
          label: 'Home Assistant integration',
          description: 'Optional',
          content: {
            intro:
              'Do you plan to monitor your TiltSense data with <strong>Home Assistant</strong>?',
          },
        },
        step5: {
          label: 'Firmware compilation',
          description: 'Last step',
          summary: {
            title: 'Configuration summary',
            required: {
              title: 'Required configuration',
              check: {
                tilt: 'At least one Tilt selected.',
              },
            },
            optional: {
              title: 'Optional configuration',
              check: {
                wifi: 'Wi-Fi configured.',
                brewfather: 'Brewfather integration.',
                ha: 'Home Assistant integration',
                pressureSensor: 'Pressure sensor configured.',
              },
            },
          },
        },
        completedStep: {
          content: {
            intro:
              "Firmware request received successfully. You'll receive an email with the compiled firmware soon.",
          },
        },
      },
    },
    validation: {
      oneTilt: 'You must select at least one tilt',
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
      generateFirmware: {
        title: 'Generate Firmware',
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
        firmware: {
          title: 'Error',
          message: 'Something went wrong...',
        },
        firmwareAsync: {
          title: 'Error',
          message: 'Something went wrong...',
        },
      },
      success: {
        firmware: {
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
