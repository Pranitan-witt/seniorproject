import React, { Component, Fragment } from "react";
import "./home.css";
import { Container, Row, Col, Form, FormGroup, Input } from "reactstrap";
class Home extends Component {
  componentDidMount() {
    document.title = "VDegree | Home";
  }

  // test() {
  //   var password = document.forms["passwordForm"]["password"].value;
  //   alert(password + "It work!");
  //   return password;
  // }

  // validateForm() {
  //   var x = document.forms["myForm"]["fname"].value;
  //   if (x == "") {
  //     alert("Name must be filled out");
  //     return false;
  //   }
  // }

  render() {
    return (
      <Fragment>
        <Container fluid>
          <Row class="justify-content-center">
            <div id="top">
              <h1>VDGREE</h1>
            </div>
            <div id="middle"></div>
            <div id="buttom">
              <Col sm="6">
                <center>
                  <Form
                    name="passwordForm"
                    onsubmit="return test()"
                    // method="post"
                  >
                    <FormGroup>
                      <Input
                        type="password"
                        id="inputPass"
                        name="password"
                        placeholder="Enter your password"
                      />
                      {/* <input type="submit" value="เริ่มใช้งานระบบ"></input> */}
                    </FormGroup>
                  </Form>
                  <button>เริ่มใช้งานระบบ</button>
                </center>
              </Col>
            </div>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default Home;
