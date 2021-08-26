import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import moment from "moment";
import days from "./assets/static/days.json";
import timeSlots from "./assets/static/timeslots.json";
import DaysModal from "./components/DayModal.component";
import TimeModal from "./components/TimeModal.component";

interface IState {
  availableDays: any[];
  availableTimeSlots: any[];
  allSelectedDays: any[];
  selectedDay: any;
  availableDaysModal: boolean;
  availableTimeModal: boolean;
}

class App extends React.Component {
  constructor(props: {}) {
    super(props);
  }

  state: IState = {
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

  // toggle day modal
  toggleDaysModal = (): void => {
    this.setState({
      availableTimeSlots: [],
      selectedDay: {},
      availableDaysModal: !this.state.availableDaysModal,
    });
  };

  // toggle time modal
  toggleTimeModal = (): void => {
    this.setState({
      availableTimeSlots: [],
      selectedDay: {},
      availableTimeModal: !this.state.availableTimeModal,
    });
  };

  // on selecting a day from modal
  onSelectADay = (day: any): void => {
    let temp: any[] = [...this.state.availableDays];
    temp[day.id].selected = true;

    // Weekday selected
    if (day.id === 0) {
      temp.forEach((t) => {
        if (t >= 2 && t <= 6) {
          t.disabled = true; // mon-fri disabled
        }
      });
    }

    // weekend selected
    if (day.id === 1) {
      temp.forEach((t) => {
        if (t >= 7 && t <= 8) {
          t.disabled = true; // sat-sun disabled
        }
      });
    }

    // mon-fri selected
    if (day.id >= 2 && day.id <= 6) {
      temp[0].disabled = true; // make weekdays disabled
    } // sat-sun selected
    else if (day.id >= 7 && day.id <= 8) {
      temp[1].disabled = true; // make weekend disabled
    }

    this.setState(
      {
        availableDaysModal: false, // close day modal
        selectedDay: { ...day },
        availableDays: [...temp],
        availableTimeSlots: [...day.timeSlots],
      },
      () => {
        // for resolving ios modal open issue
        setTimeout(() => {
          this.setState({ availableTimeModal: true }); // show time modal
        }, 500);
      }
    );
  };

  // on selecting a timeslot from modal
  onSelectATimeSlot = (timeSlot: any): void => {
    const timeSlotTemp: any[] = this.state.availableTimeSlots.map((t) => {
      let returnValue = { ...t };
      if (t.id === timeSlot.id) {
        returnValue.selected = !returnValue.selected;
      }
      return returnValue;
    });

    let dayTemp: any[] = this.state.availableDays.map((d) => {
      let returnValue = { ...d };
      if (d.id === this.state.selectedDay.id) {
        returnValue.timeSlots = [...timeSlotTemp];
      }
      return returnValue;
    });

    this.setState({
      availableDays: [...dayTemp],
      availableTimeSlots: [...timeSlotTemp],
    });
  };

  // on completing add time slots
  onPressDoneBtn = (): void => {
    const { availableDays, allSelectedDays } = this.state;

    let saveData: any[] = [...allSelectedDays];
    for (let i = 0; i < availableDays.length; i++) {
      const ele = availableDays[i];
      const indx = saveData.findIndex((d) => d.id === ele.id);
      if (indx === -1) {
        saveData = [...saveData, ele];
      } else if (indx > -1) {
        saveData = [
          ...saveData.slice(0, indx),
          ele,
          ...saveData.slice(indx + 1),
        ];
      }

      // on loop end
      if (availableDays.length - 1 === i) {
        this.setState({
          availableTimeModal: false,
          availableTimeSlots: [],
          selectedDay: {},
          allSelectedDays: [...saveData],
        });
      }
    }
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
        <Text style={styles.title}>Grey Ribbon</Text>
        {this.state.allSelectedDays &&
          this.state.allSelectedDays.map(
            (item) =>
              item.selected && (
                <View style={{ backgroundColor: "grey" }} key={item.id}>
                  <View>
                    <Text style={{ color: "white", fontSize: 18 }}>
                      {item.name}
                    </Text>
                  </View>
                  {item.timeSlots.length &&
                    item.timeSlots.map(
                      (itemTime: any) =>
                        itemTime.selected && (
                          <Text
                            key={itemTime.id}
                            style={{ color: "white", fontSize: 12 }}
                          >
                            {itemTime.name}
                          </Text>
                        )
                    )}
                </View>
              )
          )}
        <StatusBar style="auto" />
        <DaysModal
          availableDays={this.state.availableDays}
          availableDaysModal={this.state.availableDaysModal}
          toggleDaysModal={this.toggleDaysModal}
          onSelectADay={this.onSelectADay}
        />
        <TimeModal
          availableTimeSlots={this.state.availableTimeSlots}
          availableTimeModal={this.state.availableTimeModal}
          toggleTimeModal={this.toggleTimeModal}
          onSelectATimeSlot={this.onSelectATimeSlot}
          onPressDoneBtn={this.onPressDoneBtn}
        />
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
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default App;
