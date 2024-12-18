import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import Title from '../../components/Title.js';
import FiltersBar from '../../components/FiltersBar.js';
import Grid from '../../components/Grid.js';
import PagingBar from '../../components/PagingBar.js';
import IconBooking from '../../components/icons/IconBooking.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';
import { protect } from '../../utils/protect.js';

const BookingsBody = ReactRouterDOM.withRouter(function () {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);
  const history = ReactRouterDOM.useHistory();
  const [count, setCount] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const pageSize = 10;
  const [filtersValues, setFiltersValues] = React.useState([null, null, null]);
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
  
  const fetchDataSourceContractId = async function () {
    let records = null;
    try {
      records = await ApiService.getContracts(null);
    }
    catch (error) {
      setError(error);
      return;
    }
    return records.map((record) => [record.contractId, record.code]);
  }
  
  const loadCount = async function () {
    try {
      const args = {};
      if (filtersValues[0] !== null && filtersValues[0] !== undefined) {
        args.shipperIds = filtersValues[0].join(',');
      }
      if (filtersValues[1] !== null && filtersValues[1] !== undefined) {
        args.contractIds = filtersValues[1].join(',');
      }
      if (filtersValues[2] !== null && filtersValues[2] !== undefined) {
        args.statuss = filtersValues[2].join(',');
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
      if (filtersValues[0] !== null && filtersValues[0] !== undefined) {
        args.shipperIds = filtersValues[0].join(',');
      }
      if (filtersValues[1] !== null && filtersValues[1] !== undefined) {
        args.contractIds = filtersValues[1].join(',');
      }
      if (filtersValues[2] !== null && filtersValues[2] !== undefined) {
        args.statuss = filtersValues[2].join(',');
      }
      args.offset = (pageNumber - 1) * pageSize;
      args.limit = pageSize;
      records = await ApiService.getBookings(args);
    }
    catch (error) {
      setError(error);
      return;
    }
    setItems(records.map((record, index) => ({
      key: record.bookingId,
      data: [
        record.code,
        record.shipperName,
        record.contractCustomerName,
        record.contractCode,
        record.totalCargos,
        record.departureDate,
        record.arrivalDate,
        record.status,
        protect(function ([value]) { return value === 'inProgress' ? 'yellow' : (value === 'completed' ? 'green' : null); }, [ record.status ]),
        protect(function ([kgDelivered, kgTarget]) { return kgDelivered / kgTarget }, [ record.kgDelivered, record.kgTarget ]),
        protect(function ([kgDelivered, kgDispatched, kgTarget]) { return (kgDispatched - kgDelivered) / kgTarget }, [ record.kgDelivered, record.kgDispatched, record.kgTarget ]),
      ],
      record: record
    })));
  }
  
  const refreshMe = async function () {
    await loadCount();
    await loadRecords();
  }
  
  const handleClickItem = async function (e, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    history.push('/booking/' + item.record.bookingId);
  }
  
  return (
    <div>
      <div className="section-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          <Title icon={IconBooking} label={words.bookings} />
          <FiltersBar
            filters={[
              {
                label: words.shipper,
                variant: 'option',
                loader: fetchDataSourceShipperId
              },
              {
                label: words.contract,
                variant: 'option',
                loader: fetchDataSourceContractId
              },
              {
                label: words.status,
                variant: 'option',
                dataSource: [['inProgress', words.inProgress], ['completed', words.completed]]
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
              label: words.code,
              type: 'string',
              bindIndex: 0,
              secondaryField: {
                type: 'string',
                bindIndex: 1,
              },
            },
            {
              label: words.customer,
              type: 'string',
              bindIndex: 2,
            },
            {
              label: words.contract,
              type: 'string',
              bindIndex: 3,
            },
            {
              label: words.totalCargos,
              type: 'integer',
              breakpoint: 'md',
              bindIndex: 4,
            },
            {
              label: words.departureDate,
              type: 'date',
              breakpoint: 'md',
              bindIndex: 5,
            },
            {
              label: words.arrivalDate,
              type: 'date',
              breakpoint: 'xl',
              bindIndex: 6,
            },
            {
              label: words.status,
              type: 'string',
              translate: true,
              frame: true,
              breakpoint: 'xl',
              bindIndex: 7,
              colorBindIndex: 8,
            },
            {
              label: words.progress,
              breakpoint: 'xl',
              progressBar: {
                fields: [
                  {
                    type: 'percentage',
                    bindIndex: 9,
                    color: 'green',
                  },
                  {
                    type: 'percentage',
                    bindIndex: 10,
                    color: 'yellow',
                  },
                ]
              },
            },
          ]}
          onClickItem={handleClickItem}
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

export default BookingsBody;
