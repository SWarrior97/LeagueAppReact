import React from 'react';
import { StyleSheet, Text, View,AppRegistry,Picker } from 'react-native';
import { Alert, TextInput,Button } from 'react-native';
import { ImageBackground,WebView } from 'react-native';
import { Dimensions,Image } from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer,
} from 'react-navigation';
import Profile from './screens/profile';
import ChampDetails from './screens/champDetails';
import InGame from './screens/inGame';
import { Navigation } from 'react-native-navigation';
import axios from 'axios';
import {APIKey} from './api';
import {EuWUrl} from './api'
import HTML from 'react-native-render-html';


let width = Dimensions.get('window').width; 
let height = Dimensions.get('window').height;


export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      placeholder: 'Insert Summoner Name',
      image:'./images/background.jpg',
      text:'',
      error:0,
      AccID:'',
      ID:'',
      level:'',
      profileIconId:'',
      imageIcon:'',
      solo:'',
      flex:'',
      soloIcon:'',
      flexIcon:'',
      region:'',
      vista:1,
      champName:'',
      champIcon:'',
      champName2:'',
      champIcon2:'',
      champName3:'',
      champIcon3:'',
      buildURL:'',
     };
  }
  render(){
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    
    switch(this.state.vista){
      case 1:
        //search
          return(
            <ImageBackground source={require('./images/background.jpg')} style={{width: width, height: height}}>
            <View style={styles.container}>
              <TextInput
                value={this.state.text}
                onChangeText={(text) => this.setState({text})}
                placeholder={this.state.placeholder}
              />
              <Button
                onPress={this.handleClick}
                title="Search"
              />
              
            </View>
          </ImageBackground> 
          
          
          );
        case 2:
          //profile
            return(
              <GestureRecognizer
                onSwipe={(direction, state) => this.onSwipe(direction, state)}
                onSwipeUp={(state) => this.onSwipeUp(state)}
                onSwipeDown={(state) => this.onSwipeDown(state)}
                onSwipeLeft={(state) => this.onSwipeLeft(state)}
                onSwipeRight={(state) => this.onSwipeRight(state)}
                config={config}>
              <ImageBackground source={require('./images/background.jpg')} style={{width: width, height: height}}>
                <View style={styles.container}>

                <Image
                    style={{width: 66, height: 58}}
                    source={{uri: this.state.imageIcon}}
                  />

                  <Text>{this.state.text}</Text>
                  <Text>Level {this.state.level}</Text>
                  <Text>Solo/Duo: {this.state.solo}</Text>
                 
                  <Image
                    style={{width: 66, height: 58}}
                    source={{uri:this.state.soloIcon}}
                  />
                  <Text>Flex 5vs5: {this.state.flex}</Text>
                  <Image
                    style={{width: 66, height: 58}}
                    source={{uri:this.state.flexIcon}}
                  />
                  
                </View>
              </ImageBackground> 
              </GestureRecognizer>
            );
        case 3:
          //champs
          return(
            <GestureRecognizer
                onSwipe={(direction, state) => this.onSwipe(direction, state)}
                onSwipeDown={(state) => this.onSwipeDown3(state)}
                config={config}>
                <ImageBackground source={require('./images/background.jpg')} style={{width: width, height: height}}>
                <View style={styles.container}>
                  <Image
                    style={{width: 66, height: 58}}
                    source={{uri:this.state.champIcon}}
                  />
                  <Text>{this.state.champName}</Text>

                  <Image
                    style={{width: 66, height: 58}}
                    source={{uri:this.state.champIcon2}}
                  />
                  <Text>{this.state.champName2}</Text>

                  <Image
                    style={{width: 66, height: 58}}
                    source={{uri:this.state.champIcon3}}
                  />
                  <Text>{this.state.champName3}</Text>
                  
                </View>
              </ImageBackground> 
            </GestureRecognizer>
          ); 
        case 4:
            return(
              <GestureRecognizer
              onSwipe={(direction, state) => this.onSwipe(direction, state)}
              onSwipeRight={(state) => this.onSwipeRightChampBuild(state)}
              onSwipeLeft={(state) => this.onSwipeLeftChampBuild(state)}
              config={config}>
                    <View style={styles.container}>
                    <HTML html={this.state.buildURL} imagesMaxWidth={Dimensions.get('window').width} />
                    </View>
              </GestureRecognizer>
            );

    }
  }


  onSwipeLeftChampBuild = (gestureState) => {
    this.setState({vista:2});
  }

  onSwipeRightChampBuild = (gestureState) => {
    this.setState({vista:2});
  }
  

  handleClick = () => {
    if(this.state.text != ''){
      this.retrieveData();
      this.setState({vista: 2});
    }else{
      Alert.alert('Enter a summmoner Name');
    }
  }

  onSwipeDown3 = (gestureState) => {
    //console.log(this.state.champName);
    this.setState({vista:2});
  }

  onSwipeUp = (gestureState) => {
    //Alert.alert("up");
    //TODO CHAMPS
    var champNome = '';
    var champImage = '';
    var champNome2 = '';
    var champImage2 = '';
    var champNome3 = '';
    var champImage3 = '';
    axios.get('https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/'+this.state.ID+'?api_key='+APIKey)
          .then(response2 => {
            axios.get('http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json')
                  .then(response => {
                      Object.keys(response.data.data).forEach(function(key) {
                        let champKey = response.data.data[key].key;

                        for(let i = 0;i<3;i++){
                          let champId = response2.data[i]["championId"];
                          console.log(response2.data[i]);
                          if(champId == champKey){
                            //console.log(champId);
                            let champPoint = "Level" +response2.data[i]["championLevel"] +"\n\t"+ response2.data[i]["championPoints"] + " pts";
                            switch(i){
                              case 0:
                                champNome = key + "\n\t" + champPoint;
                                
                                champImage = 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/'+key+'_0.jpg';
                              //console.log("teste2");
                              break;
                              case 1:
                                  champNome2 = key + "\n\t" + champPoint;
                                  champImage2 = 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/'+key+'_0.jpg';
                              break;
                              case 2:
                                  champNome3 = key + "\n\t" + champPoint;
                                  champImage3 = 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/'+key+'_0.jpg';
                              break;
                            }
                          }
                         
                        }
                        
                      });
                      
                      this.setState({
                        champName:champNome,
                        champIcon:champImage,
                        champName2:champNome2,
                        champIcon2:champImage2,
                        champName3:champNome3,
                        champIcon3:champImage3
                      });
                      this.setState({vista:3});
                    })
                  .catch(error => {
                    console.log(error);
                  });
          })
          .catch(error => {
            console.log(error);
          });
  }
 
  onSwipeDown = (gestureState)=> {
    Alert.alert("down");
  }
 
  onSwipeLeft = (gestureState) => {
    //Alert.alert("left");
    this.setState({
      buildURL:'https://u.gg/lol/champions/vayne/build',
      vista:4
    });
    
  }
 
  onSwipeRight= (gestureState) =>{
    this.setState({
      vista:1,
      text: '',
      solo: '',
      flex: '',
      AccID:'',
      ID:'',
      level:'',
      profileIconId:'',
      image:'',
      solo:'',
      flex:'',
      soloIcon:'',
      flexIcon:''
    });
   }

   retrieveData = () =>{
      axios.get('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+this.state.text+'?api_key='+APIKey)
        .then(response => {
          this.setState({AccID: response.data.accountId});
          this.setState({ID: response.data.id});
          this.setState({level: response.data.summonerLevel});
          this.setState({profileIconId: response.data.profileIconId});
          let url = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/img/profileicon/'+response.data.profileIconId+'.png';
          this.setState({imageIcon: url});

          axios.get('https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/'+ response.data.id +'?api_key='+APIKey)
            .then(response => {
             
              for(let i = 0; i < response.data.length; i++){
                if(response.data[i].queueType == "RANKED_SOLO_5x5"){
                  let rank = response.data[i].tier +' '+response.data[i].rank + '\n\t'+response.data[i].leaguePoints +' LP';
                  
                  let tier = response.data[i].tier;

                  switch(tier){
                    case 'IRON':
                        this.setState({soloIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Iron_1.png'});
                      break;
                      case 'BRONZE':
                          this.setState({soloIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Bronze_1.png'});
                      break;
                      case 'SILVER':
                          this.setState({soloIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Silver_1.png'});
                      break;
                      case 'GOLD':
                          this.setState({soloIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Gold_1.png'});
                      break;
                      case 'PLATINUM':
                          this.setState({soloIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Platinum_1.png'});
                      break;
                      case 'DIAMOND':
                          this.setState({soloIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Diamond_1.png'});
                      break;
                      case 'MASTER':
                          this.setState({soloIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Master_1.png'});
                      break;
                      case 'GRANDMASTER':
                          this.setState({soloIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Grandmaster_1.png'});
                      break;
                      case 'CHALLENGER':
                          this.setState({soloIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Challenger_1.png'});
                      break;
                  }

                  this.setState({solo: rank});
                }else if(response.data[i].queueType == "RANKED_FLEX_SR"){
                  let rank = response.data[i].tier +' '+response.data[i].rank+ '\n\t'+response.data[i].leaguePoints +' LP';
                  this.setState({flex: rank});
                  
                  let tier = response.data[i].tier;

                  switch(tier){
                    case 'IRON':
                        this.setState({flexIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Iron_1.png'});
                      break;
                      case 'BRONZE':
                          this.setState({flexIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Bronze_1.png'});
                      break;
                      case 'SILVER':
                          this.setState({flexIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Silver_1.png'});
                      break;
                      case 'GOLD':
                          this.setState({flexIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Gold_1.png'});
                      break;
                      case 'PLATINUM':
                          this.setState({flexIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Platinum_1.png'});
                      break;
                      case 'DIAMOND':
                          this.setState({flexIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Diamond_1.png'});
                      break;
                      case 'MASTER':
                          this.setState({flexIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Master_1.png'});
                      break;
                      case 'GRANDMASTER':
                          this.setState({flexIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Grandmaster_1.png'});
                      break;
                      case 'CHALLENGER':
                          this.setState({flexIcon: 'https://img.rankedboost.com/wp-content/uploads/2016/06/Season_2019_-_Challenger_1.png'});
                      break;
                  }
                }
              }
            })
            .catch(error => {
              console.log(error);
            });

        })
        .catch(error => {
          console.log(error);
        });
   }

  onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
        break;
      case SWIPE_DOWN:
        break;
      case SWIPE_LEFT:
        break;
      case SWIPE_RIGHT:
        break;
    }
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    marginTop: 20,
    maxHeight: 200,
    width: 320,
    flex: 1
  },
});
