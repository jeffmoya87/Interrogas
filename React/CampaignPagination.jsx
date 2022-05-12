import React from 'react';
import { Row, ButtonGroup, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CampaignPagination = (props) => {
    const startIndex = props.startIndex;
    const endIndex = props.endIndex < props.total ? props.endIndex : props.total;
    const page = props.page + 1;
    const totalRecords = props.total;
    const pageSize = props.pageSize;
    const sizePerPageList = [
        {
            text: '5',
            value: 5,
        },
        {
            text: '10',
            value: 10,
        },
        {
            text: 'All',
            value: props.total,
        },
    ];

    const paginationSizeHandler = (size) => {
        props.onSetPaginationSize(parseInt(size.target.value));
    };

    const mapPageSize = (pageSize, index) => {
        return (
            <option key={index} value={pageSize.value}>
                {pageSize.text}
            </option>
        );
    };

    return (
        <Row className="mt-2">
            <Col className="mt-auto mb-auto">
                Showing {startIndex} - {endIndex} of {totalRecords}
            </Col>
            <Col md="auto" style={{ paddingRight: '75px' }}>
                <label className="me-1">Display :</label>
                <select value={pageSize} onChange={paginationSizeHandler} className="form-select d-inline-block w-auto">
                    {sizePerPageList.map(mapPageSize)}
                </select>
            </Col>
            <Col xs lg="2">
                <ButtonGroup className="float-end">
                    {props.page === 0 ? (
                        <Button variant="light" className="btn-sm" disabled>
                            <i className="mdi mdi-chevron-left"></i>
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            className="btn-sm"
                            key="prevPage"
                            value="prevPage"
                            name="prevPage"
                            id="prevPage"
                            onClick={props.onGetPrevPage}>
                            <i className="mdi mdi-chevron-left"></i>
                        </Button>
                    )}
                    {page < props.totalPages ? (
                        <Button
                            variant="primary"
                            className="btn-sm"
                            key="nextPage"
                            value="nextPage"
                            name="nextPage"
                            id="nextPage"
                            onClick={props.onGetNextPage}>
                            <i className="mdi mdi-chevron-right"></i>
                        </Button>
                    ) : (
                        <Button variant="light" className="btn-sm" disabled>
                            <i className="mdi mdi-chevron-right"></i>
                        </Button>
                    )}
                </ButtonGroup>
            </Col>
        </Row>
    );
};

CampaignPagination.propTypes = {
    total: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    startIndex: PropTypes.number.isRequired,
    endIndex: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    onGetPrevPage: PropTypes.func.isRequired,
    onGetNextPage: PropTypes.func.isRequired,
    onSetPaginationSize: PropTypes.func.isRequired,
};

export default React.memo(CampaignPagination);
