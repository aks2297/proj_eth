import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Container, Header, Divider, Button, Message } from 'semantic-ui-react';
import { push } from 'react-router-redux';

import CreateProjectModal from '../components/createProjectModal';
import ProjectList from '../components/projectList';
import {createProject, fetchProjects} from '../actions/fundingHubActions';


var _this;

class HomeContainer extends Component {

    constructor(props) {
        super(props);
        _this = this;

        this.state = {
            showCreateProjectModal: false
        }
    }

    componentDidMount() {
        const {dispatch} = _this.props;
        dispatch(fetchProjects());
    }

    toggleModalDisplayed() {
        _this.setState({
            showCreateProjectModal: !_this.state.showCreateProjectModal
        });
    }

    handleCreateProjectClicked() {
        _this.toggleModalDisplayed();
    }

    handleCreateProject(project) {
        const {dispatch, user} = _this.props;

        _this.toggleModalDisplayed();

        let selectedUserAddress = user.accounts[user.selectedAccount].address;

        if (!!selectedUserAddress) {
            dispatch(createProject(project, selectedUserAddress))
            .then(() => {
                dispatch(fetchProjects());
            });
        }
    }

    handleProjectClicked(projectAddress) {
        const { dispatch } = _this.props;
        dispatch(push(`/project/${projectAddress}`));
    }

    getProjectsMessage(fundingHub) {
        if (fundingHub.fetchComplete && fundingHub.projects.length === 0) {
            return (
                <Message warning>
                    <Message.Header>No projects found</Message.Header>
                    <p>Start a crowdfunding project by clicking the button above</p>
                </Message> 
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <Container>
                <Header as='h1'>Explore projects</Header>
                <p>Fundup is a decentralized crowdfunding platform built on Ethereum. We aim to provide a platform for enthusiasts who have great ideas and aspire to launch their own start-up. Through this platform they can advertise their ideas as well as get the attention of worthy investors who would like to contribute.</p>
                <Button 
                    primary
                    onClick={this.handleCreateProjectClicked}>
                    Create a project
                </Button>
                <Divider/>
                <ProjectList 
                    projects={this.props.fundingHub.projects}
                    isLoading={this.props.fundingHub.isFetching}
                    blockNumber={this.props.network.currentBlock}
                    onProjectClicked={this.handleProjectClicked}/>
                {this.getProjectsMessage(this.props.fundingHub)}
                <CreateProjectModal
                    isDisplayed={this.state.showCreateProjectModal}
                    gasCost={300000}
                    blockNumber={this.props.network.blockNumber}
                    onCloseModal={this.toggleModalDisplayed}
                    onHandleProjectCreate={this.handleCreateProject}/>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        network: state.network,
        fundingHub: state.fundingHub,
    }
}

export default connect(mapStateToProps)(HomeContainer);
