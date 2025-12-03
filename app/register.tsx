import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
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
  
        return querySnapshot.empty;
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
        Alert.alert("Las contraseñas no coinciden");
    }

    try
    {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

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

      Alert.alert(
        "Registro exitoso",
        "Tu cuenta ha sido creada correctamente. Pulsa OK para acceder",
        [
          {
            text: "OK",
            onPress: () => router.push("/"),
          },
        ]
      );
    }
    catch(err: any)
    {
      console.error("Error al crear usuario");

      Alert.alert(
        "Datos no válidos",
        "Revise los campos antes de volver a intentar crear una cuenta",
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{flex: 1}}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <FormInput
        control={control}
        name="username"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Nombre de usuario"
      />
      <FormInput
        control={control}
        name="name"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Nombre"
      />
      <FormInput
        control={control}
        name="surname"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Apellidos"
      />
      <FormInput
        control={control}
        name="birthdate"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Fecha de nacimiento"
      />
      <FormInput
        control={control}
        name="email"
        autoCapitalize="none"
        autoCompleteType="email"
        inputMode="email"
        placeholder="Correo electrónico"
      />
      <FormInput
        control={control}
        name="password"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Contraseña"
        secureTextEntry
      />
      <FormInput
        control={control}
        name="confirmPassword"
        autoCapitalize="none"
        inputMode="text"
        placeholder="Repetir contraseña"
        secureTextEntry
      />
      <Link href="/" style={styles.link}><Text style={styles.linktext}>Ya tienes cuenta? Inicia sesión aquí!</Text></Link>
      <Button text="Registrarse" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    gap: 10,
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