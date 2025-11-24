import FormInput from "@/components/FormInput";
import "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { Alert, Image, StyleSheet, Text, View } from "react-native";


const Login = () => {
  const auth = getAuth();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
  }});

  const onSubmit = async (formData: { email: string, password: string; }) => {signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then(async (userCredential) => {
        const { email } = userCredential.user;
        if (email) {
          await AsyncStorage.setItem("userEmail", email);
          router.push("/");
        }
      })
      .catch(() => {
        Alert.alert("Invalid credentials");
      });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/app_logo.png')} style={styles.logo}/>
      <Text style={styles.title}>Eskate</Text>
      <FormInput
        control={control}
        name="email"
        autoCapitalize="none"
        autoCompleteType="email"
        inputMode="email"
        placeholder="Enter your email address"
      />
      <FormInput
        control={control}
        name="password"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Enter your password"
        secureTextEntry
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 20
  },
  logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
        borderRadius: 75, 
    },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  }  
})

export default Login;