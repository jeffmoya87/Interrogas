import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import './campaign.css';

function SurveysChild(props) {
    const mapSurveys = (survey) => {
        return (
            <tr key={survey.id}>
                <th>{survey.name}</th>
                <th>{survey.description}</th>
            </tr>
        );
    };

    return (
        <Table responsive className="tableFixHead table-centered">
            <thead>{props.surveyArr.map(mapSurveys)}</thead>
        </Table>
    );
}

SurveysChild.propTypes = {
    surveyArr: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
        }).isRequired
    ).isRequired,
};

export default SurveysChild;
