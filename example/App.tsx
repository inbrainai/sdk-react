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

    // Init and setAppUserId
    this.callBridge('init', inbrain.init,this.void, clientId, clientSecret)();   
    this.callBridge('setAppUserId', inbrain.setAppUserId, this.void, userId)(); 
    
    // OnClose listener
    inbrain.setOnCloseListener(() => this.setState({
      logs: this.state.logs.concat(`[onClose SUCCESS] => listener`)
    }));
  }

  callBridge = (name: string, getPromise: (...args: any[]) => Promise<any>, setResult?: (obj: any) => void, ...params: any[]) => () => {
    getPromise(...params).then((result:any) => {
      setResult && setResult(result);
      this.setState({
        logs: this.state.logs.concat(`[${name} SUCCESS] => ${result}`)
      });
    }).catch( (err: any) => {     
      this.setState({
        logs: this.state.logs.concat(`[${name} ERROR] => ${err}`)
      });
    });
  };

  void = (obj:any) => {};
  setRewards = (rewards: InBrainReward[]) => this.setState({rewards});

  render() {
    return (
    <SafeAreaView style={styles.container}>

      <View>
        
        <Text style={styles.title}>SDK Methods</Text>
        <View style={styles.buttonsContainer}>
          <View style={{flexGrow:1, margin: 2}}>
            <BridgeButton name="showSurveys" onPress={this.callBridge("showSurveys", inbrain.showSurveys)} />
            <BridgeButton name="getRewards" onPress={this.callBridge("getRewards", inbrain.getRewards, this.setRewards)} />
            <BridgeButton name="confirmRewards" onPress={this.callBridge("confirmRewards", inbrain.confirmRewards, this.void, this.state.rewards)} />
          </View>
          <View style={{flexGrow:1, margin: 2}}>
            <BridgeButton name="setTitle" onPress={this.callBridge("setTitle", inbrain.setTitle, this.void, "InBrain Example Webview")} />
            <BridgeButton name="setNavbarColor" onPress={this.callBridge("setNavbarColor", inbrain.setNavbarColor, this.void, "#ff0000")} />
            <BridgeButton name="setButtonColor" onPress={this.callBridge("setButtonColor", inbrain.setButtonColor, this.void, "#ffffff")} />
          </View>
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
    alignContent: 'center',
    flexDirection: 'row'
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
