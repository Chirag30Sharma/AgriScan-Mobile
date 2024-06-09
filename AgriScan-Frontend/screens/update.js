import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Linking, ImageBackground, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { Weather_API, News_API } from '@env';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

const Update = () => {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      fetchWeatherData(location.coords);
      fetchNewsData(location.coords.latitude, location.coords.longitude);
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

  const fetchNewsData = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://newsapi.org/v2/everything?q=agriculture+india&apiKey=${News_API}&sortBy=publishedAt&language=en`);
      const newsCount = Math.round(Math.abs(latitude) + Math.abs(longitude)) % 5 + 4;
      setNewsData(response.data.articles.slice(0, newsCount));
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewsPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <ImageBackground source={require('../assets/hero1.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.weatherContainer}>
          {weatherData && (
            <>
              <Text style={styles.weatherTitle}>Weather Forecast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {weatherData.list.slice(0, 8).map((item, index) => (
                  <View key={index} style={styles.weatherCard}>
                    <Text style={styles.weatherDate}>{moment(item.dt_txt).format('ddd, MMM D')}</Text>
                    <Text style={styles.weatherTime}>{moment(item.dt_txt).format('h:mm A')} - {moment(item.dt_txt).add(3, 'hours').format('h:mm A')}</Text>
                    <Ionicons name={getWeatherIcon(item.weather[0].id)} size={48} color="#FFC107" />
                    <Text style={styles.weatherTemp}>{item.main.temp}°C</Text>
                    <Text style={styles.weatherDescription}>{item.weather[0].description}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </View>
        <View style={styles.newsContainer}>
          <Text style={styles.newsTitle}>Agriculture News in India</Text>
          <FlatList
            data={newsData}
            keyExtractor={(item) => item.url}
            renderItem={({ item }) => (
              <View style={styles.newsItem}>
                <Text style={styles.newsTitle} onPress={() => handleNewsPress(item.url)}>
                  {item.title}
                </Text>
                <Text style={styles.newsDescription}>{item.description}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const getWeatherIcon = (weatherId) => {
  if (weatherId >= 200 && weatherId < 300) {
    return 'thunderstorm-outline';
  } else if (weatherId >= 300 && weatherId < 400) {
    return 'rainy-outline';
  } else if (weatherId >= 500 && weatherId < 600) {
    return 'rainy-outline';
  } else if (weatherId >= 600 && weatherId < 700) {
    return 'snow-outline';
  } else if (weatherId >= 700 && weatherId < 800) {
    return 'cloudy-outline';
  } else if (weatherId === 800) {
    return 'sunny-outline';
  } else if (weatherId > 800 && weatherId < 900) {
    return 'partly-sunny-outline';
  } else {
    return 'cloudy-outline';
  }
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    margin: 16,
  },
  weatherContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  weatherTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  weatherCard: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    width: 120,
  },
  weatherDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  weatherTime: {
    fontSize: 14,
    marginBottom: 8,
  },
  weatherTemp: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  weatherDescription: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  newsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  newsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  newsItem: {
    marginVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 12,
    borderRadius: 8,
  },
  newsDescription: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
});

export default Update;