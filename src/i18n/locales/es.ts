const es = {
    translation: {
        tiltSense: "TiltSense",
        subTitle: "Generador de YAML para ESPHome",
        welcome: "Bienvenido al generador dinámico de YAML para ESPHome de TiltSense",
        introduction: {
            text: "Esta herramienta te permite generar un firmware totalmente personalizado de ESPHome según tu configuración y preferencias.",
            capabilities: {
                init: "Con TiltSense podrás:",
                1: "Seleccionar uno o varios hidrómetros Tilt.",
                2: "Configurar cada Tilt individualmente por color.",
                3: "Indicar si se trata de un Tilt Pro.",
                4: "Habilitar la integración con <strong>Brewfather</strong> para el seguimiento durante la fermentación.",
                5: "Habilitar la integración con <strong>Home Assistant</strong> para realizar automatizaciones.",
                6: "Configurar un <strong>sensor de presión</strong>.",
                end: "Todas las configuraciones se utilizarán para generar un archivo YAML personalizado que podrás copiar o descargar para configurar tu dispositivo ESPHome."
            }
        },
        configuration: {
            tilt:
                {
                    init: "Especifica que <strong>hidrómetros Tilt</strong> tienes disponibles, sus colores y si son versión Pro."
                },
            wifi: {
                init: "Por favor, añade la siguiente <strong>configuración Wi-Fi</strong>.",
                subinit: "Si tienes pensado usar tu TiltSense sin conectividad, puedes omitir este paso.",
                fields: {
                    SSID: {
                        label: "SSID de Wi-Fi",
                        placeholder: "Introduce el nombre de la red"
                    },
                    password: {
                        label: "Contraseña de Wi-Fi",
                        placeholder: "Introduce la contraseña",
                        validationMessage: "La contraseña debe tener al menos 8 caracteres"
                    }
                }
            },
            brewfather: {
                init: "¿Vas a usar TiltSense para enviar datos del Tilt (temperatura y densidad) a <strong>Brewfather</strong>?",
                fields: {
                    enable: {
                        label: "Habilitar integración con Brewfather"
                    },
                    key: {
                        label: "<span>Clave de Brewfather</span>",
                        placeholder: "Introduce tu clave API de Brewfather"
                    }
                }
            },
            ha: {
                init: "¿Quieres monitorizar los datos de TiltSense en <strong>Home Assistant</strong>?",
                fields: {
                    enable: {
                        label: "Habilitar integración con Home Assistant"
                    }
                }
            }
        },
        validation: {
            oneTilt: "Debes seleccionar al menos un Tilt"
        },
        button: {
            generateYaml: {
                title: "Generar YAML de TiltSense"
            },
            copy: {
                title: "Copiar",
                shiftedTitle: "Copiado"
            },
            download: {
                title: "Descargar"
            }
        },
        notifications: {
            warning: {
                brewfather: {
                    title: "Falta la configuración Wi-Fi",
                    message: "Has activado la integración con Brewfather pero no has proporcionado las credenciales Wi-Fi."
                }
            },
            error: {
                brewfather: {
                    title: "Falta la clave API de Brewfather",
                    message: "Has activado la integración con Brewfather pero no has proporcionado una clave API."
                }
            }
        }
    }
};

export default es;