var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import * as SynapseConstants from 'lib/utils/SynapseConstants';
var uuidv4 = require('uuid/v4');
var cloneDeep = require('lodash.clonedeep');

var Facets = function (_React$Component) {
    _inherits(Facets, _React$Component);

    function Facets(props) {
        _classCallCheck(this, Facets);

        var _this = _possibleConstructorReturn(this, (Facets.__proto__ || Object.getPrototypeOf(Facets)).call(this, props));

        _this.handleClick = function (dict) {
            return function (event) {
                var selectedFacets = cloneDeep(_this.state.selectedFacets); // deep copy

                // if there is no entry for this column name into the selection of facets
                if (!selectedFacets.hasOwnProperty(dict.name)) {
                    var newEntry = {
                        columnName: dict.name,
                        concreteType: "org.sagebionetworks.repo.model.table.FacetColumnValuesRequest",
                        facetValues: []
                    };
                    selectedFacets[dict.name] = newEntry;
                }

                // grab the facet values assoicated for this column
                var specificFacet = selectedFacets[dict.name];
                // if its not selected then we add as having been chosen, otherwise we 
                // have to delete it
                if (!dict.isSelected) {
                    specificFacet.facetValues.push(dict.value);
                } else {
                    // remove value
                    specificFacet.facetValues.splice(specificFacet.facetValues.indexOf(dict.value), 1);
                }

                _this.setState({
                    selectedFacets: selectedFacets,
                    facetDataIsFetching: true
                });

                var sql = _this.props.sql;


                var selectedFacetsFormatted = Object.keys(selectedFacets).map(function (key) {
                    return selectedFacets[key];
                });

                var queryRequest = {
                    concreteType: "org.sagebionetworks.repo.model.table.QueryBundleRequest",
                    partMask: SynapseConstants.BUNDLE_MASK_QUERY_COLUMN_MODELS | SynapseConstants.BUNDLE_MASK_QUERY_FACETS,
                    query: {
                        isConsistent: true,
                        sql: sql,
                        limit: 1,
                        selectedFacets: selectedFacetsFormatted
                    }
                };

                _this.props.updateQueryRequest(queryRequest);
            };
        };

        _this.makeBundleQueryRequest = _this.makeBundleQueryRequest.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.state = {
            selectedFacets: {}
        };
        return _this;
    }

    _createClass(Facets, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.makeBundleQueryRequest();
        }
    }, {
        key: 'makeBundleQueryRequest',
        value: function makeBundleQueryRequest() {
            var selectedFacets = {};
            this.props.data.facets.forEach(function (element) {
                if (element.facetType === "enumeration") {
                    var selection = [];
                    element.facetValues.forEach(function (facetValue) {
                        if (facetValue.isSelected) {
                            selection.push(facetValue.value);
                        }
                    });
                    if (selection.length > 0) {
                        selectedFacets[element.columnName] = {
                            columnName: element.columnName,
                            facetValues: selection,
                            concreteType: "org.sagebionetworks.repo.model.table.QueryBundleRequest"
                        };
                    }
                }
            });
        }
    }, {
        key: 'showFacetFilter',
        value: function showFacetFilter() {
            var _this2 = this;

            // iterate through the loaded data and write out the appropriate checkboxes,
            // filling in the state of the checkboxes according to the current selection
            if (this.state) {
                var structuredRender = [];
                this.props.data.facets.forEach(function (element) {
                    if (element.facetType === "enumeration") {
                        var children = [];
                        element.facetValues.forEach(function (facetValue) {
                            var key = uuidv4();
                            var checked = false;
                            var chosen = _this2.state.selectedFacets[element.columnName];
                            if (chosen && chosen.facetValues.indexOf(facetValue.value) !== -1) {
                                checked = true;
                            }
                            children.push(React.createElement(
                                'div',
                                { key: key },
                                React.createElement('input', { checked: checked, onChange: _this2.handleClick({ name: element.columnName, value: facetValue.value, isSelected: checked }), id: key, type: 'checkbox' }),
                                React.createElement(
                                    'label',
                                    { htmlFor: key },
                                    facetValue.value + (' (' + facetValue.count + ')')
                                )
                            ));
                        });
                        var name = React.createElement(
                            'strong',
                            null,
                            ' ',
                            element.columnName,
                            ' '
                        );
                        var formatted = React.createElement(
                            'div',
                            { key: uuidv4() },
                            name,
                            children.map(function (child) {
                                return child;
                            })
                        );
                        structuredRender.push(formatted);
                    }
                });
                return React.createElement(
                    'div',
                    null,
                    structuredRender.map(function (element) {
                        return element;
                    })
                );
            }
        }

        // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9

    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return React.createElement(
                'div',
                { className: 'container' },
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-xs-6' },
                        React.createElement(
                            'form',
                            null,
                            React.createElement(
                                'div',
                                { className: 'form-group' },
                                this.showFacetFilter()
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-xs-6' },
                        React.createElement(
                            'h5',
                            null,
                            React.createElement(
                                'strong',
                                null,
                                ' Current selection '
                            ),
                            ' '
                        ),
                        this.state.selectedFacets && Object.keys(this.state.selectedFacets).map(function (key) {
                            var string = Array.from(_this3.state.selectedFacets[key].facetValues).join(", ");
                            return React.createElement(
                                'p',
                                { key: uuidv4() },
                                ' ',
                                key,
                                ' : ',
                                string,
                                ' '
                            );
                        }),
                        React.createElement(
                            'h5',
                            null,
                            React.createElement(
                                'strong',
                                null,
                                ' Results'
                            ),
                            ' '
                        ),
                        JSON.stringify(this.props.data)
                    )
                )
            );
        }
    }]);

    return Facets;
}(React.Component);

export default Facets;


Facets.propTypes = {
    makeQueryRequest: PropTypes.bool
};

Facets.defaultProps = {
    makeQueryRequest: true
};