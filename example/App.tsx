import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import inbrain, { InBrainReward } from 'inbrain-surveys';



const BridgeButton = (props: any) => {
  return <TouchableOpacity style={styles.buttonContainer} onPress={props.onPress}>
    <Text style={styles.buttonText}>{props.name}</Text>
  </TouchableOpacity>;
}

interface IAppState {
  logs: string[];
  rewards: InBrainReward[];
}

export default class App extends Component<{},IAppState> {

  constructor(props:{}) {
    super(props);
    this.state = {rewards: [], logs: []};
  }

  componentDidMount() {
    const clientId = 'CLIENT_ID';
    const clientSecret = 'SECRET_ID'; 

    var userId = "react-testing@inbrain.ai";

    //@ts-ignore
    this.callBridge('init', inbrain.init, clientId, clientSecret)();   
    //@ts-ignore 
    this.callBridge('setAppUserId', inbrain.setAppUserId, userId)();    
  }

  callBridge = (name: string, getPromise: (...args: any[]) => Promise<any>, ...params: any[]) => () => {
    getPromise(...params).then((result:any) => {
      this.setState({
        logs: this.state.logs.concat(`[${name} SUCCESS] => ${result}`)
      });
    }).catch( (err: any) => {     
      this.setState({
        logs: this.state.logs.concat(`[${name} ERROR] => ${err}`)
      });
    });
  };

  render() {
    return (
    <SafeAreaView style={styles.container}>

      <View>
        
        <Text style={styles.title}>SDK Methods</Text>
        <View style={styles.buttonsContainer}>
          <BridgeButton name="showSurveys" onPress={this.callBridge("showSurveys", inbrain.showSurveys)} />
          <BridgeButton name="getRewards" onPress={this.callBridge("getRewards", inbrain.getRewards)} />
          <BridgeButton name="confirmRewards" onPress={this.callBridge("confirmRewards", inbrain.confirmRewards, this.state.rewards)} />
        </View>
      </View>
      <View>
        <Text style={styles.title}>Rewards</Text>

        {this.state.rewards.map((r,i) => (
          <Text style={styles.message} key={r.transactionId}>
            [ Reward {i} ] id={r.transactionId} / amount={r.amount} / currency={r.currency} / transactionType={r.transactionType}
          </Text>
        ))}
      </View>

      <Text style={styles.title}>Logs</Text>
      <ScrollView style={{ flexGrow: 1 }}>
        {this.state.logs.map((m, i) => (
          <Text style={styles.message} key={i}>
            {m}
          </Text>
        ))}
      </ScrollView>

    </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    margin: 30,
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold'
  },
  message: {
    fontSize: 10,
    textAlign: 'left'
  },
  buttonsContainer: {
    alignContent: 'center'
  },
  buttonContainer: {
    backgroundColor: '#2196F3',
    margin: 1,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white'
  },
});
