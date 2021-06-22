import React from 'react';
import { useSelector } from 'react-redux';
import { ViewState } from 'src/redux/slices/view/types';
import { Pages } from '../../common/enums';
import { viewSelector } from '../../redux/slices/view/selectors';
import { Car } from '../Car';
import { Devs } from '../Devs';
import ErrorsInfo from '../ErrorsInfo';
import Harting from '../Harting';
import { Tests } from '../Tests';

export const MainContent: React.FC = () => {
  const { page }: ViewState = useSelector(viewSelector);

  const mainContent: Record<Pages, JSX.Element> = {
    [Pages.CAR]: <Devs />,
    [Pages.CLIMAT]: <Devs />,
    [Pages.DEVS]: <Devs />,
    [Pages.HARTING]: <Harting />,
    [Pages.ERRORS]: <ErrorsInfo />,
    [Pages.EXTRA]: <Car />,
    [Pages.TESTS]: <Tests />,
  };

  return mainContent[page] || null;
};
