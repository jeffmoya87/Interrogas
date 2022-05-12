import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import './campaign.css';

function ElectionResultsChild(props) {
    const mapResults = (result) => {
        let dateConvert = new Date(result.electionDate).toDateString();

        return (
            <tr key={`${result.electionId}_${result.candidateId}`}>
                <td>
                    <span className="text-muted font-13">
                        <img
                            src={result.avatarUrl}
                            alt="Code"
                            className="rounded-circle"
                            style={{ maxWidth: 400, height: 50 }}
                        />
                    </span>
                </td>
                <td>
                    <h5 className="font-14 my-1 fw-normal">Candidate</h5>
                    <span className="text-muted font-13">
                        {result.givenName} {result.surnames}
                    </span>
                </td>
                <td>
                    <h5 className="font-14 my-1 fw-normal">Party</h5>
                    <span className="text-muted font-13">{result.party}</span>
                </td>
                <td>
                    <h5 className="font-14 my-1 fw-normal">Election Date</h5>
                    <span className="text-muted font-13">{dateConvert}</span>
                </td>
                <td>
                    <h5 className="font-14 my-1 fw-normal">Votes</h5>
                    <span className="text-muted font-13">{result.votes}</span>
                </td>
                <td>
                    <h5 className="font-14 my-1 fw-normal">Percentage</h5>
                    <span className="text-muted font-13">
                        {' '}
                        <ProgressBar
                            now={`${result.percentage}`}
                            label={`${result.percentage}`}
                            style={{ height: '12px' }}
                        />
                    </span>
                </td>
            </tr>
        );
    };

    return (
        <Table responsive className="tableFixHead table-centered">
            <tbody>{props.resultsArr.map(mapResults)}</tbody>
        </Table>
    );
}

ElectionResultsChild.propTypes = {
    resultsArr: PropTypes.arrayOf(
        PropTypes.shape({
            givenName: PropTypes.string.isRequired,
            surnames: PropTypes.string.isRequired,
            party: PropTypes.string.isRequired,
            votes: PropTypes.number.isRequired,
            percentage: PropTypes.number.isRequired,
            avatarUrl: PropTypes.string.isRequired,
            electionDate: PropTypes.string.isRequired,
            electionId: PropTypes.number.isRequired,
            candidateId: PropTypes.number.isRequired,
        }).isRequired
    ).isRequired,
};

export default ElectionResultsChild;
