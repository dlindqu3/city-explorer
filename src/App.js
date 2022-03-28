import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cityform from './Cityform';
import Results from './Results';
import Header from './Header';
import Movies from './Movies.js'; 
import axios from 'axios';
import Errormodal from './Errormodal';
import ListGroup from 'react-bootstrap/ListGroup';
// import { Last } from 'react-bootstrap/esm/PageItem';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      cityData: null,
      cityName: '', 
      mapurl: '',
      error: false,
      errorMessage:'',
      showModal: false,
      weather: [], 
      movieData: [], 
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
   try{
    let cityData = await axios.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATIONIQ_API_KEY}&q=${city}&format=json`);
  

  this.setState({
    cityData: cityData.data[0],
    cityName: city,
  });
  // console.log('this.state.cityName: ', this.state.cityName);
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
  // console.log(process.env.REACT_APP_SERVER); 
  const weatherQuery = await axios.get(`${process.env.REACT_APP_SERVER}/weather`, {params: {lon: this.state.cityData.lon, lat: this.state.cityData.lat}});

  let weatherArray = weatherQuery.data.slice(0,3);

  this.setState({
    weather: weatherArray
  }) 
  // console.log(this.state.weather); 
 } catch (error) {
  console.log(error);
}
}

handleGetMovies = async () => {
  let url = `${process.env.REACT_APP_SERVER}/movies?cityName=${this.state.cityName}`;
  console.log(url); 

  try {
    const movieQuery = await axios.get(url); 
    this.setState({
      movieData: movieQuery.data,
    }) 
    // console.log(this.state.movieData); 
    console.log(movieQuery.data);
  } catch (error){
    console.log(error)
  } 
}

  render(){
  return (
    <>
    <Header/>
    <Cityform
    handleCityCall={this.handleCityCall}
    handleGetWeather={this.handleGetWeather}
    handleGetMovies={this.handleGetMovies}
    />
    <main>
    
    {this.state.cityData ? 
    <Results
      // key={index}
      city={this.state.cityData}
      />
      : <></>
    }
    
    <ListGroup>
      {
        this.state.weather.map((weatherDay, idx) => (
          <ListGroup.Item key={idx}>{weatherDay.date}: {weatherDay.description}</ListGroup.Item>
        ))
      }
    </ListGroup>



    {/* <ul>
    {this.state.weather.map((WeatherDay, idx) => (
      <li key={idx}>{WeatherDay.date}: {WeatherDay.description}</li>
    ))}
    </ul> */}

    <br></br>

    {/* <ol>
      {this.state.movieData.map((movie, idx) => (
        <li key={idx}>{movie.title}</li>
      ))}
    </ol> */}

    <Movies
      movies={this.state.movieData}
    >
    </Movies>
    
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
