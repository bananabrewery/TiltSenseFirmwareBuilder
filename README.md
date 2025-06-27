<img src="public/radar.svg" alt="TiltSense YAML Generator" width="120" />

## TiltSense YAML Generator

**TiltSense YAML Generator** is a simple, interactive web app that helps you create a customized ESPHome YAML
configuration for your TiltSense device — no manual editing required.

This tool makes it easy to tailor the firmware to your specific setup, including which sensors and integrations you want
to use. Whether you're running a single Tilt or multiple, with or without pressure sensors, this generator has you
covered.

---

## 📦 Project Status

TiltSense YAML Generator now has its **first fully functional release**. 🎉

🧪 **Beta testing phase:**  
The application is ready to be tested and used. If you encounter any issues or have suggestions, your feedback is more than welcome!

🌐 **Try it here:**  
[https://bananabrewery.github.io/TiltSenseYAMLGenerator](https://bananabrewery.github.io/TiltSenseYAMLGenerator)

🐛 **Found a bug or have a feature request?**  
Please open an issue in the [GitHub repository](https://github.com/bananabrewery/TiltSenseYAMLGenerator/issues).

🔧 **Next steps:**

- Minor improvements
  - Store values in the device's local storage. ✅ Done!
  - Display "Unavailable" instead of "0.0" for missing readings. ✅ Done!
  - Refactor project architecture (introduce React Context, extract Form component, etc.) ✅ Done!
- Document the parent project
- Design a proper logo
- Improve the accuracy of battery level readings

---

## 🧠 What can you configure?

- 🎨 Which **Tilt Hydrometers** you use, and their **colors**
- 🆚 Whether each device is a **Tilt** or **Tilt Pro**
- 📡 Whether you want **Brewfather integration**
- 🏠 Whether you use **Home Assistant**
- 💨 Whether you include a **pressure sensor**

Once configured, the app will generate a ready-to-use YAML file that you can flash to your ESP32
using [ESPHome](https://esphome.io/).

---

## 🚀 How it works

1. Open the YAML Generator in your browser.
2. Select your Tilt colors and sensor options.
3. Choose your integrations (Brewfather, Home Assistant, etc.).
4. Click **Generate** to download your custom YAML file.
5. Flash it using ESPHome — and you're done!

---

## 🔧 Requirements

- A compatible ESP32 device (see [TiltSense project](https://github.com/bananabrewery/tiltsense) for hardware
  recommendations)
- [ESPHome](https://esphome.io/) installed locally or via the Home Assistant Add-on
- Optional: Brewfather account or Home Assistant setup for integration

---

## 🌍 Why this exists

The original TiltSense firmware required manual YAML editing to match each user’s hardware and preferences. The YAML
Generator eliminates that step — making the setup faster, easier, and less error-prone.

Whether you're a beginner or just want to save time, this tool helps you go from "idea" to "fermentation dashboard" in
minutes.

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

## ❤️ Acknowledgements

Built as part of the [TiltSense Project](https://github.com/yourrepo/tiltsense) — powered by:

- [ESPHome](https://esphome.io/)
- [Tilt Hydrometer](https://tilthydrometer.com/)
- [Brewfather](https://brewfather.app/)
- [Home Assistant](https://www.home-assistant.io/)

🧪 Made by and for fermentation geeks.

## 🙌 Contribute

Pull requests are welcome! Feel free to fork, modify, and share ideas via issues or discussions.

---

## 📣 Stay tuned

More features and documentation coming soon!
