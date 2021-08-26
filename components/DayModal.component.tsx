import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface IProps {
  availableDays: any[];
  availableDaysModal: boolean;
  toggleDaysModal: () => void;
  onSelectADay: (item: any) => void;
}

const DaysModal: React.FC<IProps> = (props: IProps) => {
  const { availableDays, availableDaysModal, toggleDaysModal, onSelectADay } =
    props;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={availableDaysModal}
      onRequestClose={toggleDaysModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {availableDays.map((item: any) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: 40,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => onSelectADay(item)}
                  disabled={item.disabled}
                >
                  {!item.disabled ? (
                    <Text>{item.name}</Text>
                  ) : (
                    <Text style={styles.disabledTextDropdown}>{item.name}</Text>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={toggleDaysModal}
          >
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "80%",
    height: "60%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "orange",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  disabledTextDropdown: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
});

export default DaysModal;
