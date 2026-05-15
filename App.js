3s
Run npx expo prebuild --platform android --no-install
- Creating native directory (./android)
✔ Created native directory
- Updating package.json
✔ Updated package.json | no changes
- Running prebuild
Error: ENOENT: no such file or directory, open '/home/runner/work/monitoraapp/monitoraapp/google-services.json'
    at async open (node:internal/fs/promises:637:25)
    at async Object.readFile (node:internal/fs/promises:1249:14)
    at async copyFilePathToPathAsync (/home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/utils/fs.js:25:19)
    at async setGoogleServicesFile (/home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/android/GoogleServices.js:97:5)
    at async /home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/android/GoogleServices.js:81:5
    at async action (/home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/plugins/withMod.js:199:23)
    at async interceptingMod (/home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/plugins/withMod.js:104:21)
    at async interceptingMod (/home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/plugins/withMod.js:104:21)
    at async interceptingMod (/home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/plugins/withMod.js:104:21)
    at async action (/home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/plugins/createBaseMod.js:60:21) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/home/runner/work/monitoraapp/monitoraapp/google-services.json'
}
- Running prebuild
✖ Prebuild failed
Error: [android.dangerous]: withAndroidDangerousBaseMod: Cannot copy google-services.json from /home/runner/work/monitoraapp/monitoraapp/google-services.json to /home/runner/work/monitoraapp/monitoraapp/android/app/google-services.json. Ensure the source and destination paths exist.
Error: [android.dangerous]: withAndroidDangerousBaseMod: Cannot copy google-services.json from /home/runner/work/monitoraapp/monitoraapp/google-services.json to /home/runner/work/monitoraapp/monitoraapp/android/app/google-services.json. Ensure the source and destination paths exist.
    at setGoogleServicesFile (/home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/android/GoogleServices.js:100:11)
    at async /home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/android/GoogleServices.js:81:5
    at async action (/home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/plugins/withMod.js:199:23)
    at async interceptingMod (/home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/plugins/withMod.js:104:21)
    at async interceptingMod (/home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/plugins/withMod.js:104:21)
    at async interceptingMod (/home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/plugins/withMod.js:104:21)
    at async action (/home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/plugins/createBaseMod.js:60:21)
    at async interceptingMod (/home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/plugins/withMod.js:104:21)
    at async evalModsAsync (/home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/plugins/mod-compiler.js:206:25)
    at async compileModsAsync (/home/runner/work/monitoraapp/monitoraapp/node_modules/@expo/config-plugins/build/plugins/mod-compiler.js:123:10)
Error: Process completed with exit code 1.

