import React, { Component } from "react";
import { Link,Route } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import NoMatch from "../NoMatch";
import { TextArea, FormBtn } from "../../components/Form";


class Detail extends Component {
  state = {
    book: {},
    notFound:0,
    note:''
  };

  getABook =event=>{
    API.getBook(this.props.match.params.id)
    .then(res =>
      this.setState({
        book: res.data,
      })
    ).catch(err => 
      this.setState({notFound:1})
    )
  }

    componentDidMount() {
    this.getABook();
  } 

  handleInputChange = event => {
    let newState = {...this.state.book};
    newState.note=event.target.value;
    this.setState({book:newState})
  };

  handleFormSubmit = event => {
    event.preventDefault();
      API.saveNote(
        this.props.match.params.id,
      {
        note: this.state.book.note,
        title: this.state.book.title,
        author: this.state.book.author,
        synopsis: this.state.book.synopsis
      }
      )
         .then(res => this.getABook())
         .catch(err => console.log(err));
      console.log(this.state)
    };

  renderWhich(){ 
    if(this.state.notFound===0){
      return (
        <Container fluid>
          <Row>
            <Col size="md-2">
              <Link to="/">← Back to Articles</Link>
            </Col>
          </Row>
          <Row>
            <Col size="md-12">
              <Jumbotron>
                <h1>
                  {this.state.book.title}
                </h1>
                <h2>
                  by {this.state.book.author}
                </h2>
              </Jumbotron>
            </Col>
          </Row>
          <Row>
            <Col size="md-10 md-offset-1">
              <article>
                <h1>Synopsis</h1>
                <p>
                  {this.state.book.synopsis}
                </p>
              </article>
            </Col>
          </Row>
          <Row>
            <Col size="md-12">
              <Jumbotron>
                <h2>My Notes</h2>
                <form>
                  <TextArea
                    name="note"
                    value={this.state.book.note}
                    onChange = {this.handleInputChange}
                    style={{ height: 150 }}
                  />
                  <FormBtn
                    onClick={this.handleFormSubmit}
                  >
                    Submit Note
                  </FormBtn>
              </form>
              </Jumbotron>
            </Col>
          </Row>
        </Container>
      )
    }else{
      return(<Route component={NoMatch} />)
    }
  }

  render() {
    return(this.renderWhich())
  }
}

export default Detail;
