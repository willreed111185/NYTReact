import axios from "axios";
const BASEURL = "http://api.nytimes.com/svc/topstories/v2/world.json?api-key=";
const APIKEY = "1a0f6f4c3108448b8a33834f4188622f";


export default {
  getBooks: function() {
    return axios.get("/api/books");
  },
  getBook: function(id) {
    return axios.get("/api/books/" + id);
  },
  deleteBook: function(id) {
    return axios.delete("/api/books/" + id);
  },
  saveBook: function(bookData) {
    console.log(bookData)
    return axios.post("/api/books", bookData);
  },
  saveNote: function(id,bookData) {
    return axios.put("/api/books/"+id, bookData);
  },
  getArticles: function() {
    return axios.get(BASEURL + APIKEY);
  }
};