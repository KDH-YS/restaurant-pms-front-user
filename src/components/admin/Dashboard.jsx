import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Breadcrumb, Nav, Tab } from 'react-bootstrap';

// 기본 스타일은 클래스로 지정된 스타일을 활용합니다.
const Dashboard = () => {
  const [messages] = useState([
    { user: "Alexander Pierce", time: "23 Jan 2:00 pm", message: "Is this template really for free? That's unbelievable!", imgSrc: "dist/img/user1-128x128.jpg" },
    { user: "Sarah Bullock", time: "23 Jan 2:05 pm", message: "You better believe it!", imgSrc: "dist/img/user3-128x128.jpg" },
    { user: "Alexander Pierce", time: "23 Jan 5:37 pm", message: "Working with AdminLTE on a great new app! Wanna join?", imgSrc: "dist/img/user1-128x128.jpg" },
    { user: "Sarah Bullock", time: "23 Jan 6:10 pm", message: "I would love to.", imgSrc: "dist/img/user3-128x128.jpg" }
  ]);

  return (
    <div className="content-wrapper">
      {/* Content Header */}
      <div className="content-header">
        <Container fluid>
          <Row className="mb-2">
            <Col sm={6}>
              <h1 className="m-0">Dashboard</h1>
            </Col>
            <Col sm={6}>
              <Breadcrumb className="float-sm-right">
                <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Dashboard v1</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Content */}
      <section className="content">
        <Container fluid>
          {/* Small Stat Boxes */}
          <Row>
            <Col lg={3} sm={6}>
              <Card className="small-box bg-info">
                <Card.Body>
                  <h3>150</h3>
                  <p>New Orders</p>
                  <div className="icon">
                    <i className="ion ion-bag"></i>
                  </div>
                  <Button variant="link" className="small-box-footer">
                    More info <i className="fas fa-arrow-circle-right"></i>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} sm={6}>
              <Card className="small-box bg-success">
                <Card.Body>
                  <h3>53<sup style={{ fontSize: "20px" }}>%</sup></h3>
                  <p>Bounce Rate</p>
                  <div className="icon">
                    <i className="ion ion-stats-bars"></i>
                  </div>
                  <Button variant="link" className="small-box-footer">
                    More info <i className="fas fa-arrow-circle-right"></i>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} sm={6}>
              <Card className="small-box bg-warning">
                <Card.Body>
                  <h3>44</h3>
                  <p>User Registrations</p>
                  <div className="icon">
                    <i className="ion ion-person-add"></i>
                  </div>
                  <Button variant="link" className="small-box-footer">
                    More info <i className="fas fa-arrow-circle-right"></i>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} sm={6}>
              <Card className="small-box bg-danger">
                <Card.Body>
                  <h3>65</h3>
                  <p>Unique Visitors</p>
                  <div className="icon">
                    <i className="ion ion-pie-graph"></i>
                  </div>
                  <Button variant="link" className="small-box-footer">
                    More info <i className="fas fa-arrow-circle-right"></i>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Sales Chart */}
          <Row>
            <Col lg={7}>
              <Card>
                <Card.Header>
                  <h3 className="card-title">
                    <i className="fas fa-chart-pie mr-1"></i>
                    Sales
                  </h3>
                  <div className="card-tools">
                    <Nav variant="pills" className="ml-auto">
                      <Nav.Item>
                        <Nav.Link eventKey="revenue-chart" active>
                          Area
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="sales-chart">
                          Donut
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Tab.Content>
                    <Tab.Pane eventKey="revenue-chart" style={{ position: "relative", height: "300px" }}>
                      <canvas id="revenue-chart-canvas" height="300"></canvas>
                    </Tab.Pane>
                    <Tab.Pane eventKey="sales-chart" style={{ position: "relative", height: "300px" }}>
                      <canvas id="sales-chart-canvas" height="300"></canvas>
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Card>

              {/* Direct Chat */}
              <Card className="direct-chat direct-chat-primary">
                <Card.Header>
                  <h3 className="card-title">Direct Chat</h3>
                  <div className="card-tools">
                    <span title="3 New Messages" className="badge badge-primary">3</span>
                    <Button variant="link" className="btn btn-tool" data-card-widget="collapse">
                      <i className="fas fa-minus"></i>
                    </Button>
                    <Button variant="link" className="btn btn-tool" title="Contacts" data-widget="chat-pane-toggle">
                      <i className="fas fa-comments"></i>
                    </Button>
                    <Button variant="link" className="btn btn-tool" data-card-widget="remove">
                      <i className="fas fa-times"></i>
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="direct-chat-messages">
                    {messages.map((msg, index) => (
                      <div key={index} className={`direct-chat-msg ${index % 2 === 0 ? "" : "right"}`}>
                        <div className="direct-chat-infos clearfix">
                          <span className={`direct-chat-name ${index % 2 === 0 ? "float-left" : "float-right"}`}>{msg.user}</span>
                          <span className={`direct-chat-timestamp ${index % 2 === 0 ? "float-right" : "float-left"}`}>{msg.time}</span>
                        </div>
                        <img className="direct-chat-img" src={msg.imgSrc} alt="message user image" />
                        <div className="direct-chat-text">{msg.message}</div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Dashboard;
