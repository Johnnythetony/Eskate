import { useState } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type FormInputProps = {
  control: any,
  name: string,
  [key: string]: any;
};

const FormInputText: React.FC<FormInputProps> = ({ control, name, ...otherProps }) => {
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

interface FormInputDateProps<T extends FieldValues> {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    mode: "date" | "time" | "datetime";
    minimumDate?: Date;
    maximumDate?: Date;
}

const FormInputDate = <T extends FieldValues>({ control, name, label, mode = "date", ...otherProps }: FormInputDateProps<T>) => {
    
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <View style={styles.container}>
                    {/* Botón de Activación (Necesario ya que el Picker es Modal) */}
                    <Text style={styles.label}>{label}</Text>
                    <Button 
                        title={value ? value.toLocaleDateString() : `Seleccionar ${mode}`}
                        onPress={showDatePicker}
                    />

                    {/* El Selector Modal */}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode={mode}
                        date={value || new Date()} // El valor inicial debe ser un Date válido
                        
                        // 1. Enlace con React Hook Form:
                        // Cuando el usuario confirma, el valor (date) se pasa al onChange de RHF.
                        onConfirm={(date) => {
                            onChange(date); // RHF actualiza el estado con el objeto Date
                            hideDatePicker();
                            onBlur(); // Opcional: Para disparar la validación 'onBlur' inmediatamente
                        }}
                        
                        onCancel={hideDatePicker}
                        {...otherProps}
                    />
                    
                    {error && <Text style={styles.errorMessage}>
                        {error.message}
                    </Text>}
                </View>
            )}
        />
    );
};

export { FormInputDate, FormInputText };


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
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  }
});