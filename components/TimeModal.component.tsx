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
  availableTimeSlots: any[];
  availableTimeModal: boolean;
  toggleTimeModal: () => void;
  onSelectATimeSlot: (item: any) => void;
  onPressDoneBtn: (check: boolean) => void;
}

const TimeModal: React.FC<IProps> = (props: IProps) => {
  const {
    availableTimeSlots,
    availableTimeModal,
    toggleTimeModal,
    onSelectATimeSlot,
    onPressDoneBtn,
  } = props;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={availableTimeModal}
      onRequestClose={toggleTimeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {availableTimeSlots.map((item: any) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: 40,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => onSelectATimeSlot(item)}
                >
                  {!item.selected ? (
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
            onPress={() => onPressDoneBtn(true)}
          >
            <Text style={styles.textStyle}>Done</Text>
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

export default TimeModal;
