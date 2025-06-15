import {type Tilt} from '../models/Tilt';
import tiltSenseFirmwareTemplate from '../assets/tiltsense-template.json'


export function generateFirmwareConfig(tilts: Tilt[], options: { brewfather: any; ha: boolean; }): any {
    const tiltSenseGeneratedFirmware = JSON.parse(JSON.stringify(tiltSenseFirmwareTemplate));
    console.log(options);

    //BLE Advertise Code
    let onBLEAdvertiseCode = `
                 if (x.get_ibeacon().has_value()) {
      auto ibeacon = x.get_ibeacon().value();
      std::string uuid = ibeacon.get_uuid().to_string();
            `.trim();

    tilts.forEach((tilt: Tilt) => {
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
    return tiltSenseGeneratedFirmware;
}