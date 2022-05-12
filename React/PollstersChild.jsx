import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import './campaign.css';

function PollstersChild(props) {
    const mapPollsters = (pollster) => {
        return (
            <tr key={pollster.id}>
                <th>
                    <img
                        src={pollster.logoUrl}
                        style={{ height: '40px', width: '120px', minHeight: '40px', minWidth: '120px' }}
                        alt="Logo URL"
                    />
                </th>
                <th>
                    {' '}
                    <ProgressBar
                        now={Math.floor(Math.random() * 100)}
                        //label={}
                        style={{ width: '75px', height: '20px' }}
                    />
                </th>
            </tr>
        );
    };

    return (
        <Table responsive className="tableFixHead table-centered">
            <thead>{props.pollsterArr.map(mapPollsters)}</thead>
        </Table>
    );
}

PollstersChild.propTypes = {
    pollsterArr: PropTypes.arrayOf(
        PropTypes.shape({
            logoUrl: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
        }).isRequired
    ).isRequired,
};

export default PollstersChild;
