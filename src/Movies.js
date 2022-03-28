import React from 'react';
import { ListGroup } from 'react-bootstrap';

class Movies extends React.Component {
    constructor(props){
      super(props); 
      this.state = {};
    };

  render() {
    return (
      <>
      
        <ListGroup>
        {this.props.movies.map((movie, idx) => {
          return <ListGroup.Item key={idx}>{movie.title}</ListGroup.Item>
        })
      }
        </ListGroup>
      
      </>
    );
  }
}
export default Movies;