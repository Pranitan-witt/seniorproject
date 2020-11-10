import React, { Component, Fragment } from "react";
import "./home.css";
import { Container, Row, Form, Input, FormGroup, Col } from "reactstrap";

class Home extends Component {
  componentDidMount() {
    document.title = "VDegree | Home";
  }
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
                  <Form>
                    <FormGroup>
                      <Input
                        type="password"
                        name="password"
                        id="inputPass"
                        placeholder="Enter your password"
                      />
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
