import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Exercicio2Page(){

     const colors = [
        "orange",
        "green",
        "red"
    ];

    const [text, setText] = useState<string | null>(null);
    const [fixedText, setFixedText] = useState<string | null>(null);
    const [color, setColor] = useState<string>("orange");

    return (
        <View style={styles.view}>
            <TextInput 
                style={{ borderStyle: "solid", borderColor: "black", borderWidth: 2, borderRadius: 20, marginBottom: 16 }}
                onChangeText={(e) => setText(e)}
            />
            <TouchableOpacity 
                style={{ backgroundColor: color, borderRadius: 20, paddingHorizontal: 16}}
                onPress={() => { 
                    setFixedText(text);  

                    const random = Math.floor(Math.random() * 3);

                    setColor(colors[random])
                }}
            >
                Enviar
            </TouchableOpacity>
            <Text>
                {fixedText}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
  view: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
});