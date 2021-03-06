import React, { Component } from 'react'
import {Grid, Segment, Header, Tab, Button, Form, Image, Label, Icon} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {
  updateUserAccount, 
  getCurrentUser, 
  deleteTimetable,
  updatePlace,
  removeFromListQuery,
  getAllTimetables,
  getSavedPlaces
 } from '../actions/APIsearch';
import Timetable from './Timetable';
import {Link} from 'react-router-dom';


class MyPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      user: {
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        image: ''
      },
      updateAccount: false,
      showTimetable: true,
      errors: false
    };
    this.handleClick=this.handleClick.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateTimetablePlace = this.updateTimetablePlace.bind(this);
    this.handleRemoveFromList = this.handleRemoveFromList.bind(this);
    this.handleUpdateInformation = this.handleUpdateInformation.bind(this)
  }

  async componentDidMount(){
    await this.props.getAllTimetables();
    const {user} = this.props;
    this.setState({
      ...this.state,
      user: {
        ...this.state.user,
        username: user.username,
        email: user.email,
        image: user.image
      }
    });
    this.baseState = {
      user: {
        username: user.username,
        email: user.email,
        password: '',
        password_confirmation: '',
        image: user.image,
      },
      updateAccount: false,
      showTimetable: true,
      errors: false
    };
  }

  handleCancel(){
    this.setState(this.baseState)
  }

  handleClick(){
    this.setState({updateAccount: true, showTimetable: false, errors: false})
  }

  handleUpdateInformation(event){
    const {name, value} = event.target
    if (value !== ''){this.setState({...this.state, user:{...this.state.user, [name]: value}})}
  }


  handleSubmit(event){
    event.preventDefault();
    if (this.state.user.password === this.state.user.password_confirmation) {
      this.props.updateUserAccount(this.state.user)
      this.setState({...this.state, updateAccount: false, showTimetable: true, errors: false})
    }
    else {this.setState({errors : true})}
  }

  async updateTimetablePlace(place){
    await this.props.updatePlace(place);
    this.props.getAllTimetables()
  }

  async handleRemoveFromList(place){
    await this.props.removeFromListQuery(place);
    this.props.getAllTimetables()
  }

  async handleDeleteTimetable(id){
    await this.props.deleteTimetable(id)
    this.props.getSavedPlaces()
  }

  render() {
    const {user} = this.state;
    const panes = this.props.timetables.map(timetable => (
      { menuItem: timetable.name, 
        pane: (
          <Tab.Pane key={timetable.id}>
            <Timetable timetable={timetable} updatePlace={this.updateTimetablePlace} handleDelete={this.handleRemoveFromList}/>
            <Button floated='right' size='mini' color='teal' onClick={() => this.handleDeleteTimetable(timetable.id)}>Delete this timetable</Button>
          </Tab.Pane>
        )
      })
    )
    return (
      <div id='myPage'>
        <br/>
          <Image src={user.image} size='small' circular centered bordered/>
          <Header as='h2' textAlign='center'>
            <Header.Content>{user.username}</Header.Content>
            <Header.Subheader>{user.email}</Header.Subheader>
            <Button color='teal' size='mini' onClick={this.handleClick}>Update Account</Button>
          </Header>
        <br/>
        <Grid>
          <Grid.Row>
            <Grid.Column width={2}></Grid.Column>
            <Grid.Column width={12}>
            {this.state.updateAccount &&
              <Segment color='blue'>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group widths='equal'>
                  <Form.Input label='Username' name='username' value={user.username} placeholder={this.props.user.username} onChange={this.handleUpdateInformation} />
                  <Form.Input label='Email' name='email' value={user.email} placeholder={this.props.user.email} onChange={this.handleUpdateInformation} />
                  <Form.Input label='Link to your profile picture' name='image' placeholder='Picture of size 200x200 if possible' onChange={this.handleUpdateInformation}/>
                </Form.Group>
                <br/>
                <Form.Group widths='equal'>
                  <Form.Input label='Password' type='password' name='password' placeholder='Password' value={user.password} onChange={this.handleUpdateInformation} required/>
                  <Form.Input label='Password Confirmation' type='password' name='password_confirmation' value={user.password_confirmation} placeholder='Password Confirmation' onChange={this.handleUpdateInformation} required/>
                </Form.Group>
                {this.state.errors && <Header as='h5' color='red'>Passwords do not match/present. Please try again!</Header>}
                <br/>
                <Button type='submit' color='blue'>Update</Button><Button type='button' onClick={this.handleCancel}>Cancel</Button>
              </Form>
              </Segment>
            }
            {this.state.showTimetable &&
              <Segment color='teal'>
                <Header as='h1' color='blue'>Timetables</Header>
                {this.props.timetables.length === 0 && 
                  <Label as={Link} to='/'><Icon name='plus' /> Search for places</Label>
                }
                <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={panes}  renderActiveOnly={false}/>
              </Segment>
            }
            </Grid.Column>
            <Grid.Column width={2}></Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.currentUser.user,
    timetables: state.timetables.all
  }
}


const mapDispatchToProps = dispatch => {
  return {
    getCurrentUser: id => dispatch(getCurrentUser(id)),
    updateUserAccount: user => dispatch(updateUserAccount(user)),
    deleteTimetable: id => dispatch(deleteTimetable(id)),
    removeFromListQuery: place => dispatch(removeFromListQuery(place)),
    updatePlace: place => dispatch(updatePlace(place)),
    getAllTimetables: () => dispatch(getAllTimetables()),
    getSavedPlaces: () => dispatch(getSavedPlaces())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);
