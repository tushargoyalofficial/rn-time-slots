import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Button,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
    this.setState(
      {
        availableDaysModal: false, // close day modal
        selectedDay: { ...day }, // set single day obj in state
        availableTimeSlots: [...day.timeSlots], // set time slots for selected day to show in dropdown
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
        returnValue.selected = !returnValue.selected; // select/unselect time slot for a day
      }
      return returnValue;
    });

    let dayTemp: any[] = this.state.availableDays.map((d) => {
      let returnValue = { ...d };
      if (d.id === this.state.selectedDay.id) {
        returnValue.selected = true; // make day selected
        returnValue.timeSlots = [...timeSlotTemp]; // set time slot with selection changes
      }
      return returnValue;
    });

    let temp: any[] = [...dayTemp];
    const day = this.state.selectedDay;

    // Weekday selected
    if (day.id === 0) {
      temp.forEach((t) => {
        if (t.id >= 2 && t.id <= 6) {
          t.disabled = true; // mon-fri disabled
        }
      });
    }

    // weekend selected
    if (day.id === 1) {
      temp.forEach((t) => {
        if (t.id >= 7 && t.id <= 8) {
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

    this.setState({
      availableDays: [...temp],
      availableTimeSlots: [...timeSlotTemp],
    });
  };

  // on completing add time slots
  onPressDoneBtn = (): void => {
    const { availableDays, allSelectedDays } = this.state;

    let saveData: any[] = [...allSelectedDays];
    if (availableDays.length) {
      for (let i = 0; i < availableDays.length; i++) {
        const ele = { ...availableDays[i] };
        // only selected days
        if (ele.selected) {
          ele.timeSlots = [...ele.timeSlots].filter(
            (f: any) => f.selected === true
          ); // only selected time
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
    }
  };

  // remove particular day from ribbon
  removeDay = (day: any) => {
    let t: any[] = [...timeSlots];
    t.forEach((ts) => {
      ts.startTime = moment(ts.startTime, ["h:mm A"]);
      ts.endTime = moment(ts.endTime, ["h:mm A"]);
    });
    let temp: any[] = [...this.state.availableDays];
    temp[day.id].selected = false; // unselect day
    temp[day.id].timeSlots = [...t]; // reset time slots for day

    // Weekday enabled
    if (day.id === 0) {
      temp.forEach((t) => {
        if (t.id >= 2 && t.id <= 6) {
          t.disabled = false; // mon-fri enabled
        }
      });
    }

    // Weekend enabled
    if (day.id === 1) {
      temp.forEach((t) => {
        if (t.id >= 7 && t.id <= 8) {
          t.disabled = false; // sat-sun enabled
        }
      });
    }

    // mon-fri enabled
    if (day.id >= 2 && day.id <= 6) {
      const search = this.state.allSelectedDays.find(
        (x) =>
          (x.id === 2 && x.selected === true) ||
          (x.id === 3 && x.selected === true) ||
          (x.id === 4 && x.selected === true) ||
          (x.id === 5 && x.selected === true) ||
          (x.id === 6 && x.selected === true)
      );
      if (!search) {
        temp[0].disabled = false; // make weekdays enabled
      }
    } // sat-sun enabled
    else if (day.id >= 7 && day.id <= 8) {
      const search = this.state.allSelectedDays.find(
        (x) =>
          (x.id === 7 && x.selected === true) ||
          (x.id === 8 && x.selected === true)
      );
      if (!search) {
        temp[1].disabled = false; // make weekend enabled
      }
    }

    this.setState(
      {
        availableDays: [...temp],
      },
      () => {
        const { availableDays, allSelectedDays } = this.state;

        let saveData: any[] = [...allSelectedDays];
        if (availableDays.length) {
          for (let i = 0; i < availableDays.length; i++) {
            const ele = { ...availableDays[i] };
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
        }
      }
    );
  };

  // remove particular time of day from ribbon
  removeTime = (day: any, time: any) => {
    const timeSlotTemp: any[] = day.timeSlots.map((t: any) => {
      let returnValue = { ...t };
      if (t.id === time.id) {
        returnValue.selected = !returnValue.selected; // select/unselect time slot for day
      }
      return returnValue;
    });

    let dayTemp: any[] = this.state.availableDays.map((d) => {
      let returnValue = { ...d };
      if (d.id === day.id) {
        returnValue.timeSlots = [...timeSlotTemp]; // set timeslot for day
      }
      return returnValue;
    });

    this.setState(
      {
        availableDays: [...dayTemp],
        availableTimeSlots: [],
        selectedDay: {},
      },
      () => {
        this.onPressDoneBtn();
      }
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => this.setState({ availableDaysModal: true })}
          >
            <Text style={styles.textStyle}>Show Days Modal</Text>
          </Pressable>
        </View>
        <View style={{ flex: 4, alignItems: "center" }}>
          <Text style={styles.title}>Grey Ribbon</Text>
          <ScrollView
            style={{ flex: 1, width: "80%" }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {this.state.allSelectedDays &&
              this.state.allSelectedDays.map(
                (item) =>
                  item.selected &&
                  item.timeSlots.length && (
                    <View
                      style={{ backgroundColor: "grey", width: "80%" }}
                      key={item.id}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center",
                          padding: 6,
                        }}
                      >
                        <Text style={{ color: "white", fontSize: 18 }}>
                          {item.name}
                        </Text>
                        <Button
                          title={"X"}
                          onPress={() => {
                            this.removeDay(item);
                          }}
                        />
                      </View>
                      {item.timeSlots.length &&
                        item.timeSlots.map(
                          (itemTime: any) =>
                            itemTime.selected && (
                              <View
                                key={itemTime.id}
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  padding: 6,
                                }}
                              >
                                <Text style={{ color: "white", fontSize: 12 }}>
                                  {itemTime.name}
                                </Text>
                                <Button
                                  title={"X"}
                                  onPress={() => {
                                    this.removeTime(item, itemTime);
                                  }}
                                  disabled={item.timeSlots.length === 1}
                                />
                              </View>
                            )
                        )}
                    </View>
                  )
              )}
          </ScrollView>
        </View>

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
      </SafeAreaView>
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
