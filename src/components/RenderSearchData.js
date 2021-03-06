import React, { Component } from 'react';
import {List, Header, Segment} from 'semantic-ui-react';

class RenderSearchData extends Component {
  handleClick = (id) => {
    this.props.handleSearch(id);
  }

  render() {
    const { places } = this.props;
    return (
      <Segment className='listPlaces'>
        <List divided animated verticalAlign='middle' id='listData'>
          {places.map(place => 
            <List.Item key={place.code} onClick={() => this.handleClick(place.code)} as='a'>
              {place.isAddedToList ? <List.Icon name='heart' color='pink' verticalAlign='middle' /> : <List.Icon name='heart outline' verticalAlign='middle' />}
              <List.Content>
                <Header as='h4' color='blue'>{place.name}</Header>
                <List.Description>{place.category}</List.Description>
              </List.Content>
            </List.Item>
          )}
        </List>
      </Segment>
    )
  }
}

export default RenderSearchData;