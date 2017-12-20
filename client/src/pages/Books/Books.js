import React, { Component } from "react";
import DeleteBtn from "../../components/DeleteBtn";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { TextArea } from "../../components/Form";
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


class Books extends Component {
  state = {
    books: [],
    savedArticles: [],
    articleTitle:"sample",
    articleContent:"sample",
    articleAuthor:"sample",
    articleNote:"sample",
    articleID:"",
    modalIsOpen: false
  };

  componentDidMount() {
    this.loadBooks();
    this.loadArticles();
  }

  openModal(index) {
    this.setState({
      modalIsOpen: true,
      articleTitle:this.state.savedArticles[index].title,
      articleContent:this.state.savedArticles[index].abstract,
      articleAuthor:this.state.savedArticles[index].byline,
      articleID:Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    });
    console.log(this.state.articleID)
  }
  closeModal() {
    this.setState({modalIsOpen: false});
  }

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({books: res.data})
      )
      .catch(err => console.log(err));
  };

  loadArticles = () => {
    API.getArticles()
      .then(results =>
        this.setState({savedArticles: results.data.results})
        )
      .catch(err => console.log(err));
  };

  deleteBook = id => {
    API.deleteBook(id)
      .then(res => this.loadBooks())
      .catch(err => console.log(err));
  };

  handleArticleSubmit = event => {
  //event.preventDefault();
  this.closeModal();
  API.saveBook(
      {
        title: this.state.articleTitle,
        author: this.state.articleAuthor,
        synopsis: this.state.articleContent,
        note: this.state.articleNote
      })
    .then(res => this.loadBooks())
    .catch(err => console.log(err));
  };

  handleInputChange = event => {
    let newNote = {...this.state.articleNote};
    newNote=event.target.value;
    this.setState({articleNote:newNote});
  };

  iterateArticles(){
    return(this.state.savedArticles.slice(0,10).map((article,index)=> (
      <ListItem key={article.title}>
          <strong>
            {article.title} by {article.author}
          </strong>
          <p>{article.abstract}</p>
        <button className={index} onClick={()=>this.openModal(index)}>Read More</button>
      </ListItem>
    )))
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h1>Top Ten Articles to Read</h1>
            </Jumbotron>
            {this.state.savedArticles.length ? (
              <List>
                {this.iterateArticles()}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h1>Saved Articles</h1>
            </Jumbotron>
            {this.state.books.length ? (
              <List>
                {this.state.books.map(book => (
                  <ListItem key={book._id}>
                    <Link to={"/books/" + book._id}>
                      <strong>
                        {book.title} by {book.author}
                      </strong>
                    </Link>
                    <DeleteBtn onClick={() => this.deleteBook(book._id)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
        <div>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Reading Content"
            ariaHideApp={false}
          >
          <h2>{this.state.articleTitle}</h2>
          <h3>{this.state.articleAuthor}</h3>
          <div>
            <p>{this.state.articleContent}</p>
          </div>
          <form>
            <TextArea
                    name="articleNote"
                    value={this.state.savedArticles.articleNote}
                    onChange = {this.handleInputChange}
                    style={{ height: 150 }}
                  />
            <button 
              onClick={this.handleArticleSubmit}
              to={"/books/"}
            >Save Article</button>
            <button onClick={()=>this.closeModal()}>Close</button>
          </form>
          </Modal>
        </div>
      </Container>
    );
  }
}

export default Books;
