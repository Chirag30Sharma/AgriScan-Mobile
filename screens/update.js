import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Linking } from 'react-native';
import * as Location from 'expo-location';
import { Weather_API, News_API } from '@env';
import axios from 'axios';

const Update = () => {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    // Request location permission
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      // Get the device's current location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      fetchWeatherData(location.coords);
      fetchNewsData();
    })();
  }, []);

  const fetchWeatherData = async (coords) => {
    try {
      const { latitude, longitude } = coords;
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${Weather_API}&units=metric`);
      setWeatherData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNewsData = async () => {
    try {
      const response = await axios.get(`https://newsapi.org/v2/everything?q=agriculture&apiKey=${News_API}`);
      setNewsData(response.data.articles);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewsPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {weatherData && (
        <View>
          <Text>Current Weather:</Text>
          <Text>Temperature: {weatherData.list[0].main.temp}°C</Text>
          <Text>Description: {weatherData.list[0].weather[0].description}</Text>
        </View>
      )}
      <FlatList
        data={newsData}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <View style={styles.newsItem}>
            <Text style={styles.newsTitle} onPress={() => handleNewsPress(item.url)}>{item.title}</Text>
            <Text style={styles.newsDescription}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  newsItem: {
    marginVertical: 10,
  },
  newsTitle: {
    fontWeight: 'bold',
    color: 'blue',
  },
  newsDescription: {
    marginTop: 5,
  },
});

export default Update;