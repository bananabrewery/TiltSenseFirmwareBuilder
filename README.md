<div align="center">
  <img src="public/logo-text.svg" alt="TiltSense" width="150" />
</div>

## TiltSense Firmware Builder

**TiltSense Firmware Builder** is a simple, interactive web app that helps you create a customized firmware
configuration for your TiltSense device — no manual editing required.

This tool makes it easy to tailor the firmware to your specific setup, including which sensors and integrations you want
to use. Whether you're running a single Tilt or multiple, with or without pressure sensors, this generator has you
covered.

---

## 📦 Project Status

TiltSense Firmware Builder now has its **first fully functional release**. 🎉

🧪 **Beta testing phase:**  
The application is ready to be tested and used. If you encounter any issues or have suggestions, your feedback is more than welcome!

🌐 **Try it here:**  
[https://bananabrewery.github.io/TiltSenseFirmwareBuilder](https://bananabrewery.github.io/TiltSenseFirmwareBuilder)

🐛 **Found a bug or have a feature request?**  
Please open an issue in the parent project in [GitHub repository](https://github.com/bananabrewery/TiltSense/issues).

🔧 **Next steps:**

- Minor improvements
  - Store values in the device's local storage. ✅ Done!
  - Display "Unavailable" instead of "0.0" for missing readings. ✅ Done!
  - Refactor project architecture (introduce React Context, extract Form component, etc.) ✅ Done!
  - Drag and Drop to order the Tilt list. ✅ Done!
- Document the parent project ⚙️ In process...
- Design a proper logo  ✅ Done!
- Improve the accuracy of battery level readings ⏰ Pending...

---

## 🧠 What can you configure?

- 🎨 Which **Tilt Hydrometers** you use, and their **colors**
- 🆚 Whether each device is a **Tilt** or **Tilt Pro**
- 📡 Whether you want **Brewfather integration**
- 🏠 Whether you use **Home Assistant**
- 💨 Whether you include a **pressure sensor**

Once configured, the app will generate a ready-to-use YAML file that you can flash to your ESP32
using [ESPHome](https://web.esphome.io/).

---

## 🚀 How it works

1. Open the TiltSense Firmware Builder in your web browser.
2. Select your Tilt colors and sensor options.
3. Choose your integrations (Brewfather, Home Assistant, etc.).
4. Click **Generate** to create your custom YAML file.
5. You have two options:
   1. Compile the firmware yourself using ESPHome.
   2. Let us compile it for you!
6. Flash it to your device using the ESPHome web tool — and you're done!

---

## 🔧 Requirements

- A compatible ESP32 device (see [TiltSense project](https://github.com/bananabrewery/tiltsense) for hardware
  recommendations)
- Optional: Brewfather account or Home Assistant setup for integration

---

## 🌍 Why this exists

The original TiltSense firmware required manual YAML editing to match each user’s hardware and preferences. The Firmware Builder eliminates that step — making the setup faster, easier, and less error-prone.

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

Special thanks to [Llupols](https://github.com/llupols) for designing the TiltSense logo. Your creativity and talent have given our project a unique identity. Much appreciated!

🧪 Made by and for fermentation geeks.

## 🙌 Contribute

Pull requests are welcome! Feel free to fork, modify, and share ideas via issues or discussions.

---

## 📣 Stay tuned

More features and documentation coming soon!
