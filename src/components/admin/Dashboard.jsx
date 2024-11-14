import React, { useState } from 'react';

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
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Dashboard</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active">Dashboard v1</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="content">
        <div className="container-fluid">
          {/* Small Stat Boxes */}
          <div className="row">
            <div className="col-lg-3 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>150</h3>
                  <p>New Orders</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag"></i>
                </div>
                <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>53<sup style={{ fontSize: "20px" }}>%</sup></h3>
                  <p>Bounce Rate</p>
                </div>
                <div className="icon">
                  <i className="ion ion-stats-bars"></i>
                </div>
                <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>44</h3>
                  <p>User Registrations</p>
                </div>
                <div className="icon">
                  <i className="ion ion-person-add"></i>
                </div>
                <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>65</h3>
                  <p>Unique Visitors</p>
                </div>
                <div className="icon">
                  <i className="ion ion-pie-graph"></i>
                </div>
                <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a>
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="row">
            <section className="col-lg-7 connectedSortable">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <i className="fas fa-chart-pie mr-1"></i>
                    Sales
                  </h3>
                  <div className="card-tools">
                    <ul className="nav nav-pills ml-auto">
                      <li className="nav-item">
                        <a className="nav-link active" href="#revenue-chart" data-toggle="tab">Area</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="#sales-chart" data-toggle="tab">Donut</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body">
                  <div className="tab-content p-0">
                    <div className="chart tab-pane active" id="revenue-chart" style={{ position: "relative", height: "300px" }}>
                      <canvas id="revenue-chart-canvas" height="300"></canvas>
                    </div>
                    <div className="chart tab-pane" id="sales-chart" style={{ position: "relative", height: "300px" }}>
                      <canvas id="sales-chart-canvas" height="300"></canvas>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Chat */}
              <div className="card direct-chat direct-chat-primary">
                <div className="card-header">
                  <h3 className="card-title">Direct Chat</h3>
                  <div className="card-tools">
                    <span title="3 New Messages" className="badge badge-primary">3</span>
                    <button type="button" className="btn btn-tool" data-card-widget="collapse">
                      <i className="fas fa-minus"></i>
                    </button>
                    <button type="button" className="btn btn-tool" title="Contacts" data-widget="chat-pane-toggle">
                      <i className="fas fa-comments"></i>
                    </button>
                    <button type="button" className="btn btn-tool" data-card-widget="remove">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
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
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
