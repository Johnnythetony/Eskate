import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, View } from "react-native";
import { z } from "zod";

const isAdult = (dateOfBirth: Date): boolean => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
    );

    return dateOfBirth <= eighteenYearsAgo;
};

const formSchema = z.object({
  username: z.string()
    .min(3, "Mínimo 3 caracteres")
    .refine(async (value) => {
        const db = getFirestore(); 
  
        const usersRef = collection(db, "users");
  
        const q = query(usersRef, where("username", "==", value));
  
        const querySnapshot = await getDocs(q);
  
        return !querySnapshot.empty;
    }, {
        message: "Ese nombre de usuario ya está en uso.",
    }),
  name: z.string().min(3),
  surname: z.string().min(3),
  birthdate: z.string().transform((str, ctx) => {
        const date = new Date(str);
        
        if (isNaN(date.getTime())) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Formato de fecha inválido o vacío."
            });
            return z.NEVER;
        }
        return date;
    }).refine(isAdult, {
      message: "Debes ser mayor de 18 años para registrarte."
    }),
  email: z.string().email("Email no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});

const RegisterScreen = () => {
  const auth = getAuth();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      name: "",
      surname: "",
      birthdate: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = async (formData: { username: string, name: string, surname: string, birthdate: Date, email: string, password: string;  confirmPassword: string}) => {
    if (formData.password !== formData.confirmPassword){
        Alert.alert("Password doesnt match");
    }
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then(async (userCredential) => {

        const uid = userCredential.user.uid;

        const userProfile = {
            username: formData.username,
            name: formData.name,
            surname: formData.surname,
            dateOfBirth: formData.birthdate,
            createdAt: new Date(),
        };

        const db = getFirestore();

        await setDoc(doc(db, "users", uid), userProfile);

        const { email } = userCredential.user;
        if (email) {
          await AsyncStorage.setItem("userEmail", email);
          router.push("/");
        }
      })
      .catch(() => {
        Alert.alert("Error creating account");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <FormInput
        control={control}
        name="username"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Enter your username"
      />
      <FormInput
        control={control}
        name="name"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Enter your name"
      />
      <FormInput
        control={control}
        name="surname"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Enter your surname"
      />
      <FormInput
        control={control}
        name="birthdate"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Enter your "
      />
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
      <FormInput
        control={control}
        name="confirmPassword"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Repeat your password"
        secureTextEntry
      />
      <Link href="/" style={styles.link}><Text style={styles.linktext}>Already have an account? Login here</Text></Link>
      <Button text="Register" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
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
});

export default RegisterScreen;