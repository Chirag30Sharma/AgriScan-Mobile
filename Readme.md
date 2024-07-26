# 📱 AgriScan-Mobile

AgriScan-Mobile is an innovative agricultural mobile application that combines cutting-edge frontend technology, robust backend infrastructure, and advanced machine learning capabilities.

## 🌟 Frontend (React Native)

The frontend is built with React Native, offering a smooth, native experience on both iOS and Android platforms.

### 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Chirag30Sharma/AgriScan-Mobile.git
   ```
2. Navigate to the frontend directory:
   ```bash
   cd AgriScan-Mobile/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npx react-native start
   ```
5. Run on iOS or Android:
   ```bash
   npx react-native run-ios
   # or
   npx react-native run-android
   ```

### ✨ Key Features

- 🔐 Secure user authentication
- 📊 Interactive data visualization dashboard
- 🗺️ Geospatial mapping integration
- 🔔 Push notifications for real-time updates
- 📱 Responsive design optimized for various device sizes

## 🖥️ Backend (Node.js & Express)

The backend leverages the power and flexibility of Node.js and Express, with MongoDB as the database solution.

### 🛠️ Installation

1. Navigate to the backend directory:
   ```bash
   cd AgriScan-Mobile/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up MongoDB:
   - Install MongoDB if not already installed
   - Create a `.env` file with your MongoDB connection string:
     ```
     MONGODB_URI=your_mongodb_connection_string
     ```
4. Start the server:
   ```bash
   npm start
   ```
   
### 💾 Database Schema

Our MongoDB schema includes collections for users, crop data, and sensor readings. Refer to `schema.js` for detailed structure.

## 🧠 Machine Learning (Python)

The machine learning component, built with Python, provides predictive analytics and intelligent recommendations.

### 🛠️ Setup

1. Navigate to the machine learning directory:
   ```bash
   cd AgriScan-Mobile/ml
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the main script:
   ```bash
   python main.py
   ```

### 🤖 Models
 
- 🐛 Disease detection (Convolutional Neural Network)
- 🌱 Disease Diagnosis (ResNet 50)

### 🔄 Data Pipeline

The data pipeline includes:
- 📥 Data ingestion from various agricultural sensors
- 🧹 Data cleaning and normalization
- 🔍 Feature extraction and selection
- 🔀 Train-test splitting and cross-validation
