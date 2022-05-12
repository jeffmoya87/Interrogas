import React from 'react';
import 'jsvectormap';
import 'jsvectormap/dist/maps/world.js';
import PropTypes from 'prop-types';
import BaseVectorMap from './BaseVectorMap';

const WorldVectorMap = ({ width, height, options }) => {
    return (
        <>
            <BaseVectorMap width={width} height={height} options={options} type="world" />
        </>
    );
};

WorldVectorMap.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    options: PropTypes.shape({}),
    type: PropTypes.string,
};

export default WorldVectorMap;
