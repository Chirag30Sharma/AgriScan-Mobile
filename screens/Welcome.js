import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { LinearGradient } from "expo-linear-gradient";

const COLORS = {
    white: "#FFFFFF",
    black: "#222222",
    primary: "#007260",
    secondary: "#39B68D",
    grey: "#CCCCCC",
    red: "#FF0000"
};

const Welcome = ({ navigation }) => {
    const Button = ({ title, filled, style, onPress }) => {
        const filledBgColor = filled ? COLORS.primary : COLORS.white;
        const textColor = filled ? COLORS.white : COLORS.primary;

        return (
            <Pressable
                style={{
                    ...styles.button,
                    backgroundColor: filledBgColor,
                    ...style
                }}
                onPress={onPress}
            >
                <Text style={{ fontSize: 18, color: textColor }}>{title}</Text>
            </Pressable>
        );
    };

    const styles = {
        button: {
            paddingBottom: 16,
            paddingVertical: 10,
            borderColor: COLORS.primary,
            borderWidth: 2,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center'
        }
    };

    return (
        <LinearGradient
            style={{
                flex: 1
            }}
            colors={[COLORS.secondary, COLORS.primary]}
        >
            <View style={{ flex: 1 }}>
                <View>
                    <Image
                        source={require("../assets/hero1.jpg")}
                        style={{
                            height: 100,
                            width: 100,
                            borderRadius: 20,
                            position: "absolute",
                            top: 10,
                            transform: [
                                { translateX: 20 },
                                { translateY: 50 },
                                { rotate: "-15deg" }
                            ]
                        }}
                    />

                    <Image
                        source={require("../assets/hero3.jpg")}
                        style={{
                            height: 100,
                            width: 100,
                            borderRadius: 20,
                            position: "absolute",
                            top: -30,
                            left: 100,
                            transform: [
                                { translateX: 50 },
                                { translateY: 50 },
                                { rotate: "-5deg" }
                            ]
                        }}
                    />

                    <Image
                        source={require("../assets/hero3.jpg")}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 20,
                            position: "absolute",
                            top: 130,
                            left: -50,
                            transform: [
                                { translateX: 50 },
                                { translateY: 50 },
                                { rotate: "15deg" }
                            ]
                        }}
                    />

                    <Image
                        source={require("../assets/hero2.jpg")}
                        style={{
                            height: 200,
                            width: 200,
                            borderRadius: 20,
                            position: "absolute",
                            top: 110,
                            left: 100,
                            transform: [
                                { translateX: 50 },
                                { translateY: 50 },
                                { rotate: "-15deg" }
                            ]
                        }}
                    />
                </View>

                {/* content */}
                <View style={{
                    paddingHorizontal: 22,
                    position: "absolute",
                    top: 400,
                    width: "100%"
                }}>
                    <Text style={{
                        fontSize: 50,
                        fontWeight: '800',
                        color: COLORS.white
                    }}>🌱 Let's Get</Text>
                    <Text style={{
                        fontSize: 46,
                        fontWeight: '800',
                        color: COLORS.white
                    }}>        Started 🌱</Text>

                    <View style={{ marginVertical: 22 }}>
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.white,
                            marginVertical: 4
                        }}>Ready to Grow and Glow? </Text>
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.white,
                        }}>Snap a pic, solve crop mysteries.</Text>
                    </View>

                    <Button
                        title="Join Now"
                        onPress={() => navigation.navigate("Signup")}
                        style={{
                            marginTop: 22,
                            width: "100%"
                        }}
                    />

                    <View style={{
                        flexDirection: "row",
                        marginTop: 12,
                        justifyContent: "center"
                    }}>
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.white
                        }}>Already have an account ?</Text>
                        <Pressable
                            onPress={() => navigation.navigate("Login")}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: COLORS.white,
                                fontWeight: "bold",
                                marginLeft: 4
                            }}>Login</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

export default Welcome;
