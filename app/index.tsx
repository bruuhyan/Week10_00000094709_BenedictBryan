import * as Location from "expo-location";
import React, { useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, MapPressEvent, Region, UrlTile } from "react-native-maps";

type Coordinates = {
  latitude: number;
  longitude: number;
};

const { height } = Dimensions.get("window");

export default function App() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [markerPosition, setMarkerPosition] = useState<Coordinates | null>(null);

  const getLocation = async (): Promise<void> => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Permission denied! Please allow location access.");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    const coords: Coordinates = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };

    setLocation(coords);
    setMarkerPosition(coords);
    location
  };

  const handleMapPress = (event: MapPressEvent): void => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
  };

  const handleMarkerDragEnd = (event: any): void => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
  };

  const region: Region | undefined = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : undefined;

  return (
    <View style={styles.container}>
      {!location ? (
        <View style={styles.center}>
          <Button title="Get Geo Location" onPress={getLocation} />
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={region}
            onPress={handleMapPress} 
          >
            <UrlTile urlTemplate="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

            {markerPosition && (
              <Marker
                coordinate={markerPosition}
                title="My Location"
                draggable 
                onDragEnd={handleMarkerDragEnd}    
              />
            )}
          </MapView>

          <View style={styles.info}>
            <Text style={styles.label}>Latitude:</Text>
            <Text style={styles.value}>{markerPosition?.latitude.toFixed(6)}</Text>

            <Text style={styles.label}>Longitude:</Text>
            <Text style={styles.value}>{markerPosition?.longitude.toFixed(6)}</Text>
            
            <Text style={styles.hint}>Tap pada peta atau drag marker untuk mengubah posisi</Text>

            <Button title="Refresh Location" onPress={getLocation} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    height: height * 0.6, 
    width: "100%",
  },
  info: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 13,
    color: "#666",
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  hint: {
    fontSize: 12,
    color: "#999",
    marginVertical: 10,
    fontStyle: "italic",
  }, 
});