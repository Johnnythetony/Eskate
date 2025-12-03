import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from 'react-native-screens';
import CustomHeader from '../../components/Header';
import { auth } from '../../firebaseConfig';

const ProfileHeaderButton = ({ username, email }: { username: string; email: string }) => {
    const [isModalVisible, setModalVisible] = useState(false);

    const handleLogout = async () => {
        try {
            await firebaseSignOut(auth);
            setModalVisible(false);
            router.push('/'); 
        } catch (error) {
            Alert.alert("Error", "No se pudo cerrar la sesión.");
        }
    };

    if (!username) return null; 

    return (
        <>
            <Pressable onPress={() => setModalVisible(true)}>
                <View style={{ padding: 8, backgroundColor: '#000000ff', borderRadius: 5 }}>
                    <Text style={{ fontWeight: 'bold' }}>{username}</Text>
                </View>
            </Pressable>

            {isModalVisible && (
                <View style={styles.modalview}>
                    <Text style={{ fontWeight: 'bold' }}>{username}</Text>
                    <Text>{email}</Text>
                    <Button title="Cerrar Sesión" onPress={handleLogout} />
                    <Button title="Cerrar" onPress={() => setModalVisible(false)} />
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    safearea: {
        flex: 1,
    },
    modalview: {
        position: 'absolute',
        top: 0, 
        left: 0, 
        padding: 15, 
        backgroundColor: 'white', 
        zIndex: 100, 
        elevation: 5
    },
    pressable: {
        padding: 8, 
        backgroundColor: '#ffffffff', 
        borderRadius: 5 
    }
})

export default function AppStackLayout() {
    const user = auth.currentUser;
    
    const [userData, setUserData] = useState({ 
        username: 'Cargando...', 
        email: user?.email || 'N/A' 
    });

    useEffect(() => {
        if (user) {
            const fetchUsername = async () => {
                try {
                    const db = getFirestore();
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setUserData({ 
                            username: docSnap.data().username, 
                            email: user.email || 'N/A' 
                        });
                    } else {
                        setUserData(prev => ({ ...prev, username: 'Usuario sin perfil' }));
                    }
                } catch (e) {
                    console.error("Error al obtener perfil:", e);
                    setUserData(prev => ({ ...prev, username: 'Error de carga' }));
                }
            };
            fetchUsername();
        }
    }, [user]); 


    return (
        <SafeAreaView style={styles.safearea}>
        <Stack
            screenOptions={{
                headerShown: true,
                header: ({ options }) => (
                    <CustomHeader
                        centerNode={{ 
                            title: 'Eskate', 
                            node: options.headerLeft ? <SearchBar/> : undefined
                        }}
                        leftNode={<ProfileHeaderButton 
                                    username={userData.username} 
                                    email={userData.email} 
                                />} 
                        rightNode={<View>
                            <Pressable>
                                <Ionicons
                                    name="cart-outline" 
                                    size={26} 
                                    color="black"
                                />
                            </Pressable>
                        </View>} 
                    />
                ),
            }}
        >
            <Stack.Screen name="shop" options={{ title: 'Tienda' }} />
            <Stack.Screen name="cart" options={{ title: 'Carrito' }} />
            <Stack.Screen name="item" options={{ title: 'Producto' }} />
        </Stack>
        </SafeAreaView>
    );
}