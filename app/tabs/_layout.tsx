import { Stack } from 'expo-router';
import React from 'react';
import CustomHeader from '../../components/Header';


export default function TabsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: ({ options }) => (
          <CustomHeader
            centerNode={{ 
              title: 'Eskate', 
            }}
            leftNode={null} 
            rightNode={null} 
          />
        ),
      }}
    >
      <Stack.Screen 
        name="shop" 
        options={{ 
          title: 'Tienda' 
        }} 
      />
      <Stack.Screen 
        name="item" 
        options={{ 
          title: 'Producto' 
        }} 
      />
      <Stack.Screen 
        name="cart" 
        options={{ 
          title: 'Carrito' 
        }} 
      />
    </Stack>
  );
}