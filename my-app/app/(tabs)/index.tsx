import { Image, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
  <View style={styles.view}>
    <div style={styles.imageContainer}>
      <Image source={require("../../assets/images/user-round.svg")} style={{ width: "70%", height: "70%"}} />
    </div>
    <Text style={styles.text}>
      Gustavo Laur Pisanello
    </Text>
    <div style={{display: "flex", gap: 8, alignItems: "center", marginTop: 8}}>
      <Image source={require("../../assets/images/facebook.svg")} style={{ width: 20, height: 20}} />
      <Text>
        Facebook.com/eu
      </Text>
    </div>
      <Text style={{ padding: 16, backgroundColor: "white"}}>        Adoro programar em typescript. Dirigi uma porsche hoje. Foi muito bacana
      </Text>
  </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: "50%",
    padding: 12,
    borderColor: "black",
    borderWidth: 2,
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
    display: "flex"
  },
  text: {
    fontWeight: 900,
    marginTop: 12
  },
  view: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "orange"
  }
});
