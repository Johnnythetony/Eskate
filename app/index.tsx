import { FormInputText } from "@/components/FormInput";
import "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { Alert, Image, KeyboardAvoidingView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";


const Login = () => {
  const auth = getAuth();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
  }});

  const onSubmit = async (formData: { email: string, password: string; }) => {signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then(async (userCredential) => {
        const { email } = userCredential.user;
        if (email) {
          await AsyncStorage.setItem("userEmail", email);
          router.push("/tabs/shop");
        }
      })
      .catch(() => {
        Alert.alert("Credenciales no válidas");
      });
  };

  return (
    <KeyboardAvoidingView style = {{flex: 1}}>
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/app_logo.png')} style={styles.logo}/>
      <Text style={styles.title}>Eskate</Text>
      <FormInputText
        control={control}
        name="email"
        autoCapitalize="none"
        autoCompleteType="email"
        inputMode="email"
        placeholder="Correo electrónico"
      />
      <FormInputText
        control={control}
        name="password"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Contraseña"
        secureTextEntry
      />
      <Link href='/register' style={styles.link}><Text style={styles.linktext}>No tienes cuenta? Regístrate aquí!</Text></Link>
      <Button text="Iniciar sesión" onPress={handleSubmit(onSubmit)} />
    </SafeAreaView>
    </KeyboardAvoidingView>
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
  },
  link: {
    marginTop: 10,
  },
  linktext: {
    color: "blue,"
  },  
})

export default Login;