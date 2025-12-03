import { StyleSheet } from "react-native";

const Colors = {
    primary: '#FF6600',   
    secondary: '#00C4FF', 
    background: '#F5F5F5', 
    darkGrey: '#333333',   
    accentRed: '#E53935',  
    lightGrey: '#BBBBBB',  
    white: '#FFFFFF',      
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.darkGrey,
    },

    linkText: {
        color: Colors.secondary,
    },

    linkWrapper: {
        marginTop: 10,
    },

    containerAuthRegister: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        gap: 10,
    },

    containerAuthLogin: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        gap: 20
    },

    logoImage: {
        width: 150,
        height: 150,
        marginBottom: 20,
        borderRadius: 75,
    },

    safeAreaBase: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    headerProfilePressable: {
        padding: 8,
        backgroundColor: Colors.white,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.lightGrey,
    },

    modalViewProfile: {
        position: 'absolute',
        top: 0, 
        left: 0, 
        padding: 15, 
        backgroundColor: Colors.white, 
        zIndex: 100, 
        elevation: 5,
        shadowColor: Colors.darkGrey,
    },
})

export default styles;