import React, { Component } from 'react';
import swal from '@sweetalert/with-react'
import './App.css';

class App extends Component {
  render() {
    return (
      
      <div className="wrapper" style={ { height: "auto", minHeight: "100%"} }>
        <header className="main-header">
          <nav className="navbar navbar-static-top">
            <div className="container">
              <div className="navbar-header">
                <a href="#" className="navbar-brand"><b>Admin</b>LTE</a>
              </div>
            </div>
              
          </nav>
        </header>

        <div className="content-wrapper">
          <div className="container">
            <section className="content-header">
              <h1>
                Top Navigation
                <small>Example 2.0</small>
              </h1>
            </section>

            <section className="content">
              <div className="box box-primary">
              <div className="box-header with-border">
                <h3 className="box-title">Inbox</h3>
              </div>
              <div className="box-body no-padding">
                <div className="mailbox-controls">
                  <button type="button" className="btn btn-default btn-sm checkbox-toggle"><i className="fa fa-square-o"></i>
                  </button>
                  <div className="btn-group">
                    <button type="button" className="btn btn-default btn-sm"><i className="fa fa-trash-o"></i></button>
                    <button type="button" className="btn btn-default btn-sm"><i className="fa fa-reply"></i></button>
                    <button type="button" className="btn btn-default btn-sm"><i className="fa fa-share"></i></button>
                  </div>
                  <button type="button" className="btn btn-default btn-sm"><i className="fa fa-refresh"></i></button>
                </div>
                <div className="table-responsive mailbox-messages">
                  <table className="table table-hover table-striped">
                    <tbody>
                    <tr>
                      <td>
                        #
                      </td>
                      <td className="mailbox-star"><a href="#"><i className="fa fa-star text-yellow"></i></a></td>
                      <td className="mailbox-name"><a href="read-mail.html">Alexander Pierce</a></td>
                      <td className="mailbox-subject"><b>AdminLTE 2.0 Issue</b> - Trying to find a solution to this problem...
                      </td>
                      <td className="mailbox-attachment"></td>
                      <td className="mailbox-date">5 mins ago</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="box-footer padding">
                <div className="mailbox-controls">
                  <div className="pull-right">
                    1-50/200
                    <div className="btn-group">
                      <button type="button" className="btn btn-default btn-sm"><i className="fa fa-chevron-left"></i></button>
                      <button type="button" className="btn btn-default btn-sm"><i className="fa fa-chevron-right"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
