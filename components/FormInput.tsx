import { Controller } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";

type FormInputProps = {
  control: any,
  name: string,
  [key: string]: any;
};

const FormInput: React.FC<FormInputProps> = ({ control, name, ...otherProps }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            {...otherProps}
          />
          {error && <Text style={styles.errorMessage}>
            {error.message}
          </Text>
          }
        </View>
      )}
    />
  );
};

export default FormInput;


const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: "100%",
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    borderRadius: 10,
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
  }
});