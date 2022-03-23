import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cityform from './Cityform';
import Results from './Results';
import Header from './Header';
import axios from 'axios';
import Errormodal from './Errormodal';
import { Last } from 'react-bootstrap/esm/PageItem';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      cityData: [],
      mapurl: '',
      error: false,
      errorMessage:'',
      showModal: false,
      weather: []
    };
  };
  hideModal= () => {
    this.setState({
      showModal: false,
    })
  }
  showModal = () => {
    this.setState({
      showModal: true,
    })
  }
  handleCityCall = async (city) => {
    console.log(process.env.REACT_APP_LOCATIONIQ_API_KEY);
   try{
    let cityData = await axios.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATIONIQ_API_KEY}&q=${city}&format=json`);
  

  this.setState({
    cityData: cityData.data
  });
  console.log(this.state.cityData);
  } catch (error) {
    console.log('error', error.response);
    this.setState({
      error: true,
      showModal: true,
      errorMessage: `An error has been caught: ${error.response.status} ${error.response.statusText}`
    });
    console.log(this.state.errorMessage);
  }
  }

handleGetWeather = async () => {
try {
  const weatherQuery = await axios.get(`${process.env.REACT_APP_SERVER}/weather-data`, {params: {lon: this.state.cityData.lon, lat: this.state.cityData.lat}});
  this.setState({
    weather: weatherQuery
  }) 
  console.log(this.state.weather); 
 } catch (error) {
  console.log(error);
}
}

  render(){
    let cityResults = this.state.cityData.map((city, index) => {
      console.log(index)
      return(
      <Results
      key={index}
      city={city}
      />
      );
    }
  );
  return (
    <>
    <Header/>
    <Cityform
    handleCityCall={this.handleCityCall}
    />
    <main>
    {cityResults}
    </main>
    <Errormodal
    error={this.state.error}
    errorMessage={this.state.errorMessage}
    modalState={this.state.showModal}
    showModal={this.showModal}
    hideModal={this.hideModal}
    />
        </>
  );
}
}
export default App;
