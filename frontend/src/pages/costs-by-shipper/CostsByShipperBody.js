import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import Title from '../../components/Title.js';
import FiltersBar from '../../components/FiltersBar.js';
import Grid from '../../components/Grid.js';
import PagingBar from '../../components/PagingBar.js';
import IconCost from '../../components/icons/IconCost.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';

const CostsByShipperBody = ReactRouterDOM.withRouter(function () {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);
  const [count, setCount] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const pageSize = 10;
  const [filtersValues, setFiltersValues] = React.useState([null, null]);
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    setPageNumber(1);
    loadCount();
  }, [filtersValues]);

  React.useEffect(() => {
    loadRecords();
  }, [pageNumber, filtersValues]);

  const fetchDataSourceShipperId = async function () {
    let records = null;
    try {
      records = await ApiService.getShippers(null);
    }
    catch (error) {
      setError(error);
      return;
    }
    return records.map((record) => [record.shipperId, record.name]);
  }
  
  const loadCount = async function () {
    try {
      const args = {};
      if (filtersValues[1] !== null && filtersValues[1] !== undefined) {
        args.shipperIds = filtersValues[1].join(',');
      }
      setCount(await ApiService.getCountBookings(args));
    }
    catch (error) {
      setError(error);
      return;
    }
  }
  
  const loadRecords = async function () {
    let records = null;
    try {
      const args = {};
      if (filtersValues[0] !== null && filtersValues[0] !== undefined && filtersValues[0][0] !== null && filtersValues[0][0] !== undefined) {
        args.departureDateFrom = filtersValues[0][0];
      }
      if (filtersValues[0] !== null && filtersValues[0] !== undefined && filtersValues[0][1] !== null && filtersValues[0][1] !== undefined) {
        args.departureDateTo = filtersValues[0][1];
      }
      if (filtersValues[1] !== null && filtersValues[1] !== undefined) {
        args.shipperIds = filtersValues[1].join(',');
      }
      args.offset = (pageNumber - 1) * pageSize;
      args.limit = pageSize;
      records = await ApiService.getBookingsV2(args);
    }
    catch (error) {
      setError(error);
      return;
    }
    setItems(records.map((record, index) => ({
      key: record.bookingId,
      data: [
        record.departureDate,
        record.shipperName,
        record.contractCustomerName,
        record.contractCode,
        record.code,
        record.cost,
      ],
      record: record
    })));
  }
  
  const refreshMe = async function () {
    await loadCount();
    await loadRecords();
  }
  
  return (
    <div>
      <div className="section-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          <Title icon={IconCost} label={words.costsByShipper} />
          <FiltersBar
            filters={[
              {
                label: words.date,
                variant: 'date-range'
              },
              {
                label: words.shipper,
                variant: 'option',
                loader: fetchDataSourceShipperId
              },
            ]}
            filtersValues={filtersValues}
            setFiltersValues={setFiltersValues}
          />
        </div>
        <div className="flex-grow-1" />
        <div className="d-flex align-items-center">
        </div>
      </div>
      <div>
        <Grid
          contextualActions={[
          ]}
          fields={[
            {
              label: words.date,
              type: 'date',
              bindIndex: 0,
            },
            {
              label: words.shipper,
              type: 'string',
              bindIndex: 1,
            },
            {
              label: words.customer,
              type: 'string',
              bindIndex: 2,
            },
            {
              label: words.contract,
              type: 'string',
              breakpoint: 'md',
              bindIndex: 3,
            },
            {
              label: words.booking,
              type: 'string',
              breakpoint: 'md',
              bindIndex: 4,
            },
            {
              label: words.cost,
              type: 'money',
              alignment: 'right',
              breakpoint: 'xl',
              bindIndex: 5,
            },
          ]}
          items={items}
        />
        {count !== null && count !== undefined ?
          <PagingBar
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            countOfItems={count}
            countOfPages={Math.ceil(count/pageSize)}
          /> :
          null
        }
      </div>
    </div>
  );
})

export default CostsByShipperBody;
