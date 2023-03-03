import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BleManager } from "react-native-ble-plx";

const manager = new BleManager();

export default function App() {
  function scanAndConnect() {
    console.log("Scanning");
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Error", error);
        return;
      }
      console.log("Device: ", device.name, device.id);
      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.id === "18:7B:3A:B7:CE:1D") {
        // Stop scanning as it's not necessary if you are scanning for one device.
        manager.stopDeviceScan();
        // Proceed with connection.
        console.log("Trying connection");
        device
          .connect()
          .then((device) => {
            return device.discoverAllServicesAndCharacteristics();
          })
          .then((device) => {
            console.log("Device characteristics:", device);
          })
          .catch((error) => {
            console.log("Connection error:", error);
          });
      }
    });
  }

  React.useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      console.log(state);
      if (state === "PoweredOn") {
        scanAndConnect();
        subscription.remove();
      }
    }, true);
    return () => {
      manager.destroy();
      subscription.remove();
    };
  }, [manager]);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
