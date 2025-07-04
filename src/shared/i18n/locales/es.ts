const es = {
  translation: {
    tiltSense: '<strong>TILT</strong>SENSE',
    subTitle: 'Generador de firmware',
    welcome: 'Bienvenido al generador de firmware dinámico de TiltSense',
    tilt: {
      colors: {
        Black: 'Negro',
        Blue: 'Azul',
        Green: 'Verde',
        Orange: 'Naranja',
        Red: 'Rojo',
        Yellow: 'Amarillo',
        Pink: 'Rosa',
        Purple: 'Lila',
      },
    },
    introduction: {
      text: 'Esta herramienta te permite generar un firmware totalmente personalizado de ESPHome según tu configuración y preferencias.',
      capabilities: {
        init: 'Con TiltSense podrás:',
        1: 'Seleccionar uno o varios hidrómetros Tilt.',
        2: 'Configurar cada Tilt individualmente por color.',
        3: 'Indicar si se trata de un Tilt Pro.',
        4: 'Habilitar la integración con <strong>Brewfather</strong> para el seguimiento durante la fermentación.',
        5: 'Habilitar la integración con <strong>Home Assistant</strong> para realizar automatizaciones.',
        6: 'Configurar un <strong>sensor de presión</strong>.',
        end: 'Todas las configuraciones se utilizarán para generar un archivo YAML personalizado que podrás copiar o descargar y compilar tú mismo usando ESPHome, ¡o puedes dejar que lo hagamos nosotros por ti!',
      },
    },
    configuration: {
      tilt: {
        fields: {
          tilt: {
            pro: 'Pro',
          },
          pressureSensor: {
            placeholder: 'Entidad del sensor de presión en Home Assistant',
          },
        },
      },
      wifi: {
        fields: {
          SSID: {
            label: 'SSID de Wi-Fi',
            placeholder: 'Introduce el nombre de la red',
          },
          password: {
            label: 'Contraseña de Wi-Fi',
            placeholder: 'Introduce la contraseña',
            validationMessage: 'La contraseña debe tener al menos 8 caracteres',
          },
        },
      },
      brewfather: {
        fields: {
          enable: {
            label: 'Habilitar integración con Brewfather',
          },
          key: {
            label: '<span>Clave de Brewfather</span>',
            placeholder: 'Introduce tu clave API de Brewfather',
          },
        },
      },
      ha: {
        fields: {
          enable: {
            label: 'Habilitar integración con Home Assistant',
          },
        },
      },
      pressureSensor: {
        init: '¿Activar <strong>sensores de presión</strong>?',
        fields: {
          enable: {
            label: 'Dispongo de entidades de sensores de presión en Home Assistant',
          },
        },
        description:
          'Añade las entidades de los sensores de presión en Home Assistant para cada uno de tus Tilts.',
      },
    },
    processStepper: {
      title: '¡Vamos a dejar listo tu TiltSense!',
      button: {
        next: 'Siguiente paso',
        prev: 'Paso anterior',
      },
      steps: {
        0: {
          label: 'Selección de Tilts',
          description: 'Configuración obligatoria',
          content: {
            intro:
              'Especifica qué colores de <strong>Tilt</strong> tienes disponibles, sus colores y si son versión Pro.',
          },
        },
        1: {
          label: 'Configuración Wi-Fi',
          description: 'Opcional',
          content: {
            intro: 'Introduce la siguiente <strong>configuración de Wi-Fi</strong>.',
            subintro:
              'Si tienes intención de usar tu TiltSense sin conectividad, puedes omitir este paso.',
          },
        },
        2: {
          label: 'Integración con Brewfather',
          description: 'Opcional',
          content: {
            intro:
              '¿Vas a usar TiltSense para enviar los datos de temperatura y densidad del Tilt a <strong>Brewfather</strong>?',
          },
        },
        3: {
          label: 'Integración con Home Assistant',
          description: 'Opcional',
          content: {
            intro:
              '¿Quieres monitorizar los datos de TiltSense desde <strong>Home Assistant</strong>?',
          },
        },
        4: {
          label: 'Generación de firmware',
          description: 'Archivo YAML',
          content: {
            intro:
              'Antes de continuar, asegúrate de que todas las configuraciones están validadas. Esto garantizará que tu TiltSense funcione como esperas.',
            accordionTitle: 'YAML de ESPHome para TiltSense',
            outro:
              'Si todo está correcto, simplemente pulsa el botón <i>Generar fichero de firmware</i>. Puedes continuar al siguiente paso, o revisar el archivo YAML generado si sueles trabajar con ESPHome y prefieres compilarlo tú mismo.',
          },
          summary: {
            title: 'Resumen de configuración',
            required: {
              title: 'Configuración obligatoria',
              check: {
                tilt: 'Al menos un Tilt seleccionado',
              },
            },
            optional: {
              title: 'Configuración opcional',
              check: {
                wifi: 'Wi-Fi configurado.',
                brewfather: 'Integración con Brewfather',
                ha: 'Integración con Home Assistant',
                pressureSensor: 'Sensor de presión configurado',
              },
            },
          },
        },
        5: {
          label: 'Compilación del firmware',
          description: 'Paso final',
          content: {
            intro:
              'Es momento de compilar tu firmware. Este proceso puede tardar bastante (un mínimo 10 minutos), así que continuará ejecutándose en segundo plano. Recibirás un correo en cuanto esté listo. Introduce tu correo y pulsa <i>Compilar Firmware</i> para completar el proceso.',
            subintro:
              'No almacenamos tu dirección de correo en ningún sitio, se usará únicamente para enviarte el firmware compilado de TiltSense.',
            emailInput: {
              label: 'Correo electrónico',
              placeholder: 'Introduce tu dirección de correo',
            },
          },
        },
        completedStep: {
          content: {
            intro: 'Hemos recibido correctamente tu solicitud de firmware para tu TiltSense.',
            subintro: 'Recibirás un correo con el firmware compilado en breve.',
            end: 'El próximo paso es instalar el firmware compilado mediante la web de <0>ESPHome</0>.',
          },
        },
      },
    },
    validation: {
      oneTilt: 'Debes seleccionar al menos un Tilt.',
      generateFirmware: 'Genera el fichero de firmware antes de continuar al siguiente paso.',
      wifiWarning:
        'Has configurado el SSID sin contraseña. Asegúrate de que la red Wi-Fi esté abierta y sin protección por contraseña.',
      wifiError:
        'La integración con Brewfather o Home Assistant está habilitada, pero no has configurado el Wi-Fi. Es obligatorio para usar estas integraciones.',
      brewfatherError:
        'Has habilitado la integración con Brewfather pero no has introducido la clave API. Por favor, añádela.',
      email: 'Por favor, introduce tu dirección de correo.',
      invalidEmail: 'Dirección de correo inválida',
      yamlError:
        'Ve al paso de generación del fichero de firmware para revisar la configuración y generar el YAML.',
      invalidPressureEntity: 'La entidad en Home Assistant debe empezar por "sensor."',
      invalidPressureSensors:
        'Hay entidades de sensores de presión no válidas. Por favor, revísalas antes de continuar.',
    },
    button: {
      copy: {
        title: 'Copiar',
        shiftedTitle: 'Copiado',
      },
      download: {
        title: 'Descargar',
      },
      restore_order: {
        title: 'Restaurar ordenación',
      },
      generateYaml: {
        title: 'Generar fichero de firmware',
      },
      compileFirmware: {
        title: 'Compilar firmware',
      },
    },
    notifications: {
      warning: {
        brewfather: {
          title: 'Falta la configuración Wi-Fi',
          message:
            'Has activado la integración con Brewfather pero no has proporcionado las credenciales Wi-Fi.',
        },
      },
      error: {
        brewfather: {
          title: 'Falta la clave API de Brewfather',
          message:
            'Has activado la integración con Brewfather pero no has proporcionado una clave API.',
        },
        firmwareCompilation: {
          title: 'Error',
          message: 'Algo ha ido mal. Por favor, inténtalo más tarde.',
        },
      },
      success: {
        firmwareGeneration: {
          title: 'Completado',
          message:
            'El firmware de TiltSense se ha generado correctamente según tu configuración. Ahora puedes <strong>compilarlo</strong>.',
        },
        firmwareCompilation: {
          title: 'Completado',
          message:
            'Petición de firmware recibida correctamente. Pronto recibirás un correo con el firmware compilado.',
        },
      },
    },
    footer: {
      version: 'Versión ',
      powered: 'Powered by Banana Brewery 🍌',
    },
  },
};

export default es;
