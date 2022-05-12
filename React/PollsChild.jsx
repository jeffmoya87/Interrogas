import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import './campaign.css';

function PollsChild(props) {
    const mapPolls = (poll) => {
        let dateTakenConvert = new Date(poll.dateTaken).toDateString();

        return (
            <tr key={poll.id}>
                <th>{poll.pollster.name}</th>
                <th>{dateTakenConvert}</th>
                <th>{poll.electionYear}</th>
            </tr>
        );
    };

    return (
        <Table>
            <thead>{props.pollsArr.map(mapPolls)}</thead>
        </Table>
    );
}

PollsChild.propTypes = {
    pollsArr: PropTypes.arrayOf(
        PropTypes.shape({
            pollster: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
            dateTaken: PropTypes.string.isRequired,
            electionYear: PropTypes.number.isRequired,
            id: PropTypes.number.isRequired,
        }).isRequired
    ).isRequired,
};

export default PollsChild;
