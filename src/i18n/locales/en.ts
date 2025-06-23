const en = {
    translation: {
        tiltSense: "TiltSense",
        subTitle: "ESPHome YAML Generator",
        welcome: "Welcome to the TiltSense dynamic ESPHome YAML generator",
        introduction: {
            text: "This tool helps you generate a fully customized ESPHome configuration based on your specific setup and preferences.",
            capabilities: {
                init: "With TiltSense, you can easily:",
                1: "Select one or multiple Tilt hydrometers.",
                2: "Configure each Tilt individually by color.",
                3: "Specify whether each device is a Tilt Pro.",
                4: "Enable integration with <strong>Brewfather</strong> for fermentation tracking.",
                5: "Enable integration with <strong>Home Assistant</strong> for home automation.",
                6: "Add configuration for a <strong>pressure sensor</strong> if available",
                end: "All selected options will be used to generate a tailored YAML file that you can copy or download for your ESPHome device configuration."
            }
        },
        notifications: {
            warning: {
                brewfather: {
                    title: "Missing Wi-Fi configuration",
                    message: "You enabled Brewfather integration but did not provide Wi-Fi credentials."
                }
            },
            error: {
                brewfather: {
                    title: "Missing Brewfather API Key",
                    message: "You enabled Brewfather integration but did not provide an API key."
                }
            }
        }
    }
};

export default en;