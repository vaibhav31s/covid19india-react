import Row from '../../components/row';
import {STATE_NAMES} from '../../constants';

import {fireEvent, render} from '@testing-library/react';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';

const stateCode = 'AN';
const data = {
  districts: {
    'North and Middle Andaman': {
      total: {
        confirmed: 1,
        recovered: 1,
      },
    },
    'South Andaman': {
      total: {
        confirmed: 32,
        recovered: 32,
      },
    },
  },
  meta: {
    last_updated: '2020-05-22',
    tested: {
      last_updated: '2020-05-22',
      source: 'https://t.me/Covid19india_Auxiliary_Test_Data/117?single',
    },
  },
  total: {
    confirmed: 33,
    recovered: 33,
    tested: 7263,
  },
};

describe('Row component', () => {
  const RealDate = Date;

  const renderRow = () =>
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <Row {...{stateCode, data}} />
          </tbody>
        </table>
      </MemoryRouter>
    ).container;

  beforeAll(() => {
    const mockedDate = new Date('2020-05-24');
    global.Date = class extends Date {
      constructor(date) {
        if (date) return new RealDate(date); // because Row component is using new Date()
        return mockedDate;
      }
    };
  });

  afterAll(() => {
    global.Date = RealDate;
  });

  test('State/UT details', () => {
    const container = renderRow();
    const stateSelector = container.querySelectorAll('tr.state');
    const cells = stateSelector[0].querySelectorAll('td');

    const stateName = cells[0].textContent;
    const confirmed = cells[1].textContent;
    const active = cells[2].textContent;
    const recovered = cells[3].textContent;
    const deaths = cells[4].textContent;

    expect(stateSelector).toHaveLength(1);
    expect(cells).toHaveLength(5);
    expect(stateName).toContain(STATE_NAMES[stateCode]);
    expect(confirmed).toEqual('33');
    expect(active).toEqual('0');
    expect(recovered).toEqual('33');
    expect(deaths).toEqual('0');
  });

  test('Districts and the confirmed cases', () => {
    const container = renderRow();
    const stateRow = container.querySelectorAll('tr.state');
    expect(stateRow).toHaveLength(1);

    fireEvent.click(stateRow[0]);

    const districtsSelector = container.querySelectorAll('tr.district');
    const stateLastUpdate = container.querySelectorAll('tr.state-last-update');
    const stateLastUpdateTime = stateLastUpdate[0].querySelectorAll('td > p');

    expect(districtsSelector).toHaveLength(2);
    expect(stateLastUpdateTime[1].textContent).toMatch(/2 days ago/i);

    districtsSelector.forEach((e, index) => {
      const cells = e.querySelectorAll('td');
      const district = cells[0].children[0].textContent;
      const confirmedNumber = cells[1].textContent;

      expect(data.districts[district].total).not.toBeUndefined();
      expect(data.districts[district].total['confirmed']).toEqual(
        parseInt(confirmedNumber)
      );
    });
  });
});
