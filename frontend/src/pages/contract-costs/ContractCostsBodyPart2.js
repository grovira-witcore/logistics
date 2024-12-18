import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import TreeGrid from '../../components/TreeGrid.js';
import IconContract from '../../components/icons/IconContract.js';
import IconBooking from '../../components/icons/IconBooking.js';
import IconCargo from '../../components/icons/IconCargo.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';
import { protect } from '../../utils/protect.js';

const ContractCostsBodyPart2 = ReactRouterDOM.withRouter(function ({ contract }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    refreshMe();
  }, [contract]);

  const refreshMe = async function () {
    const items = [];
    let recordsROOT = null;
    try {
      const argsROOT = {};
      if (contract.contractId !== null && contract.contractId !== undefined) {
        argsROOT.contractContractId = contract.contractId;
      }
      recordsROOT = await ApiService.getContracts(argsROOT);
    }
    catch (error) {
      setError(error);
      return;
    }
    items.push(...recordsROOT.map((recordROOT, indexROOT) => ({
      levelKey: 'ROOT',
      key: recordROOT.contractId,
      data: [
        recordROOT.code,
        recordROOT.baseCost,
        recordROOT.additionalCost,
        protect(function ([baseCost, additionalCost]) { return baseCost + additionalCost; }, [ recordROOT.baseCost, recordROOT.additionalCost ]),
      ],
      record: recordROOT
    })));
    let recordsRTwqYD3s = null;
    try {
      const argsRTwqYD3s = {};
      if (contract.contractId !== null && contract.contractId !== undefined) {
        argsRTwqYD3s.parentcontractContractId = contract.contractId;
      }
      recordsRTwqYD3s = await ApiService.getBookings(argsRTwqYD3s);
    }
    catch (error) {
      setError(error);
      return;
    }
    items.push(...recordsRTwqYD3s.map((recordRTwqYD3s, indexRTwqYD3s) => ({
      levelKey: 'RTwqYD3s',
      key: recordRTwqYD3s.bookingId,
      parentLevelKey: 'ROOT',
      parentKey: recordRTwqYD3s.contractId,
      data: [
        recordRTwqYD3s.code,
        recordRTwqYD3s.shipperName,
        recordRTwqYD3s.cost,
        recordRTwqYD3s.cost,
      ],
      record: recordRTwqYD3s
    })));
    let records3nxAJPnW = null;
    try {
      const args3nxAJPnW = {};
      if (contract.contractId !== null && contract.contractId !== undefined) {
        args3nxAJPnW.parentparentcontractContractId = contract.contractId;
      }
      records3nxAJPnW = await ApiService.getCargos(args3nxAJPnW);
    }
    catch (error) {
      setError(error);
      return;
    }
    items.push(...records3nxAJPnW.map((record3nxAJPnW, index3nxAJPnW) => ({
      levelKey: '3nxAJPnW',
      key: record3nxAJPnW.cargoId,
      parentLevelKey: 'RTwqYD3s',
      parentKey: record3nxAJPnW.bookingId,
      data: [
        record3nxAJPnW.code,
        record3nxAJPnW.transporterName,
        record3nxAJPnW.baseCost,
        record3nxAJPnW.additionalCost,
        protect(function ([baseCost, additionalCost]) { return baseCost + additionalCost; }, [ record3nxAJPnW.baseCost, record3nxAJPnW.additionalCost ]),
      ],
      record: record3nxAJPnW
    })));
    setItems(items);
  }
  
  return (
    <div>
      <TreeGrid
        levels={[
          {
            key: 'ROOT',
            contextualActions: [
            ],
            fields: [
              {
                icon: IconContract,
                type: 'string',
                bindIndex: 0,
              },
              {
                label: words.company,
              },
              {
                label: words.baseCostFull,
                type: 'money',
                frame: true,
                alignment: 'right',
                bindIndex: 1,
                fontWeight: 'bold',
              },
              {
                label: words.additionalCostFull,
                type: 'money',
                frame: true,
                alignment: 'right',
                breakpoint: 'md',
                bindIndex: 2,
                fontWeight: 'bold',
              },
              {
                label: words.totalCostFull,
                type: 'money',
                frame: true,
                alignment: 'right',
                breakpoint: 'md',
                bindIndex: 3,
                color: 'blue',
                fontWeight: 'bold',
              },
            ],
            expanded: true,
          },
          {
            key: 'RTwqYD3s',
            parentKey: 'ROOT',
            label: words.bookings,
            contextualActions: [
            ],
            fields: [
              {
                icon: IconBooking,
                type: 'string',
                bindIndex: 0,
              },
              {
                type: 'string',
                bindIndex: 1,
              },
              {
                type: 'money',
                alignment: 'right',
                bindIndex: 2,
              },
              {
                breakpoint: 'md',
              },
              {
                type: 'money',
                alignment: 'right',
                breakpoint: 'md',
                bindIndex: 3,
              },
            ],
            expanded: true,
          },
          {
            key: '3nxAJPnW',
            parentKey: 'RTwqYD3s',
            label: words.cargos,
            contextualActions: [
            ],
            fields: [
              {
                icon: IconCargo,
                type: 'string',
                bindIndex: 0,
              },
              {
                type: 'string',
                bindIndex: 1,
              },
              {
                type: 'money',
                alignment: 'right',
                bindIndex: 2,
              },
              {
                type: 'money',
                alignment: 'right',
                breakpoint: 'md',
                bindIndex: 3,
              },
              {
                type: 'money',
                alignment: 'right',
                breakpoint: 'md',
                bindIndex: 4,
              },
            ],
          },
        ]}
        items={items}
      />
    </div>
  );
})

export default ContractCostsBodyPart2;
