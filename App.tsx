import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import moment from "moment";
import days from "./assets/static/days.json";
import timeSlots from "./assets/static/timeslots.json";

class App extends React.Component {
  constructor(props: {}) {
    super(props);
  }

  state = {
    dt: moment("08:00PM", ["h:mm A"]),
    availableDays: [], // to show in dropdown
    availableTimeSlots: [], // to show in dropdown (filled when day is selected otherwise empty)
    allSelectedDays: [], // to show in grey ribbon
    selectedDay: {}, // when a day is selected
    availableDaysModal: false, // for showing days modal
    availableTimeModal: false, // for showing time modal
  };

  componentDidMount = () => {
    this.getDaysTimeSlotsData();
  };

  // get data from json and make it ready to use
  getDaysTimeSlotsData = () => {
    let t: any[] = [...timeSlots];
    t.forEach((ts) => {
      ts.startTime = moment(ts.startTime, ["h:mm A"]);
      ts.endTime = moment(ts.endTime, ["h:mm A"]);
    });

    let d: any[] = [...days];
    d.forEach((ds) => {
      ds.timeSlots = [...t];
    });

    this.setState({ availableDays: [...d] });
  };

  // Render and show Day modal
  renderDayModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.availableDaysModal}
        onRequestClose={() => {
          this.setState({ availableDaysModal: false });
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {this.state.availableDays.map((item: any) => (
                <View key={item.id}>
                  <TouchableOpacity
                    style={{
                      width: "100%",
                      height: 40,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {}}
                    disabled={item.disabled}
                  >
                    {!item.disabled ? (
                      <Text>{item.name}</Text>
                    ) : (
                      <Text style={styles.disabledTextDropdown}>
                        {item.name}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => this.setState({ availableDaysModal: false })}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => this.setState({ availableDaysModal: true })}
        >
          <Text style={styles.textStyle}>Show Days Modal</Text>
        </Pressable>
        <StatusBar style="auto" />
        {this.renderDayModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
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

export default App;
