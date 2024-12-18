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
import { protect } from '../../utils/protect.js';

const CostsByTransporterBody = ReactRouterDOM.withRouter(function () {
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

  const fetchDataSourceTransporterId = async function () {
    let records = null;
    try {
      records = await ApiService.getTransporters(null);
    }
    catch (error) {
      setError(error);
      return;
    }
    return records.map((record) => [record.transporterId, record.name]);
  }
  
  const loadCount = async function () {
    try {
      const args = {};
      if (filtersValues[1] !== null && filtersValues[1] !== undefined) {
        args.transporterIds = filtersValues[1].join(',');
      }
      setCount(await ApiService.getCountCargosV2(args));
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
        args.dispatchedDateFrom = filtersValues[0][0];
      }
      if (filtersValues[0] !== null && filtersValues[0] !== undefined && filtersValues[0][1] !== null && filtersValues[0][1] !== undefined) {
        args.dispatchedDateTo = filtersValues[0][1];
      }
      if (filtersValues[1] !== null && filtersValues[1] !== undefined) {
        args.transporterIds = filtersValues[1].join(',');
      }
      args.offset = (pageNumber - 1) * pageSize;
      args.limit = pageSize;
      records = await ApiService.getCargosV2(args);
    }
    catch (error) {
      setError(error);
      return;
    }
    setItems(records.map((record, index) => ({
      key: record.cargoId,
      data: [
        record.dispatchedDate,
        record.transporterName,
        record.bookingContractCustomerName,
        record.bookingContractCode,
        record.bookingCode,
        record.baseCost,
        record.additionalCost,
        protect(function ([baseCost, additionalCost]) { return baseCost + additionalCost }, [ record.baseCost, record.additionalCost ]),
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
          <Title icon={IconCost} label={words.costsByTransporter} />
          <FiltersBar
            filters={[
              {
                label: words.date,
                variant: 'date-range'
              },
              {
                label: words.transporter,
                variant: 'option',
                loader: fetchDataSourceTransporterId
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
              label: words.transporter,
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
              label: words.baseCostFull,
              type: 'money',
              alignment: 'right',
              breakpoint: 'xl',
              bindIndex: 5,
            },
            {
              label: words.additionalCostFull,
              type: 'money',
              alignment: 'right',
              breakpoint: 'xl',
              bindIndex: 6,
            },
            {
              label: words.totalCostFull,
              type: 'money',
              alignment: 'right',
              breakpoint: 'xl',
              bindIndex: 7,
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

export default CostsByTransporterBody;
