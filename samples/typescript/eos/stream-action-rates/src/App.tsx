import React, { Component } from "react";
import styled from "@emotion/styled";
import { display, height, space, width } from "styled-system";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Subscription from "react-apollo/Subscriptions";
import ApolloProvider from "react-apollo/ApolloProvider";
import Grid from "@material-ui/core/Grid/Grid";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Cell,
  ResponsiveContainer
} from "recharts";

import "./App.css";

import { apolloClient } from "./client";
import { ActionMap, SearchResult } from "./models";
import { subscribeTransactions } from "./graphql";

const Container: React.ComponentType<any> = styled.div`
  ${space};
  ${width};
  ${height};
  ${display};
`;

const GithubContainer: React.ComponentType<any> = styled.div`
  padding-left: 10px;
  &:hover{
    cursor: pointer;
  };
  &:hover path {
    color: #ff4660;
  };
`;

/**
 * React application implementing the average action rates widget using
 * the apollo client and dfuse apis
 * the subscription is bootstrapped by the 'renderSubscriber' method
 * coupled with the ApolloProvider (see main 'render()' method)
 * the packages material-ui and recharts are used for the table render and charts respectively
**/
export class App extends Component<any, { topActions: string[] }> {
  actionsMap: ActionMap = {};
  interval: any = undefined;
  startTime = 0;
  startTimeString = "";
  endTime = 0;

  state = { topActions: [] };

  get sortedActionKeys() {
    return Object.keys(this.actionsMap).sort((a, b) => {
      return this.actionsMap[b] - this.actionsMap[a];
    });
  }

  get timeRange() {
    let timeRange = (this.endTime - this.startTime) / (60 * 1000);
    if (timeRange === 0) {
      timeRange = 1;
    }

    return timeRange;
  }

  /**
   * Using a setInterval throttles the render refresh to increase both
   * performance and user experience.
   **/
  componentDidMount(): void {
    this.interval = setInterval(() => {
      this.setState({ topActions: this.sortedActionKeys.slice(0, 50) });
    }, 3500);
  }

  componentWillUnmount(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }
  }

  onSubscriptionData = ({ client, subscriptionData }: any) => {
    const { undo, trace } = (subscriptionData.data.searchTransactionsForward) as SearchResult;

    if (this.startTime === 0) {
      this.startTimeString = trace.block.timestamp;
      this.startTime = new Date(this.startTimeString).getTime();
    }

    this.endTime = new Date(trace.block.timestamp).getTime();

    trace.executedActions.forEach((action) => {
      const key = `${action.account}:${action.name}`;
      const increment = undo ? -1 : 1;

      this.actionsMap[key] = (this.actionsMap[key] || 0) + increment;
    });

    const height = document.getElementsByClassName("App")[0].clientHeight
    window.parent.postMessage({"height": height}, "*")
  };

  renderActions(): JSX.Element[] {
    return this.state.topActions.map((topAction: string, index: number) => {
      return (
        <TableRow key={index}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{topAction.split(":")[0]}</TableCell>
          <TableCell>{topAction.split(":")[1]}</TableCell>
          <TableCell>
            {Math.floor(this.actionsMap[topAction] / this.timeRange)}
          </TableCell>
        </TableRow>
      );
    });
  }

  renderLoading() {
    return <p>Loading...</p>;
  }

  renderSubscriber() {
    return <Subscription
      subscription={subscribeTransactions}
      variables={{ cursor: "", lowBlockNum: -100 }}
      onSubscriptionData={this.onSubscriptionData}
    />
  }

  renderWidgets() {
    const data = this.state.topActions.slice(0, 10).map((topAction: string) => {
      return {
        name: topAction.split(":")[0],
        value: Math.floor(this.actionsMap[topAction] / this.timeRange)
      };
    });

    return [
      <div key="1" style={{ width: "100%", height: 300, paddingBottom: "50px" }}>
        <ResponsiveContainer>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis scale="log" domain={["auto", "auto"]} />
            <Bar dataKey="value" fill="#1c1e3e" label={{ position: "top" }}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#1c1e3e" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>,
      <Container key="2">
        <Grid xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Count per minute</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.renderActions()}</TableBody>
          </Table>
        </Grid>
      </Container>
    ];
  }
  goToGithub() {
          window.top.location.href="https://github.com/streamingfast/example-stream-action-rates"
  }
  render() {
    return (
      <div className="App">
        <ApolloProvider client={apolloClient}>
          {this.renderSubscriber()}
          <div>
            <h2 style={{ color: "#1c1e3e", paddingTop: "40px" }}>
              Average action rates since {this.startTimeString}
            </h2>
            <h3 style={{ color: "#777", paddingTop: "20px" }}>
              Example React application using dfuse GraphQL API
              <GithubContainer style={{ display: "inline-block" }} onClick={this.goToGithub} >
                <FontAwesomeIcon icon={faGithub} color="#777"/>
              </GithubContainer>
            </h3>
          </div>
          {this.state.topActions.length > 0
            ? this.renderWidgets()
            : this.renderLoading()}
        </ApolloProvider>
      </div>
    );
  }
}
